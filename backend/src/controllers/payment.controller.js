// Payment Controller - SECURE VERSION
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const config = require('../../config/env');
const crypto = require('crypto');

// @desc    Create Stripe checkout session
// @route   POST /api/v1/payment/stripe/checkout
// @access  Private
const createStripeCheckout = asyncHandler(async (req, res, next) => {
  const { orderId } = req.body;

  const order = await Order.findById(orderId);
  if (!order) {
    return next(new AppError('Order not found', 404));
  }

  if (order.user.toString() !== req.user.id) {
    return next(new AppError('Not authorized', 403));
  }

  // In production, create actual Stripe session
  const mockSession = {
    id: 'cs_test_' + Math.random().toString(36).substring(7),
    url: `${config.CLIENT_URL}/payment/success?orderId=${orderId}`,
  };

  res.json({
    success: true,
    data: mockSession,
  });
});

// @desc    Handle Stripe webhook - FIXED with signature verification
// @route   POST /api/v1/payment/stripe/webhook
// @access  Public (Stripe only)
const handleStripeWebhook = asyncHandler(async (req, res, next) => {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature - CRITICAL SECURITY FIX
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ received: false, error: 'Invalid signature' });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const order = await Order.findOne({ orderNumber: session.metadata?.orderId });
      if (order) {
        order.payment.status = 'completed';
        order.payment.transactionId = session.id;
        order.payment.paidAt = new Date();
        order.status = 'completed';
        await order.save();
      }
      break;
    }
    case 'payment_intent.payment_failed': {
      const paymentIntent = event.data.object;
      const order = await Order.findOne({ 'payment.transactionId': paymentIntent.id });
      if (order) {
        order.payment.status = 'failed';
        order.status = 'cancelled';
        await order.save();
      }
      break;
    }
  }

  res.json({ received: true });
});

// @desc    Add funds to wallet - SECURE (Admin only via Stripe)
// @route   POST /api/v1/payment/wallet/add
// @access  Private (Admin only - NO direct user access)
const addFunds = asyncHandler(async (req, res, next) => {
  // SECURITY FIX: This endpoint should ONLY be called from payment webhook
  // Not directly from user request!
  
  const { amount, userId, paymentMethod } = req.body;

  // Only allow internal calls (from webhook)
  const isInternal = req.headers['x-internal-key'] === process.env.INTERNAL_API_KEY;
  
  if (!isInternal) {
    return next(new AppError('Direct wallet addition not allowed. Please use payment methods.', 403));
  }

  if (!amount || amount <= 0 || amount > 10000) {
    return next(new AppError('Invalid amount (max $10,000)', 400));
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError('User not found', 404));
  }

  user.wallet.balance += amount;
  await user.save();

  res.json({
    success: true,
    data: {
      newBalance: user.wallet.balance,
    },
  });
});

// @desc    Get wallet balance
// @route   GET /api/v1/payment/wallet
// @access  Private
const getWallet = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.json({
    success: true,
    data: {
      balance: user.wallet.balance,
      points: user.wallet.points,
      totalSpent: user.wallet.totalSpent,
    },
  });
});

module.exports = {
  createStripeCheckout,
  handleStripeWebhook,
  addFunds,
  getWallet,
};
