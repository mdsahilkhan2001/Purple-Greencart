// backend/seed/seedData.js
// require('dotenv').config({ path: '../.env' }); // adjust path if running from /backend
require('dotenv').config({ path: __dirname + '/../.env' });

const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
console.log("MONGO_URI from env:", process.env.MONGO_URI);

const connectDB = require('../utils/db');
const Driver = require('../models/Driver');
const Route = require('../models/Route');
const Order = require('../models/Order');

const dataDir = path.join(__dirname, '..', 'data');

(async () => {
  try {
    await connectDB();

    // Clear old data
    await Driver.deleteMany({});
    await Route.deleteMany({});
    await Order.deleteMany({});

    // DRIVERS: drivers.csv expected columns: name, shift_hours, past_week_hours (pipe separated)
    const driversFile = path.join(dataDir, 'drivers.csv');
    const routesFile = path.join(dataDir, 'routes.csv');
    const ordersFile = path.join(dataDir, 'orders.csv');

    // helper to read CSV into array
    const readCSV = (filePath) => new Promise((resolve, reject) => {
      const rows = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (data) => rows.push(data))
        .on('end', () => resolve(rows))
        .on('error', (err) => reject(err));
    });

    const driverRows = await readCSV(driversFile);
    const routeRows = await readCSV(routesFile);
    const orderRows = await readCSV(ordersFile);

    // insert drivers
    for (const r of driverRows) {
      const past = r.past_week_hours ? r.past_week_hours.split('|').map(x => Number(x)) : [];
      const d = new Driver({
        name: r.name,
        shift_hours: Number(r.shift_hours || 0),
        past_week_hours: past
      });
      await d.save();
    }

    for (const r of routeRows) {
      const rec = new Route({
        route_id: Number(r.route_id),
        distance_km: Number(r.distance_km),
        traffic_level: r.traffic_level,
        base_time_min: Number(r.base_time_min)
      });
      await rec.save();
    }

    for (const r of orderRows) {
      const rec = new Order({
        order_id: Number(r.order_id),
        value_rs: Number(r.value_rs),
        route_id: Number(r.route_id),
        delivery_time: r.delivery_time
      });
      await rec.save();
    }

    console.log('Seed complete');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
})();
