const passport = require('passport');
const httpStatus = require('http-status');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/vars');
const { userWithoutPassword } = require('../utils/misc');

exports.login = (req, res, next) => {
  passport.authenticate('login', (err, user) => {
    if (err) {
      return next(err);
    }

    req.logIn(user, { session: false }, (error) => {
      if (error) {
        return next(error);
      }

      const token = jwt.sign({ _id: user._id }, jwtSecret);
      return res
        .status(httpStatus.OK)
        .json({ token, user: userWithoutPassword(user) });
    });
  })(req, res, next);
};

exports.register = (req, res, next) => {
  passport.authenticate('register', { session: false }, (err, user) => {
    if (err) {
      return next(err);
    }

    req.logIn(user, { session: false }, (error) => {
      if (error) {
        return next(error);
      }

      const token = jwt.sign({ _id: user._id }, jwtSecret);
      return res
        .status(httpStatus.CREATED)
        .json({ token, user: userWithoutPassword(user) });
    });
  })(req, res, next);
};
