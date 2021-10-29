const AppError = require('./../utils/appError');

module.exports = (err, req, res, next) => {
  return res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
