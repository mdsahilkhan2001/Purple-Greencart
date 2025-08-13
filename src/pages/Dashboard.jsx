 import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [drivers, setDrivers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [orders, setOrders] = useState([]);
  const [totalProfit, setTotalProfit] = useState(0);
  const [efficiency, setEfficiency] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError("");
        const [driverRes, routeRes, orderRes] = await Promise.all([
          axios.get("http://localhost:5000/api/drivers"),
          axios.get("http://localhost:5000/api/routes"),
          axios.get("http://localhost:5000/api/orders"),
        ]);

        setDrivers(driverRes.data);
        setRoutes(routeRes.data);
        setOrders(orderRes.data);
        calculateKPIs(routeRes.data, orderRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  function calculateKPIs(routes, orders) {
    let profit = 0;
    let onTimeCount = 0;

    orders.forEach((order) => {
      const route = routes.find((r) => r.route_id === order.route_id);
      if (!route) return;

      const baseTimeMin = route.base_time_min;
      const deliveryTimeMin = convertTimeToMinutes(order.delivery_time);

      let penalty = 0;
      let bonus = 0;

      if (deliveryTimeMin > baseTimeMin + 10) {
        penalty = 50;
      } else {
        onTimeCount++;
      }

      if (order.value_rs > 1000 && penalty === 0) {
        bonus = order.value_rs * 0.1;
      }

      let fuelCost = route.distance_km * 5;
      if (route.traffic_level === "High") {
        fuelCost += route.distance_km * 2;
      }

      let orderProfit = order.value_rs + bonus - penalty - fuelCost;
      profit += orderProfit;
    });

    setTotalProfit(profit);
    setEfficiency(((onTimeCount / orders.length) * 100).toFixed(2));
  }

  function convertTimeToMinutes(timeStr) {
    const [h, m] = timeStr.split(":").map(Number);
    return h * 60 + m;
  }

  const deliveryData = {
    labels: ["On Time", "Late"],
    datasets: [
      {
        label: "Deliveries",
        data: [
          orders.filter((o) => {
            const r = routes.find((r) => r.route_id === o.route_id);
            return (
              r &&
              convertTimeToMinutes(o.delivery_time) <= r.base_time_min + 10
            );
          }).length,
          orders.filter((o) => {
            const r = routes.find((r) => r.route_id === o.route_id);
            return (
              r &&
              convertTimeToMinutes(o.delivery_time) > r.base_time_min + 10
            );
          }).length,
        ],
        backgroundColor: ["#4caf50", "#f44336"],
      },
    ],
  };

  const fuelData = {
    labels: ["Base Cost", "Traffic Surcharge"],
    datasets: [
      {
        label: "Fuel Cost",
        data: [
          routes.reduce((acc, r) => acc + r.distance_km * 5, 0),
          routes
            .filter((r) => r.traffic_level === "High")
            .reduce((acc, r) => acc + r.distance_km * 2, 0),
        ],
        backgroundColor: ["#2196f3", "#ff9800"],
      },
    ],
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg animate-pulse">Loading Dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center text-red-600 font-semibold">{error}</div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">📊 Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-5 shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-gray-500">Total Drivers</h3>
          <p className="text-2xl font-bold">{drivers.length}</p>
        </div>
        <div className="bg-white p-5 shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-gray-500">Total Profit</h3>
          <p className="text-2xl font-bold text-green-600">
            ₹{totalProfit.toFixed(2)}
          </p>
        </div>
        <div className="bg-white p-5 shadow-lg rounded-xl hover:shadow-xl transition text-center">
          <h3 className="text-gray-500">Efficiency Score</h3>
          <p className="text-2xl font-bold text-blue-600">{efficiency}%</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow-lg rounded-xl flex flex-col items-center">
          <h4 className="mb-4 font-semibold text-gray-700">
            On-time vs Late Deliveries
          </h4>
          <div className="w-64 h-64 sm:w-72 sm:h-72">
            <Pie data={deliveryData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
        <div className="bg-white p-4 shadow-lg rounded-xl">
          <h4 className="mb-4 font-semibold text-gray-700">
            Fuel Cost Breakdown
          </h4>
          <div className="h-72">
            <Bar data={fuelData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>
      </div>
    </div>
  );
}
