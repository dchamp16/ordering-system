const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const http = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const JWT_SECRET = process.env.JWT_SECRET;

const allowedOrigins = [
  "https://ordering-system-heto.vercel.app",
  "http://localhost:5173"
];

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

// HTTP server for Socket.IO
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
});

// JWT verification middleware
const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(403).json({ error: "Access denied" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: "Invalid token" });
  }
};

// Routes
app.use("/api/orders", require("./routes/orderRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/users", verifyToken, require("./routes/userRoutes"));
app.use("/api/audit-logs", verifyToken, require("./routes/auditLogRoutes"));
app.use("/api/hardware", verifyToken, require("./routes/hardwareRoutes"));

// Socket.IO logic
const connectedUsers = new Map();
const connectedAdmins = new Map();

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("register", (data) => {
    const { userId, userName, userRole } = data;
    const userInfo = { socketId: socket.id, userName, userId };

    if (!userId || !userName) return socket.disconnect();

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
        timestamp: new Date().toISOString(),
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
  const users = Array.from(connectedUsers.values()).map((u) => ({
    id: u.userId,
    name: u.userName,
  }));

  const admins = Array.from(connectedAdmins.values()).map((a) => ({
    id: a.userId,
    name: a.userName,
  }));

  io.emit("online_status", { users, admins });
}

// Start server
connectDB(MONGO_URI).then(() => {
  server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
});
