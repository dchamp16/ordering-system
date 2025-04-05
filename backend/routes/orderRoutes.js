const express = require("express");
const router = express.Router();
const {
  getEmpOrders,
  createOrder,
  returnHardware,
  getAllOrders
} = require("../controllers/orderController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/",verifyToken, getAllOrders);
router.get("/:empId",verifyToken, getEmpOrders);
router.post("/",verifyToken, createOrder);
router.post("/return",verifyToken, returnHardware);

module.exports = router;
