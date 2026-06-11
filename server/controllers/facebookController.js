const axios = require('axios');
const Lead = require('../models/Lead');
const Integration = require('../models/Integration');

// Facebook Webhook Verification
exports.verifyWebhook = (req, res) => {
  const VERIFY_TOKEN = process.env.FACEBOOK_VERIFY_TOKEN;
  
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  
  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('✅ Facebook Webhook verified');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  }
};

// Receive Facebook Lead
exports.receiveWebhook = async (req, res) => {
  const body = req.body;
  
  if (body.object === 'page') {
    // Acknowledge receipt immediately
    res.status(200).send('EVENT_RECEIVED');
    
    // Process each entry
    body.entry.forEach(async (entry) => {
      const changes = entry.changes;
      
      changes.forEach(async (change) => {
        if (change.field === 'leadgen') {
          const leadgenId = change.value.leadgen_id;
          const formId = change.value.form_id;
          const pageId = change.value.page_id;
          
          // Fetch lead details from Facebook
          await fetchAndSaveLead(leadgenId, formId);
        }
      });
    });
  } else {
    res.sendStatus(404);
  }
};

// Fetch lead details from Facebook Graph API
async function fetchAndSaveLead(leadgenId, formId) {
  try {
    const accessToken = process.env.FACEBOOK_ACCESS_TOKEN;
    const url = `https://graph.facebook.com/v18.0/${leadgenId}?access_token=${accessToken}`;
    
    const response = await axios.get(url);
    const leadData = response.data;
    
    // Parse field data
    const fieldData = {};
    if (leadData.field_data) {
      leadData.field_data.forEach(field => {
        fieldData[field.name] = field.values[0];
      });
    }
    
    // Create lead in database
    const newLead = new Lead({
      leadId: leadgenId,
      formId: formId,
      formName: leadData.form_name || 'Unknown Form',
      customerName: fieldData.full_name || fieldData.name || '',
      email: fieldData.email || '',
      phone: fieldData.phone_number || fieldData.phone || '',
      address: fieldData.address || '',
      city: fieldData.city || '',
      customFields: fieldData,
      status: 'yangi',
      source: 'facebook_lead_ads',
      createdAt: new Date(leadData.created_time)
    });
    
    await newLead.save();
    console.log('✅ Lead saved:', leadgenId);
    
    // Update integration statistics
    await updateIntegrationStats('facebook', true);
    
    // Send to external API
    await sendToExternalAPI(newLead);
    
    // Emit socket event for real-time update
    if (global.io) {
      global.io.emit('newLead', newLead);
    }
    
  } catch (error) {
    console.error('❌ Error fetching lead:', error.message);
    await updateIntegrationStats('facebook', false);
  }
}

// Send lead to external API
async function sendToExternalAPI(lead) {
  try {
    const externalApiUrl = process.env.EXTERNAL_API_URL;
    const externalApiKey = process.env.EXTERNAL_API_KEY;
    
    if (!externalApiUrl) {
      console.log('⚠️ External API URL not configured');
      return;
    }
    
    const payload = {
      name: lead.customerName,
      email: lead.email,
      phone: lead.phone,
      address: lead.address,
      city: lead.city,
      source: 'facebook_lead_ads',
      leadId: lead.leadId,
      customFields: Object.fromEntries(lead.customFields || {})
    };
    
    const response = await axios.post(externalApiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${externalApiKey}`
      },
      timeout: 10000
    });
    
    // Update lead with external API response
    lead.sentToExternalAPI = true;
    lead.externalAPIResponse = {
      success: true,
      message: 'Successfully sent to external API',
      timestamp: new Date()
    };
    await lead.save();
    
    console.log('✅ Lead sent to external API:', lead.leadId);
    
  } catch (error) {
    console.error('❌ Error sending to external API:', error.message);
    
    lead.sentToExternalAPI = false;
    lead.externalAPIResponse = {
      success: false,
      message: error.message,
      timestamp: new Date()
    };
    await lead.save();
  }
}

// Update integration statistics
async function updateIntegrationStats(integrationType, success) {
  try {
    const integration = await Integration.findOne({ type: integrationType });
    
    if (integration) {
      integration.statistics.totalLeads += 1;
      if (success) {
        integration.statistics.successfulLeads += 1;
      } else {
        integration.statistics.failedLeads += 1;
      }
      integration.statistics.lastSync = new Date();
      await integration.save();
    }
  } catch (error) {
    console.error('Error updating integration stats:', error.message);
  }
}

module.exports = exports;
