#!/usr/bin/env node
/**
 * Database Seeding Script
 * Seeds initial data including admin user
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Integration = require('../models/Integration');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/yuboraman';

// Admin user data
const adminData = {
  name: 'Admin',
  email: process.env.ADMIN_EMAIL || 'teerryy0005@gmail.com',
  password: process.env.ADMIN_PASSWORD || '250502@Xz',
  role: 'admin',
  isActive: true
};

// Sample integrations
const integrationsData = [
  {
    name: 'Facebook Lead Ads',
    type: 'facebook',
    status: 'inactive',
    statistics: {
      totalLeads: 0,
      successfulLeads: 0,
      failedLeads: 0
    }
  }
];

async function seedDatabase() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Seed Admin User
    console.log('👤 Seeding Admin User...');
    const existingUser = await User.findOne({ email: adminData.email });
    
    if (existingUser) {
      console.log('⚠️  Admin user already exists');
      console.log('Updating password...');
      existingUser.password = await bcrypt.hash(adminData.password, 10);
      await existingUser.save();
      console.log('✅ Admin password updated');
    } else {
      const hashedPassword = await bcrypt.hash(adminData.password, 10);
      await User.create({
        ...adminData,
        password: hashedPassword
      });
      console.log('✅ Admin user created');
    }

    // Seed Integrations
    console.log('\n🔗 Seeding Integrations...');
    for (const integration of integrationsData) {
      const existing = await Integration.findOne({ type: integration.type });
      if (!existing) {
        await Integration.create(integration);
        console.log(`✅ Created integration: ${integration.name}`);
      } else {
        console.log(`⚠️  Integration already exists: ${integration.name}`);
      }
    }

    console.log('\n✅ Database seeding completed!\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 Admin Login Credentials:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`Email:    ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🌐 Login URL: https://profound-brigadeiros-873db7.netlify.app/login');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  seedDatabase();
}

module.exports = seedDatabase;
