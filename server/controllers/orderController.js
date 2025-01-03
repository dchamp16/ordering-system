const Order = require("../models/orderModel");

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch orders" });
  }
};

const getEmpOrders = async (req, res) => {
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

const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const updateOrder = await Order.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!updateOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json(updateOrder);
  } catch (err) {
    res.status(400).json({ error: "Failed to update order" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteOrder = await Order.findByIdAndDelete(id);
    if (!deleteOrder) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json(deleteOrder);
  } catch (err) {
    res.status(400).json({ error: "Failed to delete order" });
  }
};

module.exports = {
  getAllOrders,
  getEmpOrders,
  createOrder,
  updateOrder,
  deleteOrder,
};
