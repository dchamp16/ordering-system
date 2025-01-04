const express = require("express");
const router = express.Router();
const AuditLog = require("../models/auditLogModel");
const { verifyAdmin } = require("../middleware/auth");

router.get("/", verifyAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
