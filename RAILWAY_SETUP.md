# 🚂 Railway Backend Setup - To'liq Qo'llanma

Bu qo'llanma backend'ni Railway ga deploy qilish va Facebook Lead Ads bilan ishlashga tayyorlash uchun.

---

## 📋 Bosqichlar

### 1️⃣ Railway Loyiha Yaratish

1. **Railway.app ga o'ting:** https://railway.app
2. **Sign up with GitHub**
3. **New Project** tugmasini bosing
4. **Deploy from GitHub repo** ni tanlang
5. **`teerryy0005-coder/cloudeai`** repository ni tanlang
6. **Deploy** tugmasini bosing

---

### 2️⃣ MongoDB Qo'shish

1. Railway loyihangizda **+ New** tugmasini bosing
2. **Database** → **Add MongoDB** ni tanlang
3. MongoDB avtomatik yaratiladi va ulanadi
4. **Variables** tabda `MONGO_URL` ni ko'rishingiz mumkin

---

### 3️⃣ Environment Variables Sozlash

Railway dashboard da **Variables** bo'limiga o'ting va quyidagilarni qo'shing:

```env
# Server
PORT=5000
NODE_ENV=production

# Database (avtomatik qo'shiladi)
MONGODB_URI=${{MongoDB.MONGO_URL}}

# JWT Secret (ixtiyoriy token uchun)
JWT_SECRET=yuboraman-super-secret-key-2026-minimum-32-characters

# Facebook Lead Ads
FACEBOOK_APP_ID=sizning_app_id
FACEBOOK_APP_SECRET=sizning_app_secret
FACEBOOK_ACCESS_TOKEN=sizning_page_access_token
FACEBOOK_VERIFY_TOKEN=my_custom_verify_token_123

# External API (leadlarni yuborish uchun)
EXTERNAL_API_URL=https://target-api.com/api/leads
EXTERNAL_API_KEY=sizning_api_key

# Frontend URL
CLIENT_URL=https://profound-brigadeiros-873db7.netlify.app

# Admin (avtomatik yaratiladi)
ADMIN_EMAIL=teerryy0005@gmail.com
ADMIN_PASSWORD=250502@Xz
```

---

### 4️⃣ Domain Olish

1. **Settings** → **Networking** ga o'ting
2. **Generate Domain** tugmasini bosing
3. Domain nusxalang: `https://yuboraman-production-abcd.up.railway.app`

---

### 5️⃣ Netlify Environment Variables Yangilash

Netlify dashboard da **Site settings** → **Environment variables**:

```env
REACT_APP_API_URL=https://yuboraman-production-abcd.up.railway.app/api
REACT_APP_SOCKET_URL=https://yuboraman-production-abcd.up.railway.app
```

**Netlify ni redeploy qiling:**
- **Deploys** → **Trigger deploy** → **Clear cache and deploy**

---

### 6️⃣ Backend Test Qilish

```bash
# Health check
curl https://yuboraman-production-abcd.up.railway.app/api/health

# Expected response:
{
  "success": true,
  "message": "Server ishlamoqda",
  "timestamp": "2026-06-11T..."
}
```

---

## 📱 Facebook Lead Ads Sozlash

### 1. Facebook App Yaratish

1. **Facebook Developers:** https://developers.facebook.com
2. **My Apps** → **Create App**
3. **Business** tipini tanlang
4. App nomini kiriting: "Yuboraman Lead System"
5. **Create App**

### 2. Webhooks Sozlash

1. **Products** → **Webhooks** → **Set Up**
2. **Page** subscription ni tanlang
3. **Edit Subscription:**
   - **Callback URL:** `https://yuboraman-production-abcd.up.railway.app/api/webhook/facebook`
   - **Verify Token:** `my_custom_verify_token_123` (Railway dagi `FACEBOOK_VERIFY_TOKEN`)
4. **leadgen** checkbox ni belgilang
5. **Verify and Save**

### 3. Access Token Olish

**Graph API Explorer:** https://developers.facebook.com/tools/explorer/

1. **Permissions qo'shing:**
   - `pages_manage_ads`
   - `leads_retrieval`
   - `pages_read_engagement`

2. **Generate Access Token**

3. **Long-lived token ga aylantirish:**
```bash
curl "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_TOKEN"
```

4. **Page Access Token olish:**
```bash
curl "https://graph.facebook.com/v18.0/me/accounts?access_token=LONG_LIVED_TOKEN"
```

5. Railway da `FACEBOOK_ACCESS_TOKEN` ni yangilang

### 4. Webhook ni Test Qilish

```bash
curl -X POST "https://yuboraman-production-abcd.up.railway.app/api/webhook/facebook" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "page",
    "entry": [{
      "changes": [{
        "field": "leadgen",
        "value": {
          "leadgen_id": "test_123",
          "form_id": "form_456",
          "page_id": "page_789"
        }
      }]
    }]
  }'
```

---

## 🔗 Tashqi API Sozlash

### API Format

Sizning tashqi API'ingiz quyidagi formatda ma'lumot qabul qilishi kerak:

**Request:**
```
POST https://your-api.com/api/leads
Content-Type: application/json
Authorization: Bearer YOUR_API_KEY
```

**Body:**
```json
{
  "name": "Ism Familiya",
  "email": "email@example.com",
  "phone": "+998901234567",
  "address": "Manzil",
  "city": "Shahar",
  "source": "facebook_lead_ads",
  "leadId": "facebook_lead_id",
  "customFields": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead received",
  "id": "your_internal_id"
}
```

### Railway da Sozlash

```env
EXTERNAL_API_URL=https://your-target-api.com/api/leads
EXTERNAL_API_KEY=your_secret_api_key
```

---

## ✅ Tekshirish Ro'yxati

Backend ishlashini tekshirish:

- [ ] Railway deploy bo'ldi (Deployments tab)
- [ ] MongoDB ulanishi faol (Variables tab)
- [ ] Domain generate qilindi
- [ ] `/api/health` endpoint ishlayapti
- [ ] Netlify environment variables yangilandi
- [ ] Frontend - Backend bog'lanishi ishlayapti
- [ ] Facebook App yaratildi
- [ ] Webhooks sozlandi va verify qilindi
- [ ] Access Token olindi va sozlandi
- [ ] Test webhook yuborildi

Facebook integratsiya:

- [ ] Page subscription faol
- [ ] Test lead yuborildi
- [ ] Lead database ga tushdi
- [ ] Dashboard da lead ko'rinadi
- [ ] External API ga yuborildi (agar sozlangan bo'lsa)

---

## 🆘 Troubleshooting

### "Cannot connect to database"
```bash
# Railway logs ni tekshiring
# Deployments → View logs
# MONGODB_URI to'g'riligini tekshiring
```

### "Webhook verification failed"
```bash
# Verify token mos kelishini tekshiring
# Railway: FACEBOOK_VERIFY_TOKEN
# Facebook: Callback URL sozlamalarida verify token
```

### "Lead data not saving"
```bash
# Railway logs:
# ✅ Lead saved: leadgen_id
# ❌ Error: ...
```

### "Frontend API error"
```bash
# Browser console:
# Network tab → API calls
# Netlify environment variables to'g'riligini tekshiring
```

---

## 📊 Monitoring

Railway dashboard da:

1. **Metrics** → CPU, Memory, Network
2. **Logs** → Real-time server logs
3. **Deployments** → Deploy history

---

## 🎉 Tugallandi!

Endi platformangiz to'liq ishlaydi:

- ✅ **Frontend:** https://profound-brigadeiros-873db7.netlify.app
- ✅ **Backend:** https://yuboraman-production.up.railway.app
- ✅ **Facebook Webhooks:** Aktiv
- ✅ **External API:** Leadlar yuboriladi

---

**Muvaffaqiyatli deploy!** 🚀

Savollar: `FACEBOOK_SETUP.md` va `EXTERNAL_API.md` ni o'qing
