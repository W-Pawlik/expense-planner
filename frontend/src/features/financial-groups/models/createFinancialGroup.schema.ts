import { z } from "zod";
import type { VisibilityStatus } from "../types/financialGroup.types";

export const CreateFinancialGroupSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(100),
  projectionYears: z
    .number({ message: "Projection years must be a number" })
    .int("Projection years must be an integer")
    .min(1, "Minimum 1 year")
    .max(50, "Maximum 50 years"),
  visibilityStatus: z.custom<VisibilityStatus>(
    (val) => val === "PRIVATE" || val === "PUBLIC"
  ),
  description: z.string().max(500).optional().nullable(),
});

export type CreateFinancialGroupInput = z.infer<
  typeof CreateFinancialGroupSchema
>;
