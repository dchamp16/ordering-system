const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const session = require("express-session");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    },
  }),
);

app.get("/set-admin-session", (req, res) => {
  req.session.user = { role: "admin" };
  console.log("Session set:", req.session.user); // Debugging
  res.json({ message: "Admin session set", session: req.session });
});

app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/audit-logs", require("./routes/auditLogRoutes"));
app.use("/api/hardware", require("./routes/hardwareRoutes"));

// Database Connection and Server Start
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
