import { createApp } from './apps/app';
import { env } from './config/env';
import { connectMongoDb } from './config/mongoDB';

const bootstrap = async () => {
  await connectMongoDb();

  const app = createApp();
  app.listen(env.port, () => {
    console.log(`Server listening on port ${env.port}`);
  });
};

bootstrap().catch((err) => {
  console.error('Failed to start app', err);
});
