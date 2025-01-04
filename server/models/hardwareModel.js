const mongoose = require("mongoose");
const moment = require("moment-timezone");

const hardwareSchema = new mongoose.Schema({
  hardwareName: { type: String, default: null },
  hardwareOldNumber: { type: String, required: true },
  hardwarePO: { type: String, required: true },
  hardwareGroupName: { type: String, required: true },
  quantity: { type: Number, required: true },
  hardwareDescription: { type: String, required: true },
  dateAdded: {
    type: String,
    default: moment().tz("America/Denver").format("MMMM D YYYY, HH:mm:ss"),
  },
});

module.exports = mongoose.model("Hardware", hardwareSchema);
