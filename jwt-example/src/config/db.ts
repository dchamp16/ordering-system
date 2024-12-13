import mongoose from "mongoose";

require("dotenv").config();

const connectDB = async () => {
  const mongoURI: any = process.env.MONGO_URI;
  console.log("MongoDB URI: " + mongoURI);
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB Connected");
  } catch (error) {
    console.log("Error connecting to database", error);
    process.exit(1);
  }
};

export default connectDB;
