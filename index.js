const app = require('./config/express');
const { port, env } = require('./config/vars');
const { connectMongoose } = require('./config/mongoose');

connectMongoose().then(() => {
  app.listen(port, () =>
    console.info(`Api server started on port ${port} (${env})`),
  );
});

module.exports = app;
