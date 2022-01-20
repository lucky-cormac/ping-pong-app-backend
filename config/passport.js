const passport = require('passport');
const httpStatus = require('http-status');
const passportLocal = require('passport-local');
const passportJwt = require('passport-jwt');
const UserModel = require('../api/models/user.model');
const APIError = require('../api/helpers/APIError');
const { jwtSecret } = require('./vars');

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const localOpts = {
  usernameField: 'email',
  passwordField: 'password',
  session: false,
};
const jwtOpts = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

const registerUserCallback = async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      return done(
        new APIError('Email already exists.', httpStatus.BAD_REQUEST, true),
      );
    }
    const createdUser = await UserModel.create({ email, password });
    return done(null, createdUser);
  } catch (err) {
    return done(err);
  }
};

const loginUserCallback = async (email, password, done) => {
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return done(
        new APIError('User not found.', httpStatus.UNAUTHORIZED, true),
      );
    }

    if (!user.isValidPassword(password)) {
      return done(
        new APIError('Invalid password.', httpStatus.UNAUTHORIZED, true),
      );
    }

    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

const jwtCallback = async (jwtPayload, done) => {
  try {
    const user = await UserModel.findById(jwtPayload._id);
    if (user) {
      return done(null, user);
    }

    return done(null, false);
  } catch (err) {
    return done(err);
  }
};

module.exports = () => {
  passport.use('register', new LocalStrategy(localOpts, registerUserCallback));
  passport.use('login', new LocalStrategy(localOpts, loginUserCallback));
  passport.use('jwt', new JWTstrategy(jwtOpts, jwtCallback));
};
