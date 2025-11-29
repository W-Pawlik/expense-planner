import { z } from 'zod';
import { createGroupSchema, updateGroupSchema, changeVisibilitySchema } from './group.schemas';

export type CreateGroupInput = z.infer<typeof createGroupSchema>;
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>;
export type ChangeVisibilityInput = z.infer<typeof changeVisibilitySchema>;
