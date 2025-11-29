import { Express, Router } from 'express';
import * as adminController from '../controlers/admin.controller';
import { authMiddleware } from '../../core/middleware/auth.middleware';

import { validateRequest } from '../../core/middleware/validateRequest';
import {
  listUsersQuerySchema,
  deleteUserParamsSchema,
} from '../../modules/admin/domain/admin.schemas';
import { roleGuard } from '../../core/middleware/roleguard.middleware.';

export const createAdminRouter = (): Router => {
  const router = Router();

  router.use(authMiddleware, roleGuard('ADMIN'));

  router.get('/users', validateRequest(listUsersQuerySchema, 'query'), adminController.getUsers);

  router.delete(
    '/users/:id',
    validateRequest(deleteUserParamsSchema, 'params'),
    adminController.deleteUser,
  );

  return router;
};

export const registerAdminRoutes = (app: Express) => {
  app.use('/admin', createAdminRouter());
};
