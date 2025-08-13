 // backend/controllers/simulationController.js
exports.runSimulation = async (req, res) => {
  try {
    const { drivers, startTime, maxHours } = req.body;

    if (!drivers || drivers <= 0) return res.status(400).json({ error: 'drivers must be > 0' });
    if (!startTime) return res.status(400).json({ error: 'startTime required (HH:MM)' });
    if (!maxHours || maxHours <= 0) return res.status(400).json({ error: 'maxHours must be > 0' });

    const allDrivers = await Driver.find();
    const routes = await Route.find().lean();
    const orders = await Order.find().lean();

    if (orders.length === 0) {
      return res.status(200).json({
        totalProfit: 0,
        efficiencyScore: "0.00",
        onTimeDeliveries: 0,
        lateDeliveries: 0,
        fuelCost: 0
      });
    }

    const N = Math.min(drivers, allDrivers.length);
    const selectedDrivers = allDrivers.slice(0, N);

    const routeMap = {};
    for (const r of routes) routeMap[r.route_id] = r;

    const fatigueFactor = (driver) => {
      const pw = driver.past_week_hours || [];
      const lastDayHours = (pw.length > 0) ? pw[pw.length - 1] : driver.shift_hours || 0;
      return lastDayHours > 8 ? (1 / 0.7) : 1;
    };

    const assignments = {};
    for (const driver of selectedDrivers) {
      assignments[driver._id] = [];
    }

    // Assign orders with maxHours limit
    let idx = 0;
    for (const order of orders) {
      let assigned = false;
      let attempts = 0;
      while (!assigned && attempts < selectedDrivers.length) {
        const driver = selectedDrivers[idx % selectedDrivers.length];
        const driverOrders = assignments[driver._id];

        const totalTimeForDriver = driverOrders.reduce((sum, o) => {
          const r = routeMap[o.route_id];
          return sum + (r ? Number(r.base_time_min) : 0);
        }, 0);

        if (totalTimeForDriver + (routeMap[order.route_id]?.base_time_min || 0) <= maxHours * 60) {
          assignments[driver._id].push(order);
          assigned = true;
        }

        idx++;
        attempts++;
      }
    }

    let totalProfit = 0;
    let onTimeCount = 0;
    let lateCount = 0;
    let totalFuelCost = 0;
    const LATE_PENALTY = 50;

    const startMinutes = convertTimeToMinutes(startTime);

    for (const driver of selectedDrivers) {
      const driverFactor = fatigueFactor(driver);
      const driverOrders = assignments[driver._id];
      let currentTime = startMinutes;

      for (const order of driverOrders) {
        const route = routeMap[order.route_id];
        if (!route) continue;

        const baseTime = Number(route.base_time_min);
        const actualTime = baseTime * driverFactor;

        currentTime += actualTime;

        const isOnTime = currentTime <= startMinutes + baseTime + 10;

        const penalty = isOnTime ? 0 : LATE_PENALTY;
        const bonus = (order.value_rs > 1000 && isOnTime) ? (0.10 * order.value_rs) : 0;

        let perKm = 5;
        if (route.traffic_level === 'High') perKm += 2;
        const fuelCost = perKm * Number(route.distance_km);

        const profit = Number(order.value_rs) + bonus - penalty - fuelCost;

        totalProfit += profit;
        totalFuelCost += fuelCost;

        if (isOnTime) onTimeCount++; else lateCount++;
      }
    }

    const efficiencyScore = ((onTimeCount / orders.length) * 100).toFixed(2);

    res.json({
      totalProfit: Math.round(totalProfit),
      efficiencyScore,
      onTimeDeliveries: onTimeCount,
      lateDeliveries: lateCount,
      fuelCost: Math.round(totalFuelCost)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Simulation error' });
  }
};

function convertTimeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}
