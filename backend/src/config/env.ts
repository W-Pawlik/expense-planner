import dotenv from 'dotenv';
import { jwt } from 'zod';
dotenv.config();

export const env = {
  port: process.env.PORT ?? '3000',
  mongoUri: process.env.MONGO_URI ?? 'mongodb://localhost:27017/expense-planner',
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? ('1h' as string),
  corsOrigins: process.env.CORS_ORIGINS,
};
