// Payment Routes
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth.middleware');
const { paymentLimiter } = require('../middleware/rateLimiter.middleware');
const paymentController = require('../controllers/payment.controller');

// Stripe
router.post('/stripe/checkout', protect, paymentLimiter, paymentController.createStripeCheckout);
router.post('/stripe/webhook', paymentController.handleStripeWebhook);

// TON
router.post('/ton/deposit', protect, paymentController.createTonDeposit);

// Wallet
router.get('/wallet', protect, paymentController.getWallet);
router.post('/wallet/add', protect, paymentLimiter, paymentController.addFunds);

module.exports = router;
