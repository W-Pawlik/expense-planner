import { Express, Router } from 'express';
import { authMiddleware } from '../../core/middleware/auth.middleware';
import { getUserData } from '../controlers/user.controller';

export const createUserRouter = (): Router => {
  const router = Router();

  router.use(authMiddleware);

  router.get('/userdata', getUserData);

  return router;
};

export const registerUserRoutes = (app: Express) => {
  app.use('/users', createUserRouter());
};
