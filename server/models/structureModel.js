const mongoose = require("mongoose");

const structureSchema = new mongoose.Schema({
    structurePO: {
        type: String,
        required: true,
        unique: true
    },
    structureName: {type: String, required: true},
    hardwareAllocation: [
        {
            hardwareOldNumber: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
        }
    ]
})

module.exports = mongoose.model("Structure", structureSchema);