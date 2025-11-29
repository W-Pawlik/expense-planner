import { Express, Router } from 'express';
import { register, login } from '../../apps/controlers/auth.controller';
import { validateRequest } from '../../core/middleware/validateRequest';
import { loginSchema, registerSchema } from '../../modules/auth/domain/auth.schemas';

export const createAuthRouter = (): Router => {
  const router = Router();

  router.post('/register', validateRequest(registerSchema), register);
  router.post('/login', validateRequest(loginSchema), login);

  return router;
};

export const registerAuthRoutes = (app: Express) => {
  app.use('/auth', createAuthRouter());
};
