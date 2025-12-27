import { z } from "zod";
import type {
  FrequencyType,
  PositionType,
} from "../types/financialPosition.types";

export const CreatePositionSchema = z.object({
  name: z.string().min(2).max(100),
  amount: z.number("Amount must be a number"),
  positionType: z.custom<PositionType>(
    (v) => v === "INCOME" || v === "EXPENSE"
  ),
  frequencyType: z.custom<FrequencyType>(
    (v) => v === "RECURRING" || v === "ONE_TIME"
  ),
  notes: z.string().max(500).optional().nullable(),
  category: z.string().max(100).optional().nullable(),
  interestRate: z.number().optional().nullable(),
});

export const PositionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.number().min(0, "Amount must be positive"),
  positionType: z.enum(["INCOME", "EXPENSE"]),
  frequencyType: z.enum(["RECURRING", "ONE_TIME"]),
  category: z.string().min(1, "Category is required"),
  notes: z.string().optional(),
  interestRate: z.number().min(0).max(100).optional(),
});

export type CreatePositionInput = z.infer<typeof PositionSchema>;
export const UpdatePositionSchema = CreatePositionSchema.partial();
export type UpdatePositionInput = z.infer<typeof UpdatePositionSchema>;
