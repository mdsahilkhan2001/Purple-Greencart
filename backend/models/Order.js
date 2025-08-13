// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  order_id: { type: Number, required: true, unique: true },
  value_rs: { type: Number, required: true },
  route_id: { type: Number, required: true },
  delivery_time: { type: String, required: true } // hh:mm string from CSV (not used for simulation)
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
