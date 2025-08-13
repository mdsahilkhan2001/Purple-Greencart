// backend/models/Simulation.js
const mongoose = require('mongoose');
 


const simulationSchema = new mongoose.Schema({
  inputs: { type: Object, required: true },
  results: { type: Object, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Simulation', simulationSchema);
