const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);
router.get('/logout', authController.logout);
router.get('/verify', authController.protect, authController.verifyToken);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;
