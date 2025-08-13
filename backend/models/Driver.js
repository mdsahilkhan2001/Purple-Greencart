// backend/models/Driver.js
const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true },
  shift_hours: { type: Number, default: 0 },        // current shift hours
  past_week_hours: { type: [Number], default: [] }  // store as array of numbers
}, { timestamps: true });

module.exports = mongoose.model('Driver', driverSchema);
