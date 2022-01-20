const bluebird = require('bluebird');
const mongoose = require('mongoose');
const { mongo, env } = require('./vars');

mongoose.Promise = bluebird;
mongoose.connection.on('error', (err) => {
  console.error(`MongoDB connection error: ${err.message}`);
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

exports.connectMongoose = () =>
  mongoose.connect(mongo.uri, {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

exports.disconnectMongoose = () => mongoose.disconnect();
