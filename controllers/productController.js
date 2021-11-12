const multer = require('multer');
const sharp = require('sharp');

const Product = require('../models/productModel');
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

exports.uploadProductImages = upload.single('image');

exports.resizeProductImage = catchAsync(async (req, res, next) => {
  if (!req.file) return next();
  // 1) Cover image
  req.body.image = `product-${Date.now()}.jpeg`;
  try {
    await sharp(req.file.buffer)
      .resize(640, 640)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/products/${req.body.image}`);
  } catch (e) {
    console.log(e);
  }

  console.log(req.body.image);
  next();
});

exports.getAllProducts = catchAsync(async (req, res, next) => {
  console.log(req.query);
  let filter = { ...req.query };
  //   TODO: apply pagination and search
  const products = await Product.find();
  console.log(products);
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that id', 404));
  }
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const { name, price } = req.body;
  if (!name || !price) {
    return next(new AppError('Please provide all required fields', 400));
  }
  const newProduct = await Product.create(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      newProduct,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.outProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (product.amount < req.body.amount) {
    return next(
      new AppError('Given amount is larger than available amount', 400)
    );
  }
  product.amount = product.amount - req.body.amount;
  await product.save();
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.inProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, {
    amount: amount + req.body.amount,
  });
  res.status(201).json({
    status: 'success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  if (req.body.amount) {
    return next(new AppError('This route is not for updating amount', 400));
  }
  const product = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      product,
    },
  });
});
