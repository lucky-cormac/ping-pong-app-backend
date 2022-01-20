const httpStatus = require('http-status');
const APIError = require('../helpers/APIError');
const { env } = require('../../config/vars');

exports.errorConverter = (err, req, res, next) => {
  if (!(err instanceof APIError)) {
    const apiError = new APIError(
      err.message,
      err.status,
      err.isPublic,
      err.errors,
    );
    return next(apiError);
  }
  return next(err);
};

exports.notFoundError = (req, res, next) => {
  const err = new APIError('API not found.', httpStatus.NOT_FOUND, true);

  return next(err);
};

exports.errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  return res.status(err.status).json({
    message: err.isPublic ? err.message : httpStatus[err.status],
    ...(env === 'development' ? { stack: err.stack } : {}),
    ...(err.errors ? { errors: err.errors } : {}),
  });
};
