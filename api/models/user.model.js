const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { BCRYPT_SALT_ROUNDS } = require('../utils/constants');

const Schema = mongoose.Schema;

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

UserSchema.pre('save', function callback(next) {
  this.password = bcrypt.hashSync(this.password, BCRYPT_SALT_ROUNDS);
  next();
});

UserSchema.pre('findOneAndUpdate', function callback(next) {
  const { password } = this.getUpdate();
  if (password) {
    const encryptedPassword = bcrypt.hashSync(password, BCRYPT_SALT_ROUNDS);
    this.setUpdate({ ...this.getUpdate(), password: encryptedPassword });
  }
  next();
});

UserSchema.methods.isValidPassword = function checkPassword(password) {
  return bcrypt.compareSync(password, this.password);
};

const UserModel = mongoose.model('user', UserSchema);

module.exports = UserModel;
