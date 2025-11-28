import { Express, Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validateRequest } from '../../../core/middleware/validateRequest';
import { registerSchema, loginSchema } from '../schemas/auth.schemas';

export const createAuthRouter = (): Router => {
  const router = Router();

  router.post('/register', validateRequest(registerSchema), authController.register);
  router.post('/login', validateRequest(loginSchema), authController.login);

  return router;
};

export const registerAuthModule = (app: Express) => {
  app.use('/auth', createAuthRouter());
};
