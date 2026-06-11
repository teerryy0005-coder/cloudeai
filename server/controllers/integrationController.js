const Integration = require('../models/Integration');

// Get all integrations
exports.getAllIntegrations = async (req, res) => {
  try {
    const integrations = await Integration.find().sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: integrations
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get single integration
exports.getIntegration = async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integratsiya topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: integration
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Create integration
exports.createIntegration = async (req, res) => {
  try {
    const { name, type, config } = req.body;
    
    const integration = new Integration({
      name,
      type,
      config,
      status: 'inactive'
    });
    
    await integration.save();
    
    res.status(201).json({
      success: true,
      data: integration,
      message: 'Integratsiya muvaffaqiyatli yaratildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update integration
exports.updateIntegration = async (req, res) => {
  try {
    const { name, status, config } = req.body;
    
    const integration = await Integration.findByIdAndUpdate(
      req.params.id,
      { name, status, config, updatedAt: Date.now() },
      { new: true }
    );
    
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integratsiya topilmadi'
      });
    }
    
    res.json({
      success: true,
      data: integration,
      message: 'Integratsiya muvaffaqiyatli yangilandi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Delete integration
exports.deleteIntegration = async (req, res) => {
  try {
    const integration = await Integration.findByIdAndDelete(req.params.id);
    
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integratsiya topilmadi'
      });
    }
    
    res.json({
      success: true,
      message: 'Integratsiya muvaffaqiyatli o\'chirildi'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Test integration connection
exports.testIntegration = async (req, res) => {
  try {
    const integration = await Integration.findById(req.params.id);
    
    if (!integration) {
      return res.status(404).json({
        success: false,
        message: 'Integratsiya topilmadi'
      });
    }
    
    // Test connection logic based on integration type
    let testResult = { success: false, message: 'Test failed' };
    
    if (integration.type === 'facebook') {
      // Test Facebook connection
      testResult = await testFacebookConnection(integration.config);
    }
    
    res.json({
      success: testResult.success,
      message: testResult.message
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Helper function to test Facebook connection
async function testFacebookConnection(config) {
  try {
    const axios = require('axios');
    const accessToken = config.accessToken || process.env.FACEBOOK_ACCESS_TOKEN;
    
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/me?access_token=${accessToken}`
    );
    
    return {
      success: true,
      message: 'Facebook connection successful'
    };
  } catch (error) {
    return {
      success: false,
      message: `Facebook connection failed: ${error.message}`
    };
  }
}

module.exports = exports;
