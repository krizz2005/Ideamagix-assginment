const express = require('express');
const router = express.Router();
const { getTags, createTag, deleteTag } = require('../controllers/tagController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getTags)
  .post(authorizeRoles('Super Admin', 'Sub-Admin'), createTag);

router.route('/:id')
  .delete(authorizeRoles('Super Admin', 'Sub-Admin'), deleteTag);

module.exports = router;