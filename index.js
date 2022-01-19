import app from './config/express';
import vars from './config/vars';
import { connectMongoose } from './config/mongoose';

const { port, env } = vars;

connectMongoose().then(() => {
  app.listen(port, () =>
    console.info(`Api server started on port ${port} (${env})`),
  );
});

export default app;
