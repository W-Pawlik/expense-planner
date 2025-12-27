import { z } from "zod";

export const EditFinancialGroupSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(100, "Name must be at most 100 characters"),
  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .nullable(),
});

export type EditFinancialGroupInput = z.infer<typeof EditFinancialGroupSchema>;
