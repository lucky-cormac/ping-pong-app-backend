import bluebird from 'bluebird';
import mongoose from 'mongoose';
import vars from './vars';

mongoose.Promise = bluebird;
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
  process.exit(-1);
});

const { mongo, env } = vars;
if (env === 'development') {
  mongoose.set('debug', true);
}

export const connectMongoose = () =>
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

export const disconnectMongoose = () => mongoose.disconnect();
