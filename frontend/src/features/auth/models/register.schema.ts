import { z } from "zod";

export const registerSchema = z
  .object({
    email: z.string().email("Wrong email").trim(),
    login: z.string().min(3, "Login must contain min 3 chars").trim(),
    password: z.string().min(3, "Password must contain min 3 chars"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password don't match",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
