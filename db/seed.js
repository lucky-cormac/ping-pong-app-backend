const mongoose = require('mongoose');
const UserModel = require('../api/models/user.model');
const { env, adminEmail } = require('../config/vars');
const { connectMongoose, disconnectMongoose } = require('../config/mongoose');
const seedUsers = require('./data/users');

mongoose.connection.on('error', (err) => {
  console.error(
    `MongoDB connection error occurred while trying to seed data: ${err.message}`,
  );
  process.exit(-1);
});

if (env === 'development') {
  mongoose.set('debug', true);
}

const run = async () => {
  try {
    await connectMongoose();
    const adminUser = await UserModel.findOne({ email: adminEmail });
    if (!adminUser) {
      await UserModel.create(seedUsers[0]);
    }
    await disconnectMongoose();
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(-1);
  }
};

run();
