const mongoose = require("mongoose");

const connectDB = async (MONGO_URI) => {
  try {
    if (!MONGO_URI) {
      throw new Error("MongoDB URI is not set in the environment variables");
    }
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

module.exports = connectDB;
