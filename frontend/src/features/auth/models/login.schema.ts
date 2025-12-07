import { z } from "zod";

export const loginSchema = z.object({
  login: z.string().min(3, "Login must contain min 3 chars").trim(),
  password: z.string().min(3, "Password must contain min 3 chars").trim(),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
