import { Express, Router } from 'express';
import { getPublicBoard, getPublicBoardPost } from '../controlers/board.controller';
import { validateRequest } from '../../core/middleware/validateRequest';
import {
  boardPostIdParamsSchema,
  listBoardPostsQuerySchema,
} from '../../modules/board-post.model.ts/domain/board.schemas';

export const createBoardRouter = (): Router => {
  const router = Router();

  router.get('/', validateRequest(listBoardPostsQuerySchema, 'query'), getPublicBoard);

  router.get('/:postId', validateRequest(boardPostIdParamsSchema, 'params'), getPublicBoardPost);

  return router;
};

export const registerBoardRoutes = (app: Express) => {
  app.use('/board', createBoardRouter());
};
