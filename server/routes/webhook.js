const express = require('express');
const router = express.Router();
const { verifyWebhook, receiveWebhook } = require('../controllers/facebookController');

// Facebook webhook verification
router.get('/facebook', verifyWebhook);

// Receive Facebook lead webhooks
router.post('/facebook', receiveWebhook);

module.exports = router;
