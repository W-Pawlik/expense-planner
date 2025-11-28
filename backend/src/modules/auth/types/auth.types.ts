import { z } from 'zod';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
