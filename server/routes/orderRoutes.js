const express = require("express");
const router = express.Router();
const {
    getEmpOrders,
    createOrder, returnOrder, getAllOrders
} = require("../controllers/orderController");

router.get("/", getAllOrders);
router.get("/:empId", getEmpOrders);
router.post("/", createOrder);
router.post("/return", returnOrder);


module.exports = router;
