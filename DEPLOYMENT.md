# 🚀 Deployment Guide - Yuboraman Platform

Bu qo'llanma platformani turli xil hosting provayderlarida deploy qilish bo'yicha batafsil ko'rsatmalar beradi.

## 📋 Ro'yxat

- [VPS/Dedicated Server](#vps-deploy)
- [Railway](#railway-deploy)
- [Heroku](#heroku-deploy)
- [Vercel + Railway](#vercel-railway)
- [Docker](#docker-deploy)
- [Post-deployment checklist](#checklist)

---

## 🖥️ VPS/Dedicated Server Deploy {#vps-deploy}

Ubuntu 22.04 LTS uchun

### 1. Server tayyorlash

```bash
# Server yangilanishlari
sudo apt update && sudo apt upgrade -y

# Node.js o'rnatish (v18)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# MongoDB o'rnatish
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
sudo apt-get update
sudo apt-get install -y mongodb-org

# MongoDB ni ishga tushirish
sudo systemctl start mongod
sudo systemctl enable mongod

# Nginx o'rnatish
sudo apt install nginx -y

# PM2 o'rnatish (process manager)
sudo npm install -g pm2

# Git o'rnatish
sudo apt install git -y
```

### 2. Loyihani klonlash

```bash
cd /var/www
sudo git clone https://github.com/your-username/yuboraman-platform.git
cd yuboraman-platform

# Permissions
sudo chown -R $USER:$USER /var/www/yuboraman-platform
```

### 3. Dependencies o'rnatish

```bash
# Backend
npm install

# Frontend
cd client
npm install
npm run build
cd ..
```

### 4. Environment sozlash

```bash
# .env faylini yaratish
nano .env
```

```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/yuboraman
JWT_SECRET=your-production-jwt-secret-here-change-this
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
FACEBOOK_ACCESS_TOKEN=your_page_access_token
FACEBOOK_VERIFY_TOKEN=your_verify_token
EXTERNAL_API_URL=https://target-api.com/api/leads
EXTERNAL_API_KEY=your_api_key
WEBHOOK_URL=https://yourdomain.com/api/webhook/facebook
CLIENT_URL=https://yourdomain.com
```

### 5. PM2 bilan ishga tushirish

```bash
# Backend serverni ishga tushirish
pm2 start server/server.js --name yuboraman-backend

# Avtomatik qayta ishga tushirish
pm2 startup
pm2 save

# Logs ko'rish
pm2 logs yuboraman-backend

# Status
pm2 status
```

### 6. Nginx konfiguratsiyasi

```bash
sudo nano /etc/nginx/sites-available/yuboraman
```

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Frontend static files
    location / {
        root /var/www/yuboraman-platform/client/build;
        try_files $uri $uri/ /index.html;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Socket.IO
    location /socket.io {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
    }
}
```

```bash
# Konfiguratsiyani faollashtirish
sudo ln -s /etc/nginx/sites-available/yuboraman /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 7. SSL sertifikat (Let's Encrypt)

```bash
# Certbot o'rnatish
sudo apt install certbot python3-certbot-nginx -y

# SSL sertifikat olish
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Avtomatik yangilanish
sudo certbot renew --dry-run
```

### 8. Firewall sozlash

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow 22
sudo ufw enable
```

---

## 🚂 Railway Deploy {#railway-deploy}

Railway - eng oson va tez deploy usuli.

### 1. Railway account yaratish

1. https://railway.app ga o'ting
2. GitHub orqali kirish

### 2. Yangi loyiha yaratish

```bash
# Railway CLI o'rnatish
npm install -g railway

# Login
railway login

# Loyihani yaratish
railway init
```

### 3. MongoDB qo'shish

1. Railway dashboard ga o'ting
2. **+ New** → **Database** → **MongoDB** ni tanlang
3. Connection string ni nusxalang

### 4. Environment variables sozlash

Railway dashboard da **Variables** bo'limiga o'ting:

```
PORT=5000
NODE_ENV=production
MONGODB_URI=<railway_mongodb_connection_string>
JWT_SECRET=your_jwt_secret
FACEBOOK_APP_ID=your_app_id
FACEBOOK_APP_SECRET=your_app_secret
FACEBOOK_ACCESS_TOKEN=your_token
FACEBOOK_VERIFY_TOKEN=your_verify_token
EXTERNAL_API_URL=https://target-api.com/api/leads
EXTERNAL_API_KEY=your_api_key
```

### 5. Deploy qilish

```bash
# Git orqali
git push origin main

# Railway CLI orqali
railway up
```

### 6. Custom domain qo'shish

1. **Settings** → **Domains** ga o'ting
2. **Generate Domain** yoki **Custom Domain** qo'shing
3. DNS record qo'shing:
   - Type: `CNAME`
   - Name: `@` yoki `www`
   - Value: Railway bergan domain

---

## 💜 Heroku Deploy {#heroku-deploy}

### 1. Heroku CLI o'rnatish

```bash
# Ubuntu/Debian
curl https://cli-assets.heroku.com/install.sh | sh

# macOS
brew tap heroku/brew && brew install heroku
```

### 2. Login va app yaratish

```bash
heroku login
heroku create yuboraman-platform
```

### 3. MongoDB add-on qo'shish

```bash
heroku addons:create mongolab:sandbox -a yuboraman-platform
```

### 4. Environment variables

```bash
heroku config:set NODE_ENV=production -a yuboraman-platform
heroku config:set JWT_SECRET=your_secret -a yuboraman-platform
heroku config:set FACEBOOK_APP_ID=your_app_id -a yuboraman-platform
heroku config:set FACEBOOK_APP_SECRET=your_secret -a yuboraman-platform
heroku config:set FACEBOOK_ACCESS_TOKEN=your_token -a yuboraman-platform
heroku config:set FACEBOOK_VERIFY_TOKEN=your_verify -a yuboraman-platform
heroku config:set EXTERNAL_API_URL=your_api_url -a yuboraman-platform
heroku config:set EXTERNAL_API_KEY=your_api_key -a yuboraman-platform
```

### 5. Procfile yaratish

```bash
echo "web: node server/server.js" > Procfile
```

### 6. Deploy qilish

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

---

## ▲ Vercel + Railway (Hybrid) {#vercel-railway}

Frontend Vercel da, Backend Railway da.

### Frontend (Vercel)

```bash
cd client

# Vercel CLI o'rnatish
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

`.env.production` yaratish:
```env
REACT_APP_API_URL=https://your-railway-backend.up.railway.app/api
REACT_APP_SOCKET_URL=https://your-railway-backend.up.railway.app
```

### Backend (Railway)

Yuqoridagi Railway Deploy qo'llanmasini kuzating.

---

## 🐳 Docker Deploy {#docker-deploy}

### 1. Dockerfile yaratish

**Backend Dockerfile:**
```dockerfile
# /Dockerfile
FROM node:18-alpine

WORKDIR /app

# Dependencies
COPY package*.json ./
RUN npm install --production

# Application code
COPY server ./server
COPY .env ./

EXPOSE 5000

CMD ["node", "server/server.js"]
```

**Frontend Dockerfile:**
```dockerfile
# /client/Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  mongodb:
    image: mongo:6.0
    container_name: yuboraman-mongo
    restart: always
    volumes:
      - mongo-data:/data/db
    ports:
      - "27017:27017"

  backend:
    build: .
    container_name: yuboraman-backend
    restart: always
    ports:
      - "5000:5000"
    environment:
      - MONGODB_URI=mongodb://mongodb:27017/yuboraman
      - NODE_ENV=production
    env_file:
      - .env
    depends_on:
      - mongodb

  frontend:
    build: ./client
    container_name: yuboraman-frontend
    restart: always
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  mongo-data:
```

### 3. Ishga tushirish

```bash
# Build va start
docker-compose up -d

# Logs
docker-compose logs -f

# Stop
docker-compose down
```

---

## ✅ Post-Deployment Checklist {#checklist}

### Texnik tekshiruvlar

- [ ] Backend server ishlamoqda (https://yourdomain.com/api/health)
- [ ] Frontend ochilmoqda (https://yourdomain.com)
- [ ] MongoDB ulanishi ishlayapti
- [ ] Socket.IO real-time ishlayapti
- [ ] SSL sertifikat o'rnatilgan
- [ ] HTTPS redirect faol
- [ ] Firewall to'g'ri sozlangan

### Facebook sozlamalari

- [ ] Facebook App Live rejimda
- [ ] Webhook URL yangilandi (HTTPS)
- [ ] Webhook verification o'tdi
- [ ] Page subscription faol
- [ ] Access Token amal qilmoqda
- [ ] Test lead yuborildi va qabul qilindi

### Xavfsizlik

- [ ] `.env` faylidagi secretlar o'zgartirilgan
- [ ] JWT_SECRET production uchun
- [ ] Database parol kuchli
- [ ] CORS to'g'ri sozlangan
- [ ] Rate limiting yoqilgan
- [ ] Logs monitoring o'rnatilgan

### Monitoring

- [ ] PM2/Process manager ishlayapti
- [ ] Error logging sozlangan
- [ ] Uptime monitoring (UptimeRobot)
- [ ] Performance monitoring
- [ ] Backup strategiyasi

### Tashqi integratsiyalar

- [ ] External API URL to'g'ri
- [ ] API key ishlayapti
- [ ] Test lead tashqi API ga yuborildi
- [ ] Error handling ishlayapti

---

## 📊 Monitoring va Maintenance

### Uptime Monitoring

**UptimeRobot** (Free):
1. https://uptimerobot.com ga o'ting
2. **Add New Monitor** tugmasini bosing
3. URL: `https://yourdomain.com/api/health`
4. Check interval: 5 minut

### Log Management

```bash
# PM2 logs
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7

# Manual log viewing
pm2 logs yuboraman-backend --lines 100
```

### Database Backup

```bash
# Backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --db yuboraman --out /backups/yuboraman_$DATE
tar -czf /backups/yuboraman_$DATE.tar.gz /backups/yuboraman_$DATE
rm -rf /backups/yuboraman_$DATE

# Cron job (har kuni soat 2 da)
0 2 * * * /path/to/backup.sh
```

### Updates

```bash
# Code yangilanishlari
cd /var/www/yuboraman-platform
git pull origin main
npm install
cd client && npm install && npm run build && cd ..
pm2 restart yuboraman-backend
```

---

## 🆘 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# MongoDB statusini tekshirish
sudo systemctl status mongod

# Qayta ishga tushirish
sudo systemctl restart mongod

# Logs
sudo tail -f /var/log/mongodb/mongod.log
```

### "Webhook verification failed"
- Verify token to'g'riligini tekshiring
- Server ishga tushganligini tekshiring
- HTTPS ishlayotganligini tekshiring

### "502 Bad Gateway"
```bash
# Backend ishlaganligini tekshirish
pm2 status
pm2 logs yuboraman-backend

# Nginx restart
sudo systemctl restart nginx
```

### "SSL certificate error"
```bash
# Sertifikatni yangilash
sudo certbot renew
sudo systemctl restart nginx
```

---

**Muvaffaqiyatli deploy!** 🎉

Qo'shimcha yordam: support@yuboraman.uz
