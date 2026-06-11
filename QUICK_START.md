# ⚡ Tezkor Boshlash - 10 Daqiqada Deploy

Bu qo'llanma platformani **10 daqiqada** deploy qilish uchun eng qisqa yo'l.

---

## 📋 Kerakli narsalar

- GitHub account
- Railway account (bepul): https://railway.app
- Netlify account (bepul): https://www.netlify.com

---

## 🚀 3 Ta Oddiy Qadam

### QADAM 1: GitHub ga Push (2 daqiqa)

```bash
# Loyihani oching
cd yuboraman-platform

# Git initialize
git init
git add .
git commit -m "Initial commit"

# GitHub da yangi repo yarating va push qiling
git remote add origin https://github.com/YOUR_USERNAME/yuboraman-platform.git
git push -u origin main
```

---

### QADAM 2: Backend ni Railway ga Deploy (3 daqiqa)

1. **Railway ga o'ting:** https://railway.app
2. **Sign up with GitHub** tugmasini bosing
3. **New Project** → **Deploy from GitHub repo**
4. Repository tanlang: `yuboraman-platform`
5. **+ New** → **Database** → **Add MongoDB**
6. **Variables** ga o'ting va quyidagilarni qo'shing:

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=${{MongoDB.MONGO_URL}}
JWT_SECRET=my-super-secret-jwt-key-change-this-please
FACEBOOK_VERIFY_TOKEN=my_verify_token_12345
```

7. **Settings** → **Domains** → **Generate Domain**
8. Railway URL ni nusxalang: `https://your-app.up.railway.app`

---

### QADAM 3: Frontend ni Netlify ga Deploy (5 daqiqa)

1. **Netlify ga o'ting:** https://www.netlify.com
2. **Sign up with GitHub** tugmasini bosing
3. **Add new site** → **Import an existing project**
4. **Deploy with GitHub** → Repository tanlang
5. Build settings:
   - **Base directory:** `client`
   - **Build command:** `npm run build`
   - **Publish directory:** `client/build`
6. **Environment variables** qo'shing:

```
REACT_APP_API_URL = https://your-railway-app.up.railway.app/api
REACT_APP_SOCKET_URL = https://your-railway-app.up.railway.app
```

7. **Deploy site** tugmasini bosing
8. 2-3 daqiqa kuting...
9. ✅ **TAYYOR!** Site URL: `https://your-site.netlify.app`

---

## ✅ Tekshirish

### Backend Test:
```bash
curl https://your-railway-app.up.railway.app/api/health
```

**Kutilgan:** `{"success":true,"message":"Server ishlamoqda"}`

### Frontend Test:
1. Browser da oching: `https://your-site.netlify.app`
2. Login sahifasini ko'rishingiz kerak
3. Test credentials:
   - **Email:** `admin@test.com`
   - **Password:** `admin123`

(Birinchi foydalanuvchini MongoDB orqali yaratish kerak - quyida ko'rsatilgan)

---

## 👤 Birinchi Foydalanuvchi Yaratish

### Railway MongoDB Shell orqali:

1. Railway dashboard → **MongoDB** → **Connect** → **MongoDB Shell**
2. Quyidagi kodni nusxalab joylashtiring:

```javascript
use yuboraman

db.users.insertOne({
  name: "Admin",
  email: "admin@test.com",
  password: "$2a$10$rJ4KQYBqH4W6Y7PYQPQPWe5K5.5K5K5K5K5K5K5K5K5K5K5K5K5",
  role: "admin",
  isActive: true,
  createdAt: new Date()
})
```

**Yoki** backend API orqali:

```bash
curl -X POST https://your-railway-app.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@test.com",
    "password": "admin123",
    "role": "admin"
  }'
```

---

## 📱 Facebook Sozlash (Keyinroq)

Facebook integratsiyasini sozlash uchun batafsil qo'llanma:
- **FACEBOOK_SETUP.md** faylini o'qing

---

## 🎉 Tayyor!

Sizning platformangiz endi ishlayapti:

- **Frontend:** https://your-site.netlify.app
- **Backend:** https://your-railway-app.up.railway.app
- **API Docs:** https://your-railway-app.up.railway.app/api/health

---

## 🆘 Muammo bo'lsa?

**Frontend ochilmayapti:**
- Netlify deploy log ni tekshiring
- Build command to'g'riligini tekshiring

**Backend ishlamayapti:**
- Railway logs ni tekshiring: Dashboard → Deployments → View logs
- Environment variables to'g'riligini tekshiring

**Login ishlamayapti:**
- Birinchi foydalanuvchi yaratilganligini tekshiring
- API URL to'g'riligini tekshiring (browser console)

---

## 📚 Qo'shimcha Qo'llanmalar

- **README.md** - To'liq dokumentatsiya
- **FACEBOOK_SETUP.md** - Facebook Lead Ads sozlash
- **DEPLOYMENT.md** - Batafsil deploy qo'llanmasi
- **NETLIFY_DEPLOY.md** - Netlify + Railway qo'llanmasi
- **EXTERNAL_API.md** - Tashqi API integratsiyasi

---

**Muvaffaqiyatlar!** 🚀
