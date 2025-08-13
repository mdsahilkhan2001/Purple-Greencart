 // backend/controllers/orderController.js
const Order = require('../models/Order');

exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) { next(err); }
};

exports.createOrder = async (req, res, next) => {
  try {
    const o = new Order(req.body);
    await o.save();
    res.status(201).json(o);
  } catch (err) { next(err); }
};
