const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.createUser = catchAsync(async (req, res, next) => {
  const { name, email, password, passwordConfirm, role } = req.body;
  if (!name || !email || !password || !passwordConfirm) {
    return next(new AppError('Please provide all required fields', 400));
  }
  const newUser = await User.create({
    name,
    email,
    password,
    passwordConfirm,
    role,
  });
  res.status(201).json({
    status: 'success',
    data: {
      newUser,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for updating password', 400));
  }
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
  };
  const updatedUser = await User.findByIdAndUpdate(
    req.params.id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

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

exports.getUsers = catchAsync(async (req, res, next) => {
  console.log(req.query);
  let filter = {};
  if (req.user.role === 'manager') {
  }
  const users = User.find(filter);
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getMe = catchAsync(async (req, res, next) => {
  const user = User.findById(req.user.id);
  //   TODO: populations there
  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(new AppError('This route is not for updating password', 400));
  }
  const filteredBody = {
    name: req.body.name,
    email: req.body.email,
  };
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.user.id);
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
