import { z } from 'zod';
import { createPositionSchema, updatePositionSchema } from './position.schemas';

export type CreatePositionInput = z.infer<typeof createPositionSchema>;
export type UpdatePositionInput = z.infer<typeof updatePositionSchema>;
