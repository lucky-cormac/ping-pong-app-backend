import mongoose from 'mongoose';
import UserModel from '../api/models/user.model';
import vars from '../config/vars';
import { connectMongoose, disconnectMongoose } from '../config/mongoose';
import seedUsers from './data/users';

const { env, adminEmail } = vars;

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
  }
};

run();
