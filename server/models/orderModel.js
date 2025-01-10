const mongoose = require("mongoose");
const moment = require("moment-timezone");

const orderSchema = new mongoose.Schema({
    empId: {type: String, required: true},
    empName: {type: String, required: true},
    structurePO: {type: String, required: true},
    structurename: {type: String, required: true},
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
        type: String, // Store as a formatted string for readability
        default: () =>
            moment().tz("America/Denver").format("MMMM D YYYY, HH:mm:ss"), // e.g., January 1 2024, 13:45:00
    },
});

module.exports = mongoose.model("Order", orderSchema);
