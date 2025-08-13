 import React, { useEffect, useState } from "react";
import {
  getOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} from "../services/api";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({
    order_id: "",
    value_rs: "",
    route_id: "",
    delivery_time: "",
  });

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const { data } = await getOrders();
      setOrders(data);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form._id) {
        await updateOrder(form._id, form);
      } else {
        await createOrder(form);
      }
      setForm({
        order_id: "",
        value_rs: "",
        route_id: "",
        delivery_time: "",
      });
      loadOrders();
    } catch (err) {
      console.error("Error saving order:", err);
    }
  };

  const handleEdit = (order) => {
    setForm(order);
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      loadOrders();
    } catch (err) {
      console.error("Error deleting order:", err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Orders Management
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
          placeholder="Order ID"
          value={form.order_id}
          onChange={(e) => setForm({ ...form, order_id: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Value (₹)"
          type="number"
          value={form.value_rs}
          onChange={(e) => setForm({ ...form, value_rs: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Route ID"
          value={form.route_id}
          onChange={(e) => setForm({ ...form, route_id: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          placeholder="Delivery Time (HH:MM)"
          value={form.delivery_time}
          onChange={(e) => setForm({ ...form, delivery_time: e.target.value })}
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
            minWidth: "600px",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={thStyle}>Order ID</th>
              <th style={thStyle}>Value (₹)</th>
              <th style={thStyle}>Route ID</th>
              <th style={thStyle}>Delivery Time</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={tdStyle}>{o.order_id}</td>
                <td style={tdStyle}>{o.value_rs}</td>
                <td style={tdStyle}>{o.route_id}</td>
                <td style={tdStyle}>{o.delivery_time}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleEdit(o)} style={editBtnStyle}>
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(o._id)}
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
