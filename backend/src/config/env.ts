import dotenv from "dotenv";
dotenv.config();

export const env = {
  port: process.env.PORT ?? "3000",
  mongoUri:
    process.env.MONGO_URI ?? "mongodb://localhost:27017/expense-planner",
  jwtSecret: process.env.JWT_SECRET ?? "dev-secret-change-me",
};
