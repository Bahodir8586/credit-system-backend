const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

router.post('/signin', authController.signin);
router.post('/signup', authController.signup);

router.get('/verifyToken',authController.protect, authController.verifyToken);

module.exports = router;
