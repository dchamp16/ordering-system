const express = require("express");
const router = express.Router();
const {
    getEmpOrders,
    createOrder, returnHardware, getAllOrders
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.get("/:empId", getEmpOrders);
router.post("/", createOrder);
router.post("/return", returnHardware);


module.exports = router;
