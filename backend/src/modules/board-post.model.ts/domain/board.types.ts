import { z } from 'zod';
import { boardPostIdParamsSchema, listBoardPostsQuerySchema } from './board.schemas';

export type ListBoardPostsQuery = z.infer<typeof listBoardPostsQuerySchema>;
export type BoardPostIdParams = z.infer<typeof boardPostIdParamsSchema>;

export interface BoardPostDTO {
  id: string;
  groupId: string;
  authorId: string;
  description?: string;
  publicationStatus: string;
  approvalStatus: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListBoardPostsResult {
  posts: BoardPostDTO[];
  total: number;
  page: number;
  limit: number;
}
