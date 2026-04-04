// Database Indexes - Performance Optimization
// Add indexes to improve query performance

const mongoose = require('mongoose');
const User = require('../models/user.model');
const Box = require('../models/Box.model');
const Prize = require('../models/Prize.model');
const BoxOpening = require('../models/BoxOpening.model');
const Order = require('../models/Order.model');
const PointsTransaction = require('../models/pointsTransaction.model');
const GiftTransaction = require('../models/GiftTransaction.model');
const Product = require('../models/Product.model');
const Service = require('../models/Service.model');
const ApiKey = require('../models/ApiKey.model');

const createIndexes = async () => {
  console.log('🔧 Creating database indexes...');

  try {
    // User indexes
    await User.createIndexes(
      { username: 1 },
      { email: 1 },
      { referralCode: 1 },
      { role: 1 },
      { createdAt: -1 }
    );
    console.log('✅ User indexes created');

    // Box indexes
    await Box.createIndexes(
      { isActive: 1, order: 1 },
      { category: 1 }
    );
    console.log('✅ Box indexes created');


    // Prize indexes
    await Prize.createIndexes(
      { isActive: 1, rarity: 1 },
      { type: 1 }
    );
    console.log('✅ Prize indexes created');

    // BoxOpening indexes - CRITICAL for performance
    await BoxOpening.createIndexes(
      { user: 1, createdAt: -1 },
      { box: 1, createdAt: -1 },
      { prize: 1 }
    );
    console.log('✅ BoxOpening indexes created');

    // Order indexes
    await Order.createIndexes(
      { user: 1, createdAt: -1 },
      { status: 1, createdAt: -1 },
      { 'items.product': 1 }
    );
    console.log('✅ Order indexes created');

    // PointsTransaction indexes
    await PointsTransaction.createIndexes(
      { user: 1, createdAt: -1 },
      { type: 1 },
      { reference: 1, referenceType: 1 }
    );
    console.log('✅ PointsTransaction indexes created');

    // GiftTransaction indexes
    await GiftTransaction.createIndexes(
      { sender: 1, createdAt: -1 },
      { receiver: 1, createdAt: -1 },
      { status: 1 }
    );
    console.log('✅ GiftTransaction indexes created');

    // Product indexes
    await Product.createIndexes(
      { isActive: 1, category: 1, order: 1 },
      { name: 'text', description: 'text' }
    );
    console.log('✅ Product indexes created');

    // Service indexes
    await Service.createIndexes(
      { isActive: 1, serviceType: 1 },
      { owner: 1 },
      { members: 1 }
    );
    console.log('✅ Service indexes created');

    // ApiKey indexes
    await ApiKey.createIndexes(
      { user: 1, isActive: 1 },
      { prefix: 1 },
      { expiresAt: 1 }
    );
    console.log('✅ ApiKey indexes created');

    console.log('✅ All database indexes created successfully!');
  } catch (error) {
    console.error('❌ Error creating indexes:', error.message);
  }
};

module.exports = { createIndexes };