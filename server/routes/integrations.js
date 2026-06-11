const express = require('express');
const router = express.Router();
const {
  getAllIntegrations,
  getIntegration,
  createIntegration,
  updateIntegration,
  deleteIntegration,
  testIntegration
} = require('../controllers/integrationController');
const { protect, admin } = require('../middleware/auth');

router.get('/', protect, getAllIntegrations);
router.get('/:id', protect, getIntegration);
router.post('/', protect, admin, createIntegration);
router.put('/:id', protect, admin, updateIntegration);
router.delete('/:id', protect, admin, deleteIntegration);
router.post('/:id/test', protect, testIntegration);

module.exports = router;
