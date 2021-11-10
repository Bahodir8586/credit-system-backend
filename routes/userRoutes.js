const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);
router.get('/verify', authController.protect, authController.verifyToken);

router.use(authController.protect);

router.get('/getMe', userController.getMe);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin', 'manager'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getAllUsers)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

router.use(authController.restrictTo('admin'));

module.exports = router;
