# 🚀 Yuboraman Platform - Lead Management System

Yuboraman.uz ga o'xshash **Facebook Lead Ads integratsiyasi** bilan to'liq ishlaydigan Lead Management platformasi.

## 📋 Xususiyatlari

- ✅ **Facebook Lead Ads integratsiyasi** - Avtomatik lead qabul qilish
- ✅ **Real-time Dashboard** - Jonli statistika va grafiklar
- ✅ **Tashqi API integratsiyasi** - Leadlarni avtomatik yuborish
- ✅ **Lead Management** - Status boshqaruvi va filtrlar
- ✅ **WebSocket** - Real-time yangilanishlar
- ✅ **Modern UI** - Yuboraman.uz dizayni asosida
- ✅ **Authentication** - JWT bilan xavfsiz kirish

## 🛠️ Texnologiyalar

### Backend
- **Node.js** + Express.js
- **MongoDB** - Ma'lumotlar bazasi
- **Socket.IO** - Real-time kommunikatsiya
- **JWT** - Authentication
- **Facebook Graph API** - Lead Ads integratsiyasi

### Frontend
- **React 18**
- **React Router** - Navigatsiya
- **Zustand** - State management
- **Recharts** - Grafiklar
- **Axios** - API requests
- **Socket.IO Client** - Real-time updates

## 📦 O'rnatish

### 1. Repository ni klonlash

```bash
git clone <repository-url>
cd yuboraman-platform
```

### 2. Dependencies o'rnatish

```bash
# Backend dependencies
npm install

# Frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment sozlash

`.env` faylini yarating va quyidagilarni kiriting:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/yuboraman

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Facebook App Configuration
FACEBOOK_APP_ID=your-facebook-app-id
FACEBOOK_APP_SECRET=your-facebook-app-secret
FACEBOOK_ACCESS_TOKEN=your-facebook-page-access-token
FACEBOOK_VERIFY_TOKEN=your-custom-verify-token

# External API Configuration
EXTERNAL_API_URL=https://your-target-api.com/api/leads
EXTERNAL_API_KEY=your-api-key-here

# Webhook URL
WEBHOOK_URL=https://your-domain.com/api/webhook/facebook
```

### 4. MongoDB o'rnatish

**MongoDB ni o'rnatish:**

```bash
# Ubuntu/Debian
sudo apt-get install mongodb

# macOS (Homebrew)
brew install mongodb-community

# MongoDB ni ishga tushirish
mongod
```

Yoki **MongoDB Atlas** (cloud) dan foydalaning: https://www.mongodb.com/cloud/atlas

## 🚀 Ishga tushirish

### Development rejimida

```bash
# Terminal 1: Backend serverni ishga tushirish
npm run server

# Terminal 2: Frontend ni ishga tushirish
cd client
npm start
```

Yoki **birgalikda**:

```bash
npm run dev
```

- **Backend:** http://localhost:5000
- **Frontend:** http://localhost:3000

## 🔧 Facebook Lead Ads sozlash

### 1. Facebook App yaratish

1. [Facebook Developers](https://developers.facebook.com/) ga kiring
2. **Create App** tugmasini bosing
3. **Business** tipini tanlang
4. App nomini kiriting

### 2. Lead Ads API ni yoqish

1. App dashboardga o'ting
2. **Add Product** → **Webhooks** ni tanlang
3. **Page** subscription ni tanlang
4. **leadgen** event ni subscribe qiling

### 3. Webhook ni sozlash

1. **Callback URL:** `https://your-domain.com/api/webhook/facebook`
2. **Verify Token:** `.env` fayldagi `FACEBOOK_VERIFY_TOKEN`
3. **Subscribe to:** `leadgen` event

### 4. Access Token olish

1. **Graph API Explorer** ga o'ting: https://developers.facebook.com/tools/explorer/
2. **User Token** ni **Page Access Token** ga aylantiring
3. Quyidagi permissions kerak:
   - `pages_manage_ads`
   - `leads_retrieval`
   - `pages_read_engagement`
4. Token ni `.env` fayliga qo'shing

### 5. Webhook ni test qilish

```bash
curl -X POST "https://your-domain.com/api/webhook/facebook" \
  -H "Content-Type: application/json" \
  -d '{
    "object": "page",
    "entry": [{
      "changes": [{
        "field": "leadgen",
        "value": {
          "leadgen_id": "test_lead_id",
          "form_id": "test_form_id",
          "page_id": "test_page_id"
        }
      }]
    }]
  }'
```

## 🌐 Tashqi API integratsiyasi

Leadlar avtomatik ravishda `.env` fayldagi `EXTERNAL_API_URL` ga yuboriladi.

### API Request formati:

```json
POST https://your-api.com/api/leads
Headers:
  Content-Type: application/json
  Authorization: Bearer YOUR_API_KEY

Body:
{
  "name": "Ism Familiya",
  "email": "email@example.com",
  "phone": "+998901234567",
  "address": "Manzil",
  "city": "Shahar",
  "source": "facebook_lead_ads",
  "leadId": "facebook_lead_id",
  "customFields": {
    "field1": "value1"
  }
}
```

## 👤 Foydalanuvchi yaratish

```bash
# MongoDB shell orqali
mongosh

use yuboraman

db.users.insertOne({
  name: "Admin",
  email: "admin@yuboraman.uz",
  password: "$2a$10$...", // bcrypt hash
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

Yoki API orqali:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@yuboraman.uz",
    "password": "securepassword",
    "role": "admin"
  }'
```

## 📱 API Endpoints

### Authentication
- `POST /api/auth/register` - Ro'yxatdan o'tish
- `POST /api/auth/login` - Kirish
- `GET /api/auth/me` - Hozirgi foydalanuvchi

### Leads
- `GET /api/leads` - Barcha leadlar
- `GET /api/leads/:id` - Bitta lead
- `PUT /api/leads/:id/status` - Lead statusini o'zgartirish
- `GET /api/leads/statistics` - Statistika
- `GET /api/leads/activities` - So'nggi faoliyat

### Integrations
- `GET /api/integrations` - Barcha integratsiyalar
- `GET /api/integrations/:id` - Bitta integratsiya
- `POST /api/integrations` - Integratsiya yaratish
- `PUT /api/integrations/:id` - Integratsiyani yangilash
- `DELETE /api/integrations/:id` - Integratsiyani o'chirish
- `POST /api/integrations/:id/test` - Integratsiyani test qilish

### Webhooks
- `GET /api/webhook/facebook` - Facebook webhook verification
- `POST /api/webhook/facebook` - Facebook lead qabul qilish

## 🚀 Production Deploy

### 1. VPS/Server ga deploy

```bash
# Server ga kirish
ssh user@your-server.com

# Repository ni klonlash
git clone <repository-url>
cd yuboraman-platform

# Dependencies o'rnatish
npm install
cd client && npm install && npm run build && cd ..

# PM2 bilan ishga tushirish
npm install -g pm2
pm2 start server/server.js --name yuboraman-backend
pm2 startup
pm2 save
```

### 2. Nginx konfiguratsiyasi

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3. SSL sertifikat (Let's Encrypt)

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

### 4. Vercel/Railway ga deploy (Alternative)

**Vercel (Frontend):**
```bash
cd client
npm install -g vercel
vercel
```

**Railway (Backend):**
1. https://railway.app ga o'ting
2. GitHub repo ni ulang
3. Environment variables ni qo'shing
4. Deploy qiling

## 🔒 Xavfsizlik

- JWT token 30 kun amal qiladi
- Parollar bcrypt bilan hash qilingan
- CORS sozlangan
- Environment variables `.env` faylida
- `.gitignore` ga `.env` qo'shilgan

## 📊 Monitoring

Socket.IO orqali real-time monitoring:

```javascript
// Client-side
socket.on('newLead', (lead) => {
  console.log('Yangi lead:', lead);
});

socket.on('leadUpdated', (lead) => {
  console.log('Lead yangilandi:', lead);
});
```

## 🐛 Debug

```bash
# Backend logs
pm2 logs yuboraman-backend

# MongoDB logs
tail -f /var/log/mongodb/mongod.log

# Test webhook
npm run test:webhook
```

## 📞 Yordam

Savollar yoki muammolar bo'lsa:
- Email: support@yuboraman.uz
- Telegram: @yuboraman_support

## 📝 License

MIT License

---

**Yaratilgan:** 2026
**Versiya:** 1.0.0
**Mualliflar:** Yuboraman Development Team
