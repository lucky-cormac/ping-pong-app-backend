import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import constants from '../utils/constants';

const Schema = mongoose.Schema;
const { BCRYPT_SALT_ROUNDS } = constants;

const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

UserSchema.pre('save', (next) => {
  this.password = bcrypt.hashSync(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

UserSchema.pre('findOneAndUpdate', (next) => {
  const { password } = this.getUpdate();
  if (password) {
    const encryptedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    this.setUpdate({ ...this.getUpdate(), password: encryptedPassword });
  }
  next();
});

UserSchema.methods.isValidPassword = (password) => {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('user', UserSchema);

export default UserModel;
