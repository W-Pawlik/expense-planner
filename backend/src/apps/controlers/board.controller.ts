import { Request, Response, NextFunction } from 'express';
import { ListBoardPostsQuery } from '../../modules/board-post.model.ts/domain/board.schemas';
import { BoardService } from '../../modules/board-post.model.ts/application/board.service';

const boardService = new BoardService();

export const getPublicBoard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = (req as any).validatedQuery as ListBoardPostsQuery;
    const result = await boardService.listPublicPosts(page, limit);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getPublicBoardPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params as { postId: string };
    const result = await boardService.getPublicPost(postId);
    res.json(result);
  } catch (err) {
    next(err);
  }
};
