import { z } from 'zod';

export const listBoardPostsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});

export const boardPostIdParamsSchema = z.object({
  postId: z.string().min(1),
});

export type ListBoardPostsQuery = z.infer<typeof listBoardPostsQuerySchema>;
