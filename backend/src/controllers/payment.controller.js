// Payment Controller
const Order = require('../models/Order.model');
const User = require('../models/User.model');
const { asyncHandler, AppError } = require('../middleware/error.middleware');
const config = require('../../config/env');

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
  // For now, return mock response
  const mockSession = {
    id: 'cs_test_' + Math.random().toString(36).substring(7),
    url: `${config.CLIENT_URL}/payment/success?orderId=${orderId}`,
  };

  res.json({
    success: true,
    data: mockSession,
  });
});

// @desc    Handle Stripe webhook
// @route   POST /api/v1/payment/stripe/webhook
// @access  Public (Stripe)
const handleStripeWebhook = asyncHandler(async (req, res, next) => {
  // In production, verify webhook signature
  const event = req.body;

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

// @desc    Create TON deposit address
// @route   POST /api/v1/payment/ton/deposit
// @access  Private
const createTonDeposit = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  // Generate mock TON address
  const tonAddress = 'UQ' + Math.random().toString(36).substring(2, 36);

  user.wallet.tonAddress = tonAddress;
  user.wallet.tonCreatedAt = new Date();
  await user.save();

  res.json({
    success: true,
    data: {
      address: tonAddress,
      qrCode: `ton://transfer/${tonAddress}`,
    },
  });
});

// @desc    Add funds to wallet
// @route   POST /api/v1/payment/wallet/add
// @access  Private
const addFunds = asyncHandler(async (req, res, next) => {
  const { amount, method } = req.body;

  if (!amount || amount <= 0) {
    return next(new AppError('Invalid amount', 400));
  }

  const user = await User.findById(req.user.id);
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
      tonAddress: user.wallet.tonAddress,
      totalSpent: user.wallet.totalSpent,
    },
  });
});

module.exports = {
  createStripeCheckout,
  handleStripeWebhook,
  createTonDeposit,
  addFunds,
  getWallet,
};
