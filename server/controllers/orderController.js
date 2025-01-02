const Order = require("../models/orderModel");

const getOrders = async (req, res) => {
  try {
    const { empId } = req.params;
    const orders = await Order.find({ empId });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const createOrder = async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: "Failed to create order" });
  }
};

module.exports = { getOrders, createOrder };
