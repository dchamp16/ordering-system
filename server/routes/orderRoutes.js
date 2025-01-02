const express = require("express");
const router = express.Router();
const { getOrders, createOrder } = require("../controllers/orderController");

router.get("/:empId", getOrders);
router.post("/", createOrder);

module.exports = router;
