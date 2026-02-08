import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.DB, {
      connectTimeoutMS: 30000,
      serverSelectionTimeoutMS: 30000,
    });
    console.log("Database Connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    throw error;
  }
};
