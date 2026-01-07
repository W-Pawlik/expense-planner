import { z } from 'zod';
import { PositionType } from '../../../core/enums/PositionType.enum';
import { FrequencyType } from '../../../core/enums/FrequencyType.enum';

export const positionTypeSchema = z.nativeEnum(PositionType);
export const frequencyTypeSchema = z.nativeEnum(FrequencyType);

export const createPositionSchema = z.object({
  name: z.string().min(1).max(100),
  amount: z.number().positive(),
  positionType: positionTypeSchema,
  frequencyType: frequencyTypeSchema,
  date: z.coerce.date(),
  notes: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
  interestRate: z.number().min(0).optional(),
});

export const updatePositionSchema = createPositionSchema.partial();

export const positionIdParamsSchema = z.object({
  positionId: z.string().min(1),
});
