const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {});

exports.createUser = catchAsync(async (req, res, next) => {});

exports.updateUser = catchAsync(async (req, res, next) => {});

exports.deleteUser = catchAsync(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new AppError('No user found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getUsers = catchAsync(async (req, res, next) => {});

exports.getMe = catchAsync(async (req, res, next) => {});

exports.updateMe = catchAsync(async (req, res, next) => {});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
