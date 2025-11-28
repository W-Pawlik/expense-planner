import express from 'express';
import { errorHandler } from './core/errors/errorHandler';
import { registerAuthModule } from './modules/auth/routes/auth.routes';

export const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  registerAuthModule(app);

  app.use(errorHandler);

  return app;
};
