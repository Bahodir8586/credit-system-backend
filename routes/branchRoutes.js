const express = require('express');
const authController = require('../controllers/authController');
const branchController = require('../controllers/branchController');

const router = express.Router();

router.get('/', branchController.getAllBranches);
router.get('/:id', branchController.getSingleBranch);

router.use(authController.protect, authController.restrictTo('admin'));

router.route('/').post(branchController.createBranch);
router
  .route('/:id')
  .patch(branchController.updateBranch)
  .delete(branchController.deleteBranch);

module.exports = router;
