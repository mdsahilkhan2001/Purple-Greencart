 import React, { useEffect, useState } from "react";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../services/api";

export default function Drivers() {
  const [drivers, setDrivers] = useState([]);
  const [form, setForm] = useState({ name: "", shift_hours: "" });

  useEffect(() => {
    loadDrivers();
  }, []);

  const loadDrivers = async () => {
    try {
      const { data } = await getDrivers();
      setDrivers(data);
    } catch (err) {
      console.error("Error loading drivers:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await updateDriver(form._id, form);
      } else {
        await createDriver(form);
      }
      setForm({ name: "", shift_hours: "" });
      loadDrivers();
    } catch (err) {
      console.error("Error saving driver:", err);
    }
  };

  const handleEdit = (driver) => {
    setForm(driver);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDriver(id);
      loadDrivers();
    } catch (err) {
      console.error("Error deleting driver:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Drivers Management
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
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{
            padding: "8px",
            flex: "1 1 200px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <input
          type="number"
          placeholder="Shift Hours"
          value={form.shift_hours}
          onChange={(e) => setForm({ ...form, shift_hours: e.target.value })}
          required
          style={{
            padding: "8px",
            flex: "1 1 150px",
            borderRadius: "5px",
            border: "1px solid #ccc",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 15px",
            backgroundColor: "#4caf50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            flex: "1 1 100px",
          }}
        >
          {form._id ? "Update" : "Add"}
        </button>
      </form>

      {/* Table */}
      <div style={{ overflowX: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "400px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Name</th>
              <th style={thStyle}>Shift Hours</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((d) => (
              <tr key={d._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{d.name}</td>
                <td style={tdStyle}>{d.shift_hours} hrs</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => handleEdit(d)}
                    style={editBtnStyle}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(d._id)}
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
const thStyle = {
  padding: "10px",
  textAlign: "left",
  borderBottom: "2px solid #ddd",
};

const tdStyle = {
  padding: "10px",
  textAlign: "left",
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
