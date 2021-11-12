const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.use(authController.protect);
router.patch(
  '/out/:id',
  authController.restrictTo(
    'admin',
    'manager',
    'warehouseManager',
    'assistant'
  ),
  productController.outProduct
);
router.use(authController.restrictTo('admin', 'warehouseManager'));
router.patch('/in/:id', productController.inProduct);

router.post(
  '/',
  productController.uploadProductImages,
  productController.resizeProductImage,
  productController.createProduct
);
router
  .route('/:id')
  .patch(
    productController.uploadProductImages,
    productController.resizeProductImage,
    productController.updateProduct
  )
  .delete(productController.deleteProduct);

module.exports = router;

// Sell => amount
// Out  => amount
// In   => amount
// Edit => name, image, price, priceDiscount, description
// Credit => do it later
