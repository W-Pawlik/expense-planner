import { z } from 'zod';
import { registerSchema, loginSchema } from './auth.schemas';

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface RegisterResponse {
  user: {
    id: any;
    login: any;
    email: any;
    role: any;
  };
  token: string;
}

export interface LoginResponse {
  user: {
    id: any;
    login: any;
    email: any;
    role: any;
  };
  token: string;
}
