require('dotenv').config();
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const connectDB = require('./config/database');

// Initialize express app
const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Make io accessible globally
global.io = io;

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Socket.IO connection
io.on('connection', (socket) => {
  console.log('✅ New client connected:', socket.id);
  
  socket.on('disconnect', () => {
    console.log('❌ Client disconnected:', socket.id);
  });
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/leads', require('./routes/leads'));
app.use('/api/integrations', require('./routes/integrations'));
app.use('/api/webhook', require('./routes/webhook'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server ishlamoqda',
    timestamp: new Date()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route topilmadi'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || 'Server xatosi'
  });
});

// Auto-create admin user on first run
const createAdminOnStartup = async () => {
  try {
    const User = require('./models/User');
    const bcrypt = require('bcryptjs');
    
    const adminEmail = process.env.ADMIN_EMAIL || 'teerryy0005@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '250502@Xz';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created automatically');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    }
  } catch (error) {
    console.log('⚠️  Note: Admin user creation skipped (will be created after DB connection)');
  }
};

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`
╔═══════════════════════════════════════╗
║   🚀 Yuboraman Platform Server       ║
║   📡 Port: ${PORT}                   ║
║   🌍 Environment: ${process.env.NODE_ENV || 'development'}        ║
║   ✅ Status: Running                 ║
╚═══════════════════════════════════════╝
  `);
  
  // Wait a bit for DB connection, then create admin
  setTimeout(createAdminOnStartup, 2000);
});

module.exports = { app, server, io };
