const express = require('express');
const router = express.Router();
const { getUsers, createUser, updateUser, deleteUser, getActivityLogs } = require('../controllers/userController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);


router.route('/')
  .get(authorizeRoles('Super Admin', 'Sub-Admin'), getUsers)
  .post(authorizeRoles('Super Admin', 'Sub-Admin'), createUser);


router.route('/logs')
  .get(authorizeRoles('Super Admin'), getActivityLogs);


router.route('/:id')
  .put(authorizeRoles('Super Admin', 'Sub-Admin'), updateUser)
  .delete(authorizeRoles('Super Admin'), deleteUser);

module.exports = router;