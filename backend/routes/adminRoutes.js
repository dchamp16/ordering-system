const express = require("express");
const router = express.Router();
const {
  verifyToken,
  verifyViewer,
  verifyAdmin,
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
router.post("/orders", verifyViewer, createOrder);
router.put("/orders/:id", verifyViewer, updateOrder);
router.delete("/orders/:id", verifyViewer, deleteOrder);

module.exports = router;
