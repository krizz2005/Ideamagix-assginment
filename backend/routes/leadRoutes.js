const express = require('express');
const router = express.Router();
const { 
  getLeads, createLead, updateLead, deleteLead, 
  addLeadNote, importLeadsExcel, exportLeadsExcel, getDashboardStats 
} = require('../controllers/leadController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.use(protect);

router.get('/dashboard/stats', getDashboardStats);
router.post('/export', exportLeadsExcel);


router.post('/import', authorizeRoles('Super Admin', 'Sub-Admin'), upload.single('file'), importLeadsExcel);

router.route('/')
  .get(getLeads)
  .post(authorizeRoles('Super Admin', 'Sub-Admin'), createLead);

router.route('/:id')
  .put(updateLead)
  .delete(authorizeRoles('Super Admin', 'Sub-Admin'), deleteLead);

router.post('/:id/notes', addLeadNote);

module.exports = router;