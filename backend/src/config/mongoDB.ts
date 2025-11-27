import mongoose from "mongoose";
import { env } from "./env";

export const connectMongoDb = async () => {
  try {
    await mongoose.connect(env.mongoUri);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};
