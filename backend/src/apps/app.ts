import cors from 'cors';
import { Application } from 'express';
import express from 'express';
import { errorHandler } from '../core/errors/errorHandler';
import { registerAdminRoutes } from './routes/admin.routes';
import { registerUserRoutes } from './routes/user.routes';
import { registerAuthRoutes } from './routes/auth.routes';
import { registerGroupRoutes } from './routes/group.routes';
import { registerBoardRoutes } from './routes/board.routes';

export const createApp = (): Application => {
  const app = express();

  const corsOptions: cors.CorsOptions = {
    origin: ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  };

  app.use(cors(corsOptions));

  app.options(/.*/, cors(corsOptions));

  app.use(express.json());
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  registerAuthRoutes(app);
  registerUserRoutes(app);
  registerAdminRoutes(app);
  registerGroupRoutes(app);
  registerBoardRoutes(app);

  app.use(errorHandler);

  return app;
};
