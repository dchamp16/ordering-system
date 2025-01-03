const express = require("express");
const router = express.Router();
const { getEmpOrders, createOrder } = require("../controllers/orderController");

router.get("/:empId", getEmpOrders);
router.post("/", createOrder);

module.exports = router;
