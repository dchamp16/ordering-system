const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyAdmin
} = require("../middleware/authMiddleware");
const {
  getEmpOrders,
  getAllOrders,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");

router.use(verifyToken, verifyAdmin);

router.get("/orders/:empId", getEmpOrders);
router.get("/orders", getAllOrders);
router.post("/orders", createOrder);
router.put("/orders/:id", updateOrder);
router.delete("/orders/:id", deleteOrder);

module.exports = router;
