import { z } from 'zod';

export const listBoardPostsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 1))
    .refine((val) => !Number.isNaN(val) && val > 0, {
      message: 'page must be a positive number',
    }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : 20))
    .refine((val) => !Number.isNaN(val) && val > 0 && val <= 100, {
      message: 'limit must be between 1 and 100',
    }),
});

export const boardPostIdParamsSchema = z.object({
  postId: z.string().min(1),
});
