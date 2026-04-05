// Pricing Service with Profit Margin Calculation
// ==================================================

const Product = require('../models/Product.model');
const Order = require('../models/Order.model');
const { logger } = require('../utils/logger');

class PricingService {
  // Calculate profit margin for a product
  calculateProfitMargin(price, costPrice) {
    if (!price || price <= 0) return 0;
    if (!costPrice || costPrice <= 0) return 0;
    
    const profit = price - costPrice;
    const margin = (profit / price) * 100;
    
    return {
      profit: profit,
      marginPercent: Math.round(margin * 100) / 100,
      markupPercent: Math.round((profit / costPrice) * 100) / 100
    };
  }

  // Calculate order total with profit
  async calculateOrderProfit(orderId) {
    const order = await Order.findById(orderId).populate('items.product');
    
    if (!order) {
      throw new Error('Order not found');
    }

    let totalCost = 0;
    let totalRevenue = 0;

    for (const item of order.items) {
      const product = item.product;
      if (product && product.costPrice) {
        totalCost += product.costPrice * item.quantity;
      }
      totalRevenue += item.price * item.quantity;
    }

    const profit = totalRevenue - totalCost;
    const marginPercent = totalRevenue > 0 
      ? (profit / totalRevenue) * 100 
      : 0;

    return {
      revenue: totalRevenue,
      cost: totalCost,
      profit: profit,
      marginPercent: Math.round(marginPercent * 100) / 100
    };
  }

  // Get products with profit margin
  async getProductsWithPricing() {
    const products = await Product.find({ isActive: true })
      .select('name price costPrice originalPrice stock category')
      .lean();

    return products.map(p => ({
      ...p,
      profitMargin: this.calculateProfitMargin(p.price, p.costPrice),
      hasDiscount: p.originalPrice && p.originalPrice > p.price,
      discountPercent: p.originalPrice 
        ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
        : 0
    }));
  }

  // Apply discount to product
  applyDiscount(price, discountPercent) {
    if (discountPercent <= 0 || discountPercent > 100) {
      return price;
    }
    return Math.round(price * (1 - discountPercent / 100) * 100) / 100;
  }

  // Calculate bulk discount
  calculateBulkDiscount(quantity, unitPrice, tiers = []) {
    const defaultTiers = [
      { quantity: 10, discount: 5 },
      { quantity: 50, discount: 10 },
      { quantity: 100, discount: 15 },
      { quantity: 500, discount: 20 }
    ];

    const activeTiers = tiers.length > 0 ? tiers : defaultTiers;
    
    const applicableTier = activeTiers
      .filter(t => quantity >= t.quantity)
      .sort((a, b) => b.quantity - a.quantity)[0];

    if (!applicableTier) {
      return {
        unitPrice,
        totalPrice: unitPrice * quantity,
        discountPercent: 0,
        savings: 0
      };
    }

    const discountPercent = applicableTier.discount;
    const discountedUnitPrice = this.applyDiscount(unitPrice, discountPercent);
    const totalPrice = discountedUnitPrice * quantity;
    const originalTotal = unitPrice * quantity;
    const savings = originalTotal - totalPrice;

    return {
      unitPrice: discountedUnitPrice,
      totalPrice,
      discountPercent,
      savings,
      tier: applicableTier
    };
  }

  // Format price for display
  formatPrice(price, currency = 'SAR') {
    const currencySymbols = {
      'SAR': 'ر.س',
      'USD': '$',
      'EUR': '€'
    };
    
    const symbol = currencySymbols[currency] || currency;
    return {
      raw: price,
      formatted: `${price.toLocaleString('ar-SA')} ${symbol}`,
      symbol
    };
  }

  // Get pricing analytics
  async getPricingAnalytics() {
    const products = await Product.find({ isActive: true })
      .select('price costPrice category')
      .lean();

    const analytics = {
      totalProducts: products.length,
      avgPrice: 0,
      avgCost: 0,
      avgMargin: 0,
      byCategory: {}
    };

    let totalPrice = 0;
    let totalCost = 0;

    products.forEach(p => {
      totalPrice += p.price || 0;
      totalCost += p.costPrice || 0;

      const cat = p.category || 'other';
      if (!analytics.byCategory[cat]) {
        analytics.byCategory[cat] = {
          count: 0,
          totalPrice: 0,
          totalCost: 0
        };
      }
      analytics.byCategory[cat].count++;
      analytics.byCategory[cat].totalPrice += p.price || 0;
      analytics.byCategory[cat].totalCost += p.costPrice || 0;
    });

    analytics.avgPrice = products.length > 0 ? totalPrice / products.length : 0;
    analytics.avgCost = products.length > 0 ? totalCost / products.length : 0;
    analytics.avgMargin = analytics.avgPrice > 0 
      ? ((analytics.avgPrice - analytics.avgCost) / analytics.avgPrice) * 100 
      : 0;

    for (const cat in analytics.byCategory) {
      const c = analytics.byCategory[cat];
      c.avgPrice = c.count > 0 ? c.totalPrice / c.count : 0;
      c.avgCost = c.count > 0 ? c.totalCost / c.count : 0;
      c.avgMargin = c.avgPrice > 0 
        ? ((c.avgPrice - c.avgCost) / c.avgPrice) * 100 
        : 0;
    }

    return analytics;
  }
}

module.exports = new PricingService();