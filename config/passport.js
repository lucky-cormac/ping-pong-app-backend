import passport from 'passport';
import httpStatus from 'http-status';
import passportLocal from 'passport-local';
import passportJwt from 'passport-jwt';
import UserModel from '../api/models/user.model';
import APIError from '../api/helpers/APIError';
import vars from './vars';

const LocalStrategy = passportLocal.Strategy;
const JWTstrategy = passportJwt.Strategy;
const ExtractJWT = passportJwt.ExtractJwt;
const { jwtSecret } = vars;
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

export default () => {
  passport.use('register', new LocalStrategy(localOpts, registerUserCallback));
  passport.use('login', new LocalStrategy(localOpts, loginUserCallback));
  passport.use('jwt', new JWTstrategy(jwtOpts, jwtCallback));
};
