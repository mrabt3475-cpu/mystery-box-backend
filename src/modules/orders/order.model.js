import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    },
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'crypto', 'wallet', 'points'],
    default: 'wallet'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  },
  shippingAddress: {
    name: String,
    phone: String,
    address: String,
    city: String,
    country: String
  }
}, {
  timestamps: true
});

// Generate order number
orderSchema.pre('save', async function(next) {
  if (!this.orderNumber) {
    const date = new Date();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${random}`;
  }
  next();
});

export default mongoose.model('Order', orderSchema);
