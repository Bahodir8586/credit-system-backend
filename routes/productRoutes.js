const express = require('express');
const authController = require('../controllers/authController');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);

router.use(authController.protect);
router.use(authController.restrictTo('admin', 'warehouseManager'));

router.post(
  '/',
  productController.uploadProductImages,
  productController.resizeProductImage,
  productController.createProduct
);
router
  .route('/:id')
  //   .patch(productController.updateProduct)
  .delete(productController.deleteProduct);

module.exports = router;
