import { z } from 'zod';

export const listUsersQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => !Number.isNaN(val) && val > 0, { message: 'page must be positive number' }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 20))
    .refine((val) => !Number.isNaN(val) && val > 0 && val <= 100, {
      message: 'limit must be between 1 and 100',
    }),
});

export type ListUsersQuery = z.infer<typeof listUsersQuerySchema>;

export const deleteUserParamsSchema = z.object({
  id: z.string().min(1),
});

export type DeleteUserParams = z.infer<typeof deleteUserParamsSchema>;
