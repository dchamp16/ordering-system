const express = require("express");
const router = express.Router();
const {
  getEmpOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { verifyAdmin } = require("../middleware/auth");

router.use(verifyAdmin);

// Routes
router.get("/orders/:empId", getEmpOrders);
router.get("/orders", getAllOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
