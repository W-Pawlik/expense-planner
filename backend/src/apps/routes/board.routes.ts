import { Express, Router } from 'express';
import {
  getPublicBoard,
  getPublicBoardPost,
  hideGroupOnBoard,
} from '../controlers/board.controller';
import { validateRequest } from '../../core/middleware/validateRequest';
import {
  boardPostIdParamsSchema,
  listBoardPostsQuerySchema,
} from '../../modules/board-post.model.ts/domain/board.schemas';
import { groupIdParamsSchema } from '../../modules/financial-groups/domain/group.schemas';
import { authMiddleware } from '../../core/middleware/auth.middleware';

export const createBoardRouter = (): Router => {
  const router = Router();

  router.get('/public', validateRequest(listBoardPostsQuerySchema, 'query'), getPublicBoard);

  router.get('/:postId', validateRequest(boardPostIdParamsSchema, 'params'), getPublicBoardPost);

  router.post(
    '/groups/:groupId/hide',
    authMiddleware,
    validateRequest(groupIdParamsSchema, 'params'),
    hideGroupOnBoard,
  );

  return router;
};

export const registerBoardRoutes = (app: Express) => {
  app.use('/board', createBoardRouter());
};
