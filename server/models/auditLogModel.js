const mongoose = require("mongoose");
const moment = require("moment-timezone");

const auditLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  performedBy: { type: String, required: true },
  details: { type: Object, required: true },
  date: {
    type: String,
    default: moment().tz("America/Denver").format("MMMM D YYYY, HH:mm:ss"),
  },
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
