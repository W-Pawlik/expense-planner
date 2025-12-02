import { z } from "zod";

export const LoginCredentialsSchema = z.object({
  login: z.string().min(3).trim(),
  password: z.string().min(3).trim(),
});

export const RegisterCredentialsSchema = z
  .object({
    email: z.email().trim(),
    login: z.string().min(3).trim(),
    password: z.string().min(3),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type LoginCredentials = z.infer<typeof LoginCredentialsSchema>;
export type RegisterCredentials = z.infer<typeof RegisterCredentialsSchema>;
