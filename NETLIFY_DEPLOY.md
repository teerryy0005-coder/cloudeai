# 🚀 Netlify + Railway Deploy Qo'llanmasi

Bu qo'llanma platformani **Netlify (Frontend)** va **Railway (Backend)** ga deploy qilish bo'yicha qadamma-qadam yo'riqnoma.

---

## 📋 Kerakli narsalar

- [x] GitHub account
- [x] Netlify account (bepul)
- [x] Railway account (bepul)
- [x] Facebook App credentials

---

## 🚂 QISM 1: Backend ni Railway ga deploy qilish

### 1. Railway account yaratish

1. https://railway.app ga o'ting
2. **Sign up with GitHub** tugmasini bosing
3. GitHub akkauntingiz bilan kirish

### 2. GitHub repository yaratish

```bash
# Local loyihangizdan
cd yuboraman-platform
git init
git add .
git commit -m "Initial commit"

# GitHub da yangi repository yarating va push qiling
git remote add origin https://github.com/YOUR_USERNAME/yuboraman-platform.git
git branch -M main
git push -u origin main
```

### 3. Railway da loyiha yaratish

1. Railway dashboard ga o'ting
2. **New Project** tugmasini bosing
3. **Deploy from GitHub repo** ni tanlang
4. `yuboraman-platform` repository ni tanlang

### 4. MongoDB qo'shish

1. Railway loyihangizda **+ New** tugmasini bosing
2. **Database** → **Add MongoDB** ni tanlang
3. MongoDB yaratilganidan keyin, **Variables** tabga o'ting
4. `MONGO_URL` yoki `MONGODB_URI` ni nusxalang

### 5. Environment Variables sozlash

Railway dashboard da **Variables** bo'limiga o'ting va quyidagilarni qo'shing:

```env
PORT=5000
NODE_ENV=production

# MongoDB (Railway avtomatik qo'shadi)
MONGODB_URI=${{MongoDB.MONGO_URL}}

# JWT Secret
JWT_SECRET=your-super-secret-production-jwt-key-min-32-characters

# Facebook Credentials
FACEBOOK_APP_ID=your_facebook_app_id_here
FACEBOOK_APP_SECRET=your_facebook_app_secret_here
FACEBOOK_ACCESS_TOKEN=your_long_lived_page_access_token
FACEBOOK_VERIFY_TOKEN=your_custom_verify_token_12345

# External API
EXTERNAL_API_URL=https://your-target-api.com/api/leads
EXTERNAL_API_KEY=your_external_api_key

# Webhook URL (Railway beradi)
WEBHOOK_URL=https://your-railway-app.up.railway.app/api/webhook/facebook

# Client URL (Netlify dan olasiz)
CLIENT_URL=https://your-netlify-site.netlify.app
```

### 6. Deploy qilish

1. Railway avtomatik deploy qiladi
2. **Deployments** tabda jarayonni kuzating
3. Muvaffaqiyatli deploy bo'lgandan keyin, **Settings** → **Domains** ga o'ting
4. **Generate Domain** tugmasini bosing
5. Railway URL ni nusxalang (masalan: `https://yuboraman-production.up.railway.app`)

### 7. Backend ni test qilish

```bash
# Health check
curl https://your-railway-app.up.railway.app/api/health
```

**Kutilgan natija:**
```json
{
  "success": true,
  "message": "Server ishlamoqda",
  "timestamp": "2026-06-11T..."
}
```

---

## 🌐 QISM 2: Frontend ni Netlify ga deploy qilish

### 1. Netlify account yaratish

1. https://www.netlify.com ga o'ting
2. **Sign up** → **GitHub** orqali kirish

### 2. Frontend environment sozlash

`client/.env.production` faylini yangilang:

```env
REACT_APP_API_URL=https://your-railway-app.up.railway.app/api
REACT_APP_SOCKET_URL=https://your-railway-app.up.railway.app
```

**Commit qiling:**
```bash
git add client/.env.production
git commit -m "Update production environment"
git push
```

### 3. Netlify da site yaratish

1. Netlify dashboard da **Add new site** tugmasini bosing
2. **Import an existing project** ni tanlang
3. **Deploy with GitHub** ni bosing
4. Repository tanlang: `yuboraman-platform`
5. Build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
   - **Branch:** `main`

### 4. Environment Variables qo'shish

**Site settings** → **Environment variables** ga o'ting:

```
REACT_APP_API_URL = https://your-railway-app.up.railway.app/api
REACT_APP_SOCKET_URL = https://your-railway-app.up.railway.app
```

### 5. Deploy qilish

1. **Deploy site** tugmasini bosing
2. Deploy jarayoni 2-5 daqiqa davom etadi
3. **Site overview** da site URL ni ko'rasiz (masalan: `https://yuboraman-xyz123.netlify.app`)

### 6. Custom domain qo'shish (ixtiyoriy)

1. **Domain settings** → **Add custom domain** ga o'ting
2. Domeningizni kiriting (masalan: `yuboraman.uz`)
3. DNS sozlamalarini qo'shing:

**A Record:**
```
Type: A
Name: @
Value: 75.2.60.5
```

**CNAME Record:**
```
Type: CNAME
Name: www
Value: yuboraman-xyz123.netlify.app
```

4. SSL sertifikat avtomatik o'rnatiladi

---

## 🔗 QISM 3: Frontend va Backend ni ulash

### 1. CORS sozlash

Railway backend da `server/server.js` faylida:

```javascript
// CORS middleware
app.use(cors({
  origin: [
    'https://your-netlify-site.netlify.app',
    'https://yourdomain.com', // Custom domain
    'http://localhost:3000' // Development
  ],
  credentials: true
}));
```

**Commit va push:**
```bash
git add server/server.js
git commit -m "Update CORS settings"
git push
```

Railway avtomatik redeploy qiladi.

### 2. Socket.IO sozlash

`client/src/services/socket.js`:

```javascript
const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || 'http://localhost:5000';

// Socket.IO CORS
const socket = io(SOCKET_URL, {
  transports: ['websocket', 'polling'],
  reconnection: true,
  withCredentials: true
});
```

### 3. Netlify redirects yangilash

`netlify.toml` faylida Railway URL ni yangilang:

```toml
[[redirects]]
  from = "/api/*"
  to = "https://your-actual-railway-url.up.railway.app/api/:splat"
  status = 200
  force = true

[[redirects]]
  from = "/socket.io/*"
  to = "https://your-actual-railway-url.up.railway.app/socket.io/:splat"
  status = 200
  force = true
```

**Commit va push:**
```bash
git add netlify.toml
git commit -m "Update API proxy"
git push
```

---

## 📱 QISM 4: Facebook Webhook yangilash

### 1. Railway URL ni Facebook ga qo'shish

1. [Facebook Developers](https://developers.facebook.com) ga o'ting
2. **Webhooks** → **Edit Subscription** tugmasini bosing
3. **Callback URL** ni yangilang:

```
https://your-railway-app.up.railway.app/api/webhook/facebook
```

4. **Verify Token** ni kiriting (`.env` dagi `FACEBOOK_VERIFY_TOKEN`)
5. **Verify and Save** tugmasini bosing

### 2. Webhook ni test qilish

```bash
curl -X GET "https://your-railway-app.up.railway.app/api/webhook/facebook?hub.mode=subscribe&hub.verify_token=your_verify_token&hub.challenge=test"
```

**Kutilgan natija:** `test`

### 3. Test lead yuborish

1. [Lead Ads Testing Tool](https://developers.facebook.com/tools/lead-ads-testing) ga o'ting
2. Page va Form ni tanlang
3. Test lead yarating
4. Netlify dashboard da leadni ko'rishingiz kerak

---

## ✅ Tekshirish ro'yxati

### Backend (Railway)
- [ ] Backend deploy bo'ldi
- [ ] MongoDB ulanishi ishlayapti
- [ ] `/api/health` endpoint ishlayapti
- [ ] Environment variables to'g'ri sozlangan
- [ ] Webhook URL Facebook ga qo'shildi
- [ ] Test lead qabul qilindi

### Frontend (Netlify)
- [ ] Frontend deploy bo'ldi
- [ ] Site ochilmoqda
- [ ] Login sahifasi ishlayapti
- [ ] Dashboard ma'lumotlarni ko'rsatyapti
- [ ] API requests ishlayapti
- [ ] Socket.IO real-time ishlayapti

### Integration
- [ ] Facebook Lead Ads ishlayapti
- [ ] Leadlar dashboardda ko'rinmoqda
- [ ] Tashqi API ga yuborilmoqda
- [ ] Real-time notifications ishlayapti

---

## 🔄 Yangilanishlar (Updates)

### Frontend yangilanishi

```bash
# Code o'zgarishlar
cd client
# ... code changes ...

# Commit va push
git add .
git commit -m "Update frontend"
git push
```

Netlify avtomatik deploy qiladi.

### Backend yangilanishi

```bash
# Code o'zgarishlar
cd server
# ... code changes ...

# Commit va push
git add .
git commit -m "Update backend"
git push
```

Railway avtomatik deploy qiladi.

---

## 🆘 Troubleshooting

### "API connection failed"

**Sabab:** CORS yoki URL noto'g'ri

**Yechim:**
1. Railway backend URL to'g'riligini tekshiring
2. Netlify environment variables ni tekshiring
3. CORS sozlamalarini tekshiring
4. Browser console da xatolarni ko'ring

### "Webhook verification failed"

**Sabab:** Verify token mos kelmayapti

**Yechim:**
1. Railway environment variables da `FACEBOOK_VERIFY_TOKEN` ni tekshiring
2. Facebook Webhooks sozlamalarida verify token ni tekshiring
3. Railway logs ni ko'ring: Railway dashboard → **Deployments** → **View logs**

### "Database connection error"

**Sabab:** MongoDB ulanishi yo'q

**Yechim:**
1. Railway MongoDB service ishga tushganligini tekshiring
2. `MONGODB_URI` environment variable to'g'riligini tekshiring
3. Railway logs ni ko'ring

### "Build failed on Netlify"

**Sabab:** Dependencies yoki build command xato

**Yechim:**
1. **Deploys** → **Deploy log** ni o'qing
2. `client/package.json` da dependencies tekshiring
3. Build command: `npm run build`
4. Publish directory: `build`

---

## 📊 Monitoring

### Railway Monitoring

1. Railway dashboard → **Metrics** tabga o'ting
2. CPU, Memory, Network usage ni kuzating
3. **Logs** tabda real-time logs ni ko'ring

### Netlify Monitoring

1. Netlify dashboard → **Analytics** tabga o'ting
2. Visitors, pageviews, bandwidth ni kuzating
3. **Deploy notifications** yoqing (Slack, Email)

---

## 💰 Narxlar (Free Tier Limits)

### Railway Free Plan
- **$5/month kredit** (500 soat)
- 512 MB RAM
- 1 GB storage
- Shared CPU

**Etarli:** ~10,000 lead/oy uchun

### Netlify Free Plan
- **100 GB bandwidth/oy**
- Unlimited sites
- Automatic HTTPS
- Deploy previews

**Etarli:** ~50,000 sahifa ko'rish/oy

### Upgrade qachon kerak?

Railway Pro ($20/mo):
- Traffic oshganda
- Ko'proq RAM kerak bo'lganda
- 24/7 ishlashi kerak bo'lganda

Netlify Pro ($19/mo):
- 100 GB dan ko'p traffic
- Advanced analytics
- Background functions

---

## 🎉 Tugallandi!

Sizning platformangiz endi jonli:

- **Frontend:** https://your-netlify-site.netlify.app
- **Backend:** https://your-railway-app.up.railway.app
- **Facebook Webhooks:** Ishlayapti ✅
- **Real-time updates:** Ishlayapti ✅

### Keyingi qadamlar:

1. Custom domain qo'shing
2. Google Analytics qo'shing
3. Error monitoring sozlang (Sentry)
4. Backup strategiyasini sozlang
5. Marketing boshlang! 🚀

---

**Savollar?**
- Email: support@yuboraman.uz
- GitHub Issues: https://github.com/your-username/yuboraman-platform/issues
