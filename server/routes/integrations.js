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

// No auth required - direct access
router.get('/', getAllIntegrations);
router.get('/:id', getIntegration);
router.post('/', createIntegration);
router.put('/:id', updateIntegration);
router.delete('/:id', deleteIntegration);
router.post('/:id/test', testIntegration);

module.exports = router;
