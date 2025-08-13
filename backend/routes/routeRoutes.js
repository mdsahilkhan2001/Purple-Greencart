 const express = require('express');
const router = express.Router();
const Route = require('../models/Route');

// Create Route
router.post('/', async (req, res) => {
  try {
    const route = await Route.create(req.body);
    res.status(201).json(route);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Route
router.get('/:id', async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Route
router.put('/:id', async (req, res) => {
  try {
    const updated = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Route not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Route
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Route.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
