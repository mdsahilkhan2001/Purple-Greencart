 const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');

// Create Driver
router.post('/', async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Drivers
router.get('/', async (req, res) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single Driver
router.get('/:id', async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Driver
router.put('/:id', async (req, res) => {
  try {
    const updated = await Driver.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Driver not found' });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Driver
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Driver.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: 'Driver deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
