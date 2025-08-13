 import React, { useEffect, useState } from "react";
import {
  getRoutes,
  createRoute,
  updateRoute,
  deleteRoute,
} from "../services/api";

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [form, setForm] = useState({
    route_id: "",
    distance_km: "",
    traffic_level: "",
    base_time_min: "",
  });

  useEffect(() => {
    loadRoutes();
  }, []);

  const loadRoutes = async () => {
    try {
      const { data } = await getRoutes();
      setRoutes(data);
    } catch (err) {
      console.error("Error loading routes:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await updateRoute(form._id, form);
      } else {
        await createRoute(form);
      }
      setForm({
        route_id: "",
        distance_km: "",
        traffic_level: "",
        base_time_min: "",
      });
      loadRoutes();
    } catch (err) {
      console.error("Error saving route:", err);
    }
  };

  const handleEdit = (route) => {
    setForm(route);
  };

  const handleDelete = async (id) => {
    try {
      await deleteRoute(id);
      loadRoutes();
    } catch (err) {
      console.error("Error deleting route:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Routes Management
      </h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "10px",
          marginBottom: "20px",
          justifyContent: "center",
        }}
      >
        <input
          placeholder="Route ID"
          value={form.route_id}
          onChange={(e) => setForm({ ...form, route_id: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Distance (km)"
          value={form.distance_km}
          onChange={(e) => setForm({ ...form, distance_km: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Traffic Level"
          value={form.traffic_level}
          onChange={(e) => setForm({ ...form, traffic_level: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Base Time (min)"
          value={form.base_time_min}
          onChange={(e) => setForm({ ...form, base_time_min: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" style={btnAddStyle}>
          {form._id ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "500px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Route ID</th>
              <th style={thStyle}>Distance (km)</th>
              <th style={thStyle}>Traffic Level</th>
              <th style={thStyle}>Base Time (min)</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map((r) => (
              <tr key={r._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{r.route_id}</td>
                <td style={tdStyle}>{r.distance_km}</td>
                <td style={tdStyle}>{r.traffic_level}</td>
                <td style={tdStyle}>{r.base_time_min}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(r)} style={editBtnStyle}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r._id)}
                    style={deleteBtnStyle}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Styles
const inputStyle = {
  padding: "8px",
  flex: "1 1 150px",
  borderRadius: "5px",
  border: "1px solid #ccc",
};

const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
};

const btnAddStyle = {
  padding: "8px 15px",
  backgroundColor: "#4caf50",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  flex: "1 1 100px",
};

const editBtnStyle = {
  marginRight: "5px",
  padding: "5px 10px",
  backgroundColor: "#2196f3",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtnStyle = {
  padding: "5px 10px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};
