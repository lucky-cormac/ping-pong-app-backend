import path from 'path';
import dotenvSafe from 'dotenv-safe';

dotenvSafe.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

export default {
  env: process.env.API_SERVER_NODE_ENV,
  port: process.env.API_SERVER_PORT,
  adminEmail: process.env.ADMIN_EMAIL,
  jwtSecret: process.env.JWT_SECRET,
  mongo: {
    uri:
      process.env.API_SERVER_NODE_ENV === 'test'
        ? process.env.MONGO_URI_TESTS
        : process.env.MONGO_URI,
  },
  logs: process.env.API_SERVER_NODE_ENV === 'production' ? 'combined' : 'dev',
};
