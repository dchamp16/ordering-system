const express = require("express");
const router = express.Router();
const AuditLog = require("../models/auditLogModel");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

router.get("/", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ date: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch audit logs" });
  }
});

module.exports = router;
