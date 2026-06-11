const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  getLead,
  updateLeadStatus,
  getStatistics,
  getRecentActivities
} = require('../controllers/leadController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getAllLeads);
router.get('/statistics', protect, getStatistics);
router.get('/activities', protect, getRecentActivities);
router.get('/:id', protect, getLead);
router.put('/:id/status', protect, updateLeadStatus);

module.exports = router;
