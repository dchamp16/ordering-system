const mongoose = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new mongoose.Schema({
    empId: {type: String, required: true},
    empName: {type: String, required: true},
    structurePO: {type: String, required: true},
    structureName: {type: String, required: true}, // Correct field name
    orders: [
        {
            hardwareOldNumber: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            status: {
                type: String,
                default: "Pending"
            },
        },
    ],
    date: {
        type: String,
        default: () =>
            moment().tz("America/Denver").format("MMMM D YYYY, HH:mm:ss"),
    },
});

module.exports = mongoose.model("Order", orderSchema);
