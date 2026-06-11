# 📱 Facebook Lead Ads - To'liq Sozlash Qo'llanmasi

Bu qo'llanma Facebook Lead Ads integratsiyasini boshlang'ich bosqichdan to oxirigacha sozlash bo'yicha batafsil ko'rsatmalar beradi.

## 📋 Bosqichlar ro'yxati

- [ ] Facebook Business Account yaratish
- [ ] Facebook App yaratish
- [ ] Lead Ads permissions olish
- [ ] Webhook sozlash
- [ ] Access Token olish
- [ ] Test lead yuborish
- [ ] Production ga o'tish

---

## 1️⃣ Facebook Business Account yaratish

### A. Business Manager yaratish

1. [business.facebook.com](https://business.facebook.com) ga o'ting
2. **Create Account** tugmasini bosing
3. Biznes nomingizni kiriting
4. Email va ma'lumotlaringizni to'ldiring
5. Biznes turini tanlang

### B. Facebook Page yaratish (agar yo'q bo'lsa)

1. Facebook da **Create** → **Page** ni tanlang
2. Page turini tanlang (Business yoki Brand)
3. Page nomini va kategoriyasini kiriting
4. Page ni Business Manager ga qo'shing

---

## 2️⃣ Facebook App yaratish

### A. Developer Account yaratish

1. [developers.facebook.com](https://developers.facebook.com) ga o'ting
2. **Get Started** tugmasini bosing
3. Developer account ni tasdiqlang

### B. Yangi App yaratish

1. **My Apps** → **Create App** ni bosing
2. **Business** tipini tanlang
3. App ma'lumotlarini kiriting:
   - **Display Name:** Yuboraman Lead System
   - **App Contact Email:** your-email@example.com
   - **Business Account:** Biznesingizni tanlang
4. **Create App** ni bosing

### C. App ID va Secret olish

1. **Settings** → **Basic** ga o'ting
2. **App ID** ni nusxalang → `.env` fayliga qo'shing
3. **App Secret** ni ko'rsating va nusxalang → `.env` fayliga qo'shing

```env
FACEBOOK_APP_ID=your_app_id_here
FACEBOOK_APP_SECRET=your_app_secret_here
```

---

## 3️⃣ Webhooks sozlash

### A. Webhook mahsulotini qo'shish

1. App dashboardda **Add Product** ni bosing
2. **Webhooks** ni tanlang va **Set Up** tugmasini bosing

### B. Webhook ni konfiguratsiya qilish

1. **Page** subscription ni tanlang
2. **Edit Subscription** tugmasini bosing
3. Quyidagilarni kiriting:

**Callback URL:**
```
https://your-domain.com/api/webhook/facebook
```

**Verify Token:** (ixtiyoriy, lekin xavfsizlik uchun yaxshi)
```
my_secure_verify_token_12345
```

`.env` fayliga qo'shing:
```env
FACEBOOK_VERIFY_TOKEN=my_secure_verify_token_12345
```

4. **leadgen** checkbox ni belgilang
5. **Verify and Save** tugmasini bosing

### C. Webhook ni test qilish

Terminal orqali test qiling:

```bash
curl -X GET "http://localhost:5000/api/webhook/facebook?hub.mode=subscribe&hub.verify_token=my_secure_verify_token_12345&hub.challenge=test_challenge"
```

Natija: `test_challenge` qaytishi kerak

---

## 4️⃣ Access Token olish

### A. Short-lived User Access Token

1. [Graph API Explorer](https://developers.facebook.com/tools/explorer/) ga o'ting
2. Yuqori o'ng burchakda **Meta App** ni tanlang
3. **Permissions** ni qo'shing:
   - `pages_manage_ads`
   - `leads_retrieval`
   - `pages_read_engagement`
   - `pages_show_list`
4. **Generate Access Token** tugmasini bosing
5. Token ni nusxalang

### B. Long-lived Page Access Token ga aylantirish

**1-qadam: User Token ni Long-lived ga aylantirish**

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=YOUR_APP_ID&client_secret=YOUR_APP_SECRET&fb_exchange_token=SHORT_LIVED_USER_TOKEN"
```

**2-qadam: Page ID ni olish**

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/me/accounts?access_token=LONG_LIVED_USER_TOKEN"
```

Response dan `page_id` va `access_token` ni nusxalang.

**3-qadam: Page Access Token ni saqlash**

`.env` fayliga qo'shing:
```env
FACEBOOK_ACCESS_TOKEN=your_long_lived_page_access_token
FACEBOOK_PAGE_ID=your_page_id
```

### C. Token ni tekshirish

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/debug_token?input_token=YOUR_PAGE_ACCESS_TOKEN&access_token=YOUR_APP_ACCESS_TOKEN"
```

---

## 5️⃣ Lead Form yaratish

### A. Facebook Ads Manager da

1. [facebook.com/adsmanager](https://www.facebook.com/adsmanager) ga o'ting
2. **Create** → **Ad** tugmasini bosing
3. **Lead Generation** maqsadini tanlang
4. **Instant Form** ni yaratish:
   - Form nomini kiriting: "Yuborish Xizmati - Lead Form"
   - Intro matnini yozing
   - Maydonlarni qo'shing:
     - Ism (Full name)
     - Telefon (Phone number)
     - Email
     - Shahar (City) - Custom field
     - Manzil (Address) - Custom field
5. Privacy Policy URL ni qo'shing
6. **Create Form** tugmasini bosing

### B. Form ID ni olish

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/YOUR_PAGE_ID/leadgen_forms?access_token=YOUR_PAGE_ACCESS_TOKEN"
```

Response dan `form_id` ni nusxalang.

---

## 6️⃣ Subscription ni sozlash

### A. Page ni Webhook ga subscribe qilish

```bash
curl -i -X POST "https://graph.facebook.com/v18.0/YOUR_PAGE_ID/subscribed_apps?subscribed_fields=leadgen&access_token=YOUR_PAGE_ACCESS_TOKEN"
```

### B. Subscription ni tekshirish

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/YOUR_PAGE_ID/subscribed_apps?access_token=YOUR_PAGE_ACCESS_TOKEN"
```

Response da `leadgen` bo'lishi kerak.

---

## 7️⃣ Test Lead yuborish

### A. Test tool orqali

1. [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) ga o'ting
2. Page va Form ni tanlang
3. Test lead ma'lumotlarini kiriting
4. **Create Lead** tugmasini bosing

### B. Server loglarini tekshirish

```bash
# Backend logs
tail -f logs/app.log

# PM2 orqali
pm2 logs yuboraman-backend

# Console.log orqali
# Konsolda "✅ Lead saved:" yozuvi ko'rinishi kerak
```

### C. Database da tekshirish

```bash
mongosh

use yuboraman
db.leads.find().pretty()
```

---

## 8️⃣ Production sozlamalar

### A. App ni Live rejimga o'tkazish

1. App dashboard → **Settings** → **Basic**
2. **App Mode** ni **Live** ga o'zgartiring
3. Barcha zarur ma'lumotlarni to'ldiring:
   - Privacy Policy URL
   - Terms of Service URL
   - Data Deletion Instructions URL
4. **Switch Mode** tugmasini bosing

### B. Permissions ni App Review dan o'tkazish

1. **App Review** → **Permissions and Features** ga o'ting
2. Quyidagilarni so'rang:
   - `pages_manage_ads`
   - `leads_retrieval`
3. Har biri uchun use case ni tushuntiring
4. Video va screenshot qo'shing
5. **Submit for Review** tugmasini bosing

**⏰ Review jarayoni:** 2-7 kun

### C. Webhook URL ni HTTPS ga o'zgartirish

Production da faqat HTTPS ishlaydi:

```env
WEBHOOK_URL=https://yourdomain.com/api/webhook/facebook
```

---

## 9️⃣ Monitoring va Debug

### A. Webhook loglarini ko'rish

1. App dashboard → **Webhooks** ga o'ting
2. **View Details** tugmasini bosing
3. So'nggi webhook eventlarini ko'ring

### B. Lead testlarini ko'rish

```bash
curl -i -X GET "https://graph.facebook.com/v18.0/FORM_ID?fields=leads&access_token=PAGE_ACCESS_TOKEN"
```

### C. Xatolarni debug qilish

**Webhook verification failed:**
- `FACEBOOK_VERIFY_TOKEN` to'g'riligini tekshiring
- Server ishga tushganligini tekshiring
- Callback URL to'g'riligini tekshiring

**Lead data kelmayapti:**
- Page subscription ni tekshiring
- Access Token amal qilish muddatini tekshiring
- `leadgen` event subscribe qilinganligini tekshiring

**Token expired:**
- Long-lived token oling (60 kun)
- Token ni har 60 kunda yangilang

---

## 🔟 Qo'shimcha maslahatlar

### A. Access Token ni avtomatik yangilash

```javascript
// server/utils/refreshToken.js
const cron = require('node-cron');
const axios = require('axios');

// Har 50 kunda token ni yangilash
cron.schedule('0 0 */50 * *', async () => {
  try {
    const response = await axios.get(
      `https://graph.facebook.com/v18.0/oauth/access_token`,
      {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: process.env.FACEBOOK_ACCESS_TOKEN
        }
      }
    );
    
    console.log('Token yangilandi:', response.data.access_token);
    // .env faylini yangilang yoki DB ga saqlang
  } catch (error) {
    console.error('Token yangilash xatosi:', error.message);
  }
});
```

### B. Rate limiting

Facebook API limit: 200 calls/hour

```javascript
// server/middleware/rateLimit.js
const rateLimit = require('express-rate-limit');

const fbApiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 soat
  max: 200
});

app.use('/api/facebook', fbApiLimiter);
```

### C. Webhook verification security

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = crypto
    .createHmac('sha256', process.env.FACEBOOK_APP_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

---

## ✅ Tekshirish ro'yxati

Deploy qilishdan oldin:

- [ ] `.env` fayldagi barcha ma'lumotlar to'g'ri
- [ ] MongoDB ishlamoqda
- [ ] Webhook URL HTTPS bilan ishlayapti
- [ ] Page subscription faol
- [ ] Test lead qabul qilindi
- [ ] Logs xatosiz
- [ ] External API ishlayapti
- [ ] SSL sertifikat o'rnatilgan
- [ ] Firewall sozlamalari to'g'ri

---

## 📞 Yordam

**Facebook Support:**
- https://developers.facebook.com/support/bugs/

**Qo'shimcha resurslar:**
- [Lead Ads API Documentation](https://developers.facebook.com/docs/marketing-api/guides/lead-ads/)
- [Webhooks Guide](https://developers.facebook.com/docs/graph-api/webhooks/)
- [Lead Ads Best Practices](https://www.facebook.com/business/help/leads-ads)

---

**Muvaffaqiyatli sozlash!** 🎉
