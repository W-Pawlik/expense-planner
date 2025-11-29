import { z } from 'zod';
import { VisibilityStatus } from '../../../core/enums/isibilityStatus.enum';

export const visibilityStatusSchema = z.nativeEnum(VisibilityStatus);

export const createGroupSchema = z.object({
  name: z.string().min(1).max(100),
  projectionYears: z.number().int().min(1).max(100),
  visibilityStatus: visibilityStatusSchema.optional().default(VisibilityStatus.PRIVATE),
});

export const updateGroupSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  projectionYears: z.number().int().min(1).max(100).optional(),
});

export const changeVisibilitySchema = z.object({
  visibilityStatus: visibilityStatusSchema,
});

export const groupIdParamsSchema = z.object({
  groupId: z.string().min(1),
});
