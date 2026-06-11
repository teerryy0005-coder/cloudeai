# 🔗 Tashqi API Integratsiyasi

Bu qo'llanma Facebook Lead Ads dan kelgan leadlarni tashqi API ga avtomatik yuborish bo'yicha batafsil ma'lumot beradi.

## 📋 Umumiy ma'lumot

Platform Facebook dan lead olgandan so'ng, uni avtomatik ravishda sizning tashqi saytingizga yuboradi. Bu jarayon **facebookController.js** da bajariladi.

---

## 🔧 Sozlash

### 1. Environment variables

`.env` faylida quyidagilarni sozlang:

```env
# Tashqi API manzili
EXTERNAL_API_URL=https://your-target-api.com/api/leads

# API kaliti (agar kerak bo'lsa)
EXTERNAL_API_KEY=your-secret-api-key-here
```

### 2. API Endpoint talablari

Sizning tashqi API'ingiz quyidagi formatda ma'lumot qabul qilishi kerak:

**Request:**
```
POST https://your-api.com/api/leads
```

**Headers:**
```
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Body:**
```json
{
  "name": "Abdulloh Karimov",
  "email": "abdulloh@example.com",
  "phone": "+998901234567",
  "address": "Chilonzor tumani, 10-kvartal",
  "city": "Toshkent",
  "source": "facebook_lead_ads",
  "leadId": "123456789012345",
  "customFields": {
    "delivery_time": "09:00-12:00",
    "package_size": "kichik",
    "additional_notes": "Qo'shimcha izoh"
  }
}
```

**Response (muvaffaqiyatli):**
```json
{
  "success": true,
  "message": "Lead successfully received",
  "leadId": "YOUR_INTERNAL_ID"
}
```

**Response (xato):**
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error code or details"
}
```

---

## 🔨 Backend Code Tushuntirishlari

### sendToExternalAPI funksiyasi

`server/controllers/facebookController.js` faylidagi kod:

```javascript
async function sendToExternalAPI(lead) {
  try {
    const externalApiUrl = process.env.EXTERNAL_API_URL;
    const externalApiKey = process.env.EXTERNAL_API_KEY;
    
    // Agar API URL mavjud bo'lmasa, o'tkazib yuborish
    if (!externalApiUrl) {
      console.log('⚠️ External API URL not configured');
      return;
    }
    
    // Tashqi API uchun ma'lumotlarni tayyorlash
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
    
    // API ga yuborish
    const response = await axios.post(externalApiUrl, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${externalApiKey}`
      },
      timeout: 10000 // 10 soniya timeout
    });
    
    // Lead ni database da yangilash (muvaffaqiyatli yuborildi)
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
    
    // Lead ni database da yangilash (xato)
    lead.sentToExternalAPI = false;
    lead.externalAPIResponse = {
      success: false,
      message: error.message,
      timestamp: new Date()
    };
    await lead.save();
  }
}
```

---

## 🎯 API Response Handling

### Muvaffaqiyatli yuborilgan lead

Lead ma'lumotlar bazasida quyidagicha belgilanadi:

```javascript
{
  _id: "...",
  leadId: "123456789012345",
  customerName: "Abdulloh Karimov",
  // ... boshqa maydonlar
  sentToExternalAPI: true,
  externalAPIResponse: {
    success: true,
    message: "Successfully sent to external API",
    timestamp: "2026-06-11T10:30:00.000Z"
  }
}
```

### Xato bilan yuborilgan lead

```javascript
{
  _id: "...",
  leadId: "123456789012345",
  customerName: "Abdulloh Karimov",
  // ... boshqa maydonlar
  sentToExternalAPI: false,
  externalAPIResponse: {
    success: false,
    message: "Request timeout",
    timestamp: "2026-06-11T10:30:00.000Z"
  }
}
```

---

## 🔄 Retry Logic (Qayta urinish)

Agar lead tashqi API ga yuborilmasa, uni qayta yuborish uchun:

### 1. Manual retry

Admin dashboard orqali:

```javascript
// Frontend: Retry button
const retryLead = async (leadId) => {
  try {
    const response = await api.post(`/api/leads/${leadId}/retry`);
    toast.success('Lead qayta yuborildi');
  } catch (error) {
    toast.error('Xato yuz berdi');
  }
};
```

### 2. Automatic retry (Cron job)

`server/utils/retryFailedLeads.js` yaratish:

```javascript
const cron = require('node-cron');
const Lead = require('../models/Lead');
const axios = require('axios');

// Har 30 daqiqada xato leadlarni qayta yuborish
cron.schedule('*/30 * * * *', async () => {
  try {
    console.log('🔄 Checking failed leads...');
    
    // Yuborilmagan leadlarni topish
    const failedLeads = await Lead.find({
      sentToExternalAPI: false,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } // Oxirgi 24 soat
    }).limit(50);
    
    console.log(`Found ${failedLeads.length} failed leads`);
    
    for (const lead of failedLeads) {
      await sendToExternalAPI(lead);
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1 soniya kutish
    }
    
    console.log('✅ Retry completed');
  } catch (error) {
    console.error('❌ Retry error:', error.message);
  }
});

async function sendToExternalAPI(lead) {
  // ... yuqoridagi sendToExternalAPI funksiyasi
}

module.exports = { startRetryJob: () => cron };
```

`server/server.js` ga qo'shish:

```javascript
const { startRetryJob } = require('./utils/retryFailedLeads');

// Server ishga tushganda
startRetryJob();
```

---

## 📊 Monitoring va Analytics

### Lead yuborish statistikasi

Dashboard orqali ko'rish:

```javascript
// Backend endpoint
router.get('/api/leads/external-api-stats', async (req, res) => {
  try {
    const total = await Lead.countDocuments();
    const sent = await Lead.countDocuments({ sentToExternalAPI: true });
    const failed = await Lead.countDocuments({ sentToExternalAPI: false });
    
    res.json({
      success: true,
      data: {
        total,
        sent,
        failed,
        successRate: ((sent / total) * 100).toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});
```

### Logs

Har bir yuborish loglanadi:

```javascript
// Muvaffaqiyatli
console.log('✅ Lead sent to external API:', lead.leadId);

// Xato
console.error('❌ Error sending to external API:', error.message);
```

---

## 🔐 Xavfsizlik

### 1. API Key xavfsizligi

```env
# HECH QACHON .env faylini Git ga commit qilmang!
EXTERNAL_API_KEY=super-secret-key-here
```

### 2. HTTPS faqat

```javascript
// Faqat HTTPS URL qabul qilish
if (!externalApiUrl.startsWith('https://')) {
  throw new Error('External API must use HTTPS');
}
```

### 3. Request signing (qo'shimcha xavfsizlik)

```javascript
const crypto = require('crypto');

function generateSignature(payload, secret) {
  return crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
}

// API request da
const signature = generateSignature(payload, process.env.EXTERNAL_API_SECRET);
headers['X-Signature'] = signature;
```

Tashqi API da tekshirish:

```javascript
// Your API side
const signature = req.headers['x-signature'];
const expectedSignature = generateSignature(req.body, YOUR_SECRET);

if (signature !== expectedSignature) {
  return res.status(401).json({ error: 'Invalid signature' });
}
```

---

## 🧪 Test qilish

### 1. Postman orqali

**Request:**
```
POST http://localhost:5000/api/leads/test-external-api
```

**Body:**
```json
{
  "name": "Test User",
  "phone": "+998901234567",
  "email": "test@example.com",
  "address": "Test address",
  "city": "Tashkent"
}
```

### 2. cURL orqali

```bash
curl -X POST http://localhost:5000/api/leads/test-external-api \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test User",
    "phone": "+998901234567",
    "email": "test@example.com",
    "address": "Test address",
    "city": "Tashkent"
  }'
```

### 3. Test endpoint yaratish

`server/routes/leads.js` ga qo'shish:

```javascript
router.post('/test-external-api', protect, async (req, res) => {
  try {
    const testLead = new Lead({
      leadId: 'test_' + Date.now(),
      formId: 'test_form',
      customerName: req.body.name,
      phone: req.body.phone,
      email: req.body.email,
      address: req.body.address,
      city: req.body.city,
      status: 'yangi',
      source: 'manual_test'
    });
    
    await testLead.save();
    await sendToExternalAPI(testLead);
    
    res.json({
      success: true,
      message: 'Test lead sent',
      lead: testLead
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});
```

---

## 🎨 Frontend Integration

Dashboard da tashqi API statusini ko'rsatish:

```javascript
// ExternalAPIStatus.jsx
import React, { useEffect, useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const ExternalAPIStatus = () => {
  const [stats, setStats] = useState(null);
  
  useEffect(() => {
    fetchStats();
  }, []);
  
  const fetchStats = async () => {
    const response = await api.get('/api/leads/external-api-stats');
    setStats(response.data.data);
  };
  
  if (!stats) return <div>Loading...</div>;
  
  return (
    <div className="external-api-status">
      <h3>Tashqi API Status</h3>
      <div className="stats">
        <div className="stat">
          <CheckCircle color="green" />
          <span>Yuborilgan: {stats.sent}</span>
        </div>
        <div className="stat">
          <XCircle color="red" />
          <span>Xato: {stats.failed}</span>
        </div>
        <div className="stat">
          <AlertCircle color="blue" />
          <span>Muvaffaqiyat: {stats.successRate}%</span>
        </div>
      </div>
    </div>
  );
};
```

---

## 📞 Qo'llab-quvvatlash

Tashqi API integratsiyasi bo'yicha savollar uchun:
- Email: support@yuboraman.uz
- Telegram: @yuboraman_support
- Documentation: https://docs.yuboraman.uz

---

**Muvaffaqiyatli integratsiya!** 🎉
