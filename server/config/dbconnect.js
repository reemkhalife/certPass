import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Replace <password> with your actual password and <database> with your database name
const dbConnect = async() => {

  const uri = process.env.MONGODB_URI;

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB Atlas");
  } catch (error) {
    console.error("Error connecting to MongoDB Atlas:", error.message);
  }
};

export default dbConnect;