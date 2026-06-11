#!/usr/bin/env node
/**
 * Admin User Creation Script
 * Creates initial admin user for Yuboraman Platform
 */

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
require('dotenv').config();

// User Model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'operator', 'viewer'], default: 'operator' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

// Admin credentials
const ADMIN_USER = {
  name: 'Admin',
  email: 'teerryy0005@gmail.com',
  password: '250502@Xz',
  role: 'admin',
  isActive: true
};

async function createAdminUser() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yuboraman';
    await mongoose.connect(MONGODB_URI);
    
    console.log('✅ Connected to MongoDB');
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: ADMIN_USER.email });
    
    if (existingUser) {
      console.log('⚠️  User already exists:', ADMIN_USER.email);
      console.log('Updating password...');
      
      // Hash new password
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      
      console.log('✅ Password updated successfully!');
    } else {
      console.log('🔄 Creating admin user...');
      
      // Hash password
      const hashedPassword = await bcrypt.hash(ADMIN_USER.password, 10);
      
      // Create user
      const newUser = new User({
        name: ADMIN_USER.name,
        email: ADMIN_USER.email,
        password: hashedPassword,
        role: ADMIN_USER.role,
        isActive: ADMIN_USER.isActive
      });
      
      await newUser.save();
      
      console.log('✅ Admin user created successfully!');
    }
    
    console.log('\n📧 Login Credentials:');
    console.log('Email:', ADMIN_USER.email);
    console.log('Password:', ADMIN_USER.password);
    console.log('\n🌐 Login URL: https://profound-brigadeiros-873db7.netlify.app/login');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Done!');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  createAdminUser();
}

module.exports = createAdminUser;
