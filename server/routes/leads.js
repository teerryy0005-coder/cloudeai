const express = require('express');
const router = express.Router();
const {
  getAllLeads,
  getLead,
  updateLeadStatus,
  getStatistics,
  getRecentActivities
} = require('../controllers/leadController');

// No auth middleware - direct access
router.get('/', getAllLeads);
router.get('/statistics', getStatistics);
router.get('/activities', getRecentActivities);
router.get('/:id', getLead);
router.put('/:id/status', updateLeadStatus);

module.exports = router;
