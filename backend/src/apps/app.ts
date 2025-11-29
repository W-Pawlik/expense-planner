import { Application } from 'express';
import express from 'express';
import { errorHandler } from '../core/errors/errorHandler';
import { registerAdminRoutes } from './routes/admin.routes';
import { registerUserRoutes } from './routes/user.routes';
import { registerAuthRoutes } from './routes/auth.routes';
import { registerGroupRoutes } from './routes/group.routes';

export const createApp = (): Application => {
  const app = express();
  app.use(express.json());
  app.get('hetalth', (_req, res) => {
    res.json({ status: 'ok' });
  });

  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerAdminRoutes(app);
  registerGroupRoutes(app);

  app.use(errorHandler);

  return app;
};
