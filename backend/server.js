const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const session = require("express-session");
const http = require("http");
const { Server } = require("socket.io");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Allow both local dev and deployed frontend
const allowedOrigins = [
  "http://localhost:5173",
  "https://ordering-system-heto.vercel.app",
];


// Create HTTP Server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: allowedOrigin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  }
});

// Middleware
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to true if using HTTPS
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      sameSite: "lax"
    }
  })
);

// Debug middleware to log session
app.use((req, res, next) => {
  console.log("Session:", req.session);
  next();
});

// Set admin session route
app.get("/api/auth/set-admin-session", (req, res) => {
  req.session.user = { role: "admin" };
  console.log("Session set:", req.session.user);
  res.json({ message: "Admin session set", session: req.session });
});

// Routes
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/audit-logs", require("./routes/auditLogRoutes"));
app.use("/api/hardware", require("./routes/hardwareRoutes"));

// Socket.IO State
const connectedUsers = new Map();
const connectedAdmins = new Map();

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("register", (data) => {
    const { userId, userName, userRole } = data;
    if (!userId || !userName) {
      console.log("Invalid registration data:", data);
      socket.disconnect();
      return;
    }

    const userInfo = { socketId: socket.id, userName, userId };

    if (userRole === "admin" || userRole === "superadmin") {
      connectedAdmins.set(userId, userInfo);
    } else {
      connectedUsers.set(userId, userInfo);
    }

    broadcastOnlineStatus();
  });

  socket.on("private_message", ({ to, message, from, fromName }) => {
    const recipient = connectedUsers.get(to) || connectedAdmins.get(to);
    if (recipient) {
      io.to(recipient.socketId).emit("receive_message", {
        message,
        from,
        fromName,
        timestamp: new Date().toISOString()
      });
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, info] of connectedUsers.entries()) {
      if (info.socketId === socket.id) {
        connectedUsers.delete(userId);
        break;
      }
    }

    for (const [userId, info] of connectedAdmins.entries()) {
      if (info.socketId === socket.id) {
        connectedAdmins.delete(userId);
        break;
      }
    }

    broadcastOnlineStatus();
    console.log("Client disconnected:", socket.id);
  });
});

function broadcastOnlineStatus() {
  const users = Array.from(connectedUsers.values()).map((user) => ({
    id: user.userId,
    name: user.userName
  }));

  const admins = Array.from(connectedAdmins.values()).map((admin) => ({
    id: admin.userId,
    name: admin.userName
  }));

  io.emit("online_status", { users, admins });
}

// Connect DB and Start Server
connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server with Socket.IO running at http://localhost:${PORT}`);
  });
});
