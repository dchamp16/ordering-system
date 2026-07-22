const rateLimit = require("express-rate-limit");
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message:
    "Too many login attempts from this IP, please try again after 15 minutes",
});

const express = require("express");
const router = express.Router();
const { login, logout } = require("../controllers/authController");

router.post("/login", loginLimiter, login);
router.get("/logout", logout);

module.exports = router;
