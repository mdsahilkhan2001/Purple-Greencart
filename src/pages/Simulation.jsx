 // src/pages/Simulation.jsx
import React, { useState } from "react";
import { runSimulation } from "../services/api";
import toast from "react-hot-toast";

export default function Simulation() {
  const [form, setForm] = useState({
    drivers: "",
    startTime: "",
    maxHours: "",
  });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.drivers || !form.startTime || !form.maxHours) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const { data } = await runSimulation({
        drivers: Number(form.drivers),
        startTime: form.startTime,
        maxHours: Number(form.maxHours),
      });
      setResults(data);
      toast.success("Simulation completed!");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.error || "Simulation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 md:p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        🚚 Run Delivery Simulation
      </h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 shadow rounded-lg mb-6"
      >
        <div>
          <label className="block text-sm font-medium mb-1">
            Number of Drivers
          </label>
          <input
            type="number"
            name="drivers"
            value={form.drivers}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="e.g. 3"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Route Start Time
          </label>
          <input
            type="time"
            name="startTime"
            value={form.startTime}
            onChange={handleChange}
            className="border rounded w-full p-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Max Hours/Driver
          </label>
          <input
            type="number"
            name="maxHours"
            value={form.maxHours}
            onChange={handleChange}
            className="border rounded w-full p-2"
            placeholder="e.g. 8"
            min="1"
          />
        </div>

        <div className="sm:col-span-3">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50 w-full"
          >
            {loading ? "Running..." : "Run Simulation"}
          </button>
        </div>
      </form>

      {/* Results */}
      {results && (
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          <div className="bg-green-100 p-4 rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Total Profit</h3>
            <p className="text-xl font-bold text-green-700">
              ₹{results.totalProfit}
            </p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Efficiency Score</h3>
            <p className="text-xl font-bold text-blue-700">
              {results.efficiencyScore}%
            </p>
          </div>
          <div className="bg-green-50 p-4 rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">On-Time Deliveries</h3>
            <p className="text-xl font-bold text-green-600">
              {results.onTimeDeliveries}
            </p>
          </div>
          <div className="bg-red-50 p-4 rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Late Deliveries</h3>
            <p className="text-xl font-bold text-red-500">
              {results.lateDeliveries}
            </p>
          </div>
          <div className="bg-orange-50 p-4 rounded shadow text-center">
            <h3 className="text-gray-600 text-sm">Fuel Cost</h3>
            <p className="text-xl font-bold text-orange-500">
              ₹{results.fuelCost}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
