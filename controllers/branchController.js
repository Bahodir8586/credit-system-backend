const multer = require('multer');
const sharp = require('sharp');

const Branch = require('../models/branchModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, callback) => {
  if (file.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(
      new AppError('Not an image! Please upload only images.', 400),
      false
    );
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadBranchImages = upload.single('image');

exports.resizeBranchImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // 1) Cover image
  req.body.image = `branch-${Date.now()}.jpeg`;
  try {
    await sharp(req.file.buffer)
      .resize(640, 640)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/branches/${req.body.image}`);
  } catch (e) {
    console.log(e);
  }

  console.log(req.body.image);
  next();
});

exports.getAllBranches = catchAsync(async (req, res, next) => {
  const branches = await Branch.find();
  const readyBranches = await Promise.all(
    branches.map(async (branch) => {
      const employees = await User.aggregate([
        { $match: { branch: branch._id } },
        { $project: { id: 1, name: 1, role: 1 } },
      ]);
      return { branch, employees }
    })
  );
  console.log(branches);
  res.status(200).json({
    status: 'success',
    data: {
      branches: readyBranches,
    },
  });
});
exports.getSingleBranch = catchAsync(async (req, res, next) => {
  const branch = await Branch.findById(req.params.id);
  if (!branch) {
    return next(new AppError('No branch found with that ID', 404));
  }
  const employees = await User.find({ branch: req.params.id });
  console.log(branch);
  res.status(200).json({
    status: 'success',
    data: {
      branch: {
        branch,
        employees,
      },
    },
  });
});
exports.createBranch = catchAsync(async (req, res, next) => {
  const { name, longitude, latitude, image, address, description } = req.body;
  const branch = await Branch.create({
    name,
    image,
    location: {
      type: 'Point',
      coordinates: [longitude, latitude],
      address,
      description,
    },
  });
  res.status(200).json({
    status: 'success',
    data: {
      branch,
    },
  });
});
exports.updateBranch = catchAsync(async (req, res, next) => {
  const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!branch) {
    return next(new AppError('No branch found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      branch,
    },
  });
});
exports.deleteBranch = catchAsync(async (req, res, next) => {
  const branch = await Branch.findByIdAndDelete(req.params.id);
  if (!branch) {
    return next(new AppError('No branch found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});
