import { z } from 'zod';

export const registerSchema = z.object({
  login: z.string().min(3).max(50),
  email: z.string().email(),
  password: z.string().min(6).max(100),
});

export const loginSchema = z.object({
  login: z.string().min(3).max(50),
  password: z.string().min(6).max(100),
});
