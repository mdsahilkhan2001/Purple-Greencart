// backend/controllers/driverController.js
const Driver = require('../models/Driver');

exports.getDrivers = async (req, res, next) => {
  try {
    const drivers = await Driver.find();
    res.json(drivers);
  } catch (err) {
    next(err);
  }
};

exports.createDriver = async (req, res, next) => {
  try {
    const d = new Driver(req.body);
    await d.save();
    res.status(201).json(d);
  } catch (err) {
    next(err);
  }
};

// add update & delete as needed
