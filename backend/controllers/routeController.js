// backend/controllers/routeController.js
const Route = require('../models/Route');

exports.getRoutes = async (req, res, next) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (err) { next(err); }
};

exports.createRoute = async (req, res, next) => {
  try {
    const r = new Route(req.body);
    await r.save();
    res.status(201).json(r);
  } catch (err) { next(err); }
};
