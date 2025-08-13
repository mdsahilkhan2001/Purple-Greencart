 const express = require("express");
const router = express.Router();
// const Driver = require("../models/driverModel");
const Driver = require('../models/Driver');


const RouteModel = require("../models/Route");

const Order = require("../models/Order");

// Utility: Convert HH:MM to minutes
function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
}

// Utility: Check if delivery is late
function isLate(deliveryTimeMin, baseTimeMin) {
  return deliveryTimeMin > baseTimeMin + 10; // 10 min grace
}

router.post("/", async (req, res) => {
  try {
    const { drivers, startTime, maxHours } = req.body;

    // ---- Validation ----
    if (!drivers || !startTime || !maxHours) {
      return res.status(400).json({ error: "Missing required parameters." });
    }
    if (drivers <= 0 || maxHours <= 0) {
      return res.status(400).json({ error: "Drivers and maxHours must be positive." });
    }
    if (!/^\d{2}:\d{2}$/.test(startTime)) {
      return res.status(400).json({ error: "Invalid startTime format. Use HH:MM." });
    }

    // ---- Fetch Data ----
    const allDrivers = await Driver.find();
    const allRoutes = await RouteModel.find();
    const allOrders = await Order.find();

    if (drivers > allDrivers.length) {
      return res.status(400).json({ error: "Driver count exceeds available drivers." });
    }

    let totalProfit = 0;
    let onTimeDeliveries = 0;
    let lateDeliveries = 0;
    let totalFuelCost = 0;

    // ---- Simulate ----
    allOrders.forEach((order) => {
      const route = allRoutes.find((r) => r.route_id === order.route_id);
      if (!route) return;

      // Fuel cost
      let fuelCost = route.distance_km * 5;
      if (route.traffic_level === "High") {
        fuelCost += route.distance_km * 2;
      }
      totalFuelCost += fuelCost;

      // Convert delivery_time to minutes
      const [h, m] = order.delivery_time.split(":").map(Number);
      const deliveryTimeMin = h * 60 + m;

      // Late or on-time check
      let penalty = 0;
      let bonus = 0;
      if (isLate(deliveryTimeMin, route.base_time_min)) {
        penalty = 50;
        lateDeliveries++;
      } else {
        onTimeDeliveries++;
        if (order.value_rs > 1000) {
          bonus = order.value_rs * 0.1;
        }
      }

      // Profit calculation
      const profit = order.value_rs + bonus - penalty - fuelCost;
      totalProfit += profit;
    });

    const efficiencyScore = (onTimeDeliveries / allOrders.length) * 100;

    // ---- Return KPIs ----
    res.json({
      totalProfit: Math.round(totalProfit),
      efficiencyScore: efficiencyScore.toFixed(2),
      onTimeDeliveries,
      lateDeliveries,
      fuelCost: Math.round(totalFuelCost),
    });

  } catch (err) {
    console.error("Simulation Error:", err);
    res.status(500).json({ error: "Server error running simulation." });
  }
});

module.exports = router;
