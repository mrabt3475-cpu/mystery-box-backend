// Anime Store Campaign System
// ===========================

const mongoose = require('mongoose')

// Anime Campaign Schema
const animeCampaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  
  // Campaign Period
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  
  // Discount Settings
  discount: {
    percentage: { type: Number, default: 60 }, // 60% discount
    minPurchase: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: 100 }
  },
  
  // Points System
  points: {
    enabled: { type: Boolean, default: true },
    percentage: { type: Number, default: 10 }, // 10% back as points
    minPoints: { type: Number, default: 1 },
    maxPoints: { type: Number, default: 100 }
  },
  
  // Referral Enhancement
  referral: {
    bonusPoints: { type: Number, default: 50 }, // Extra points for referrer
    bonusPercentage: { type: Number, default: 5 }, // 5% discount for referee
    doublePoints: { type: Boolean, default: true }
  },
  
  // Visual Settings
  theme: {
    primaryColor: { type: String, default: '#ff6b9d' }, // Pink
    secondaryColor: { type: String, default: '#4ecdc4' }, // Teal
    accentColor: { type: String, default: '#ffd93d' }, // Gold
    videoBackground: String,
    musicBackground: String
  },
  
  // Featured Characters
  characters: [{
    name: String,
    image: String,
    anime: String,
    position: String // 'left', 'right', 'center'
  }],
  
  // Stats
  stats: {
    totalSales: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },
    totalPointsAwarded: { type: Number, default: 0 },
    totalReferrals: { type: Number, default: 0 }
  },
  
  createdAt: { type: Date, default: Date.now }
})

// Calculate price with discount
animeCampaignSchema.methods.calculatePrice = function(basePrice) {
  const discountAmount = basePrice * (this.discount.percentage / 100)
  const discountedPrice = basePrice - discountAmount
  
  // Apply max discount cap
  const finalDiscount = Math.min(discountAmount, this.discount.maxDiscount)
  const finalPrice = basePrice - finalDiscount
  
  return {
    originalPrice: basePrice,
    discount: finalDiscount,
    discountedPrice: finalPrice,
    discountPercentage: this.discount.percentage
  }
}

// Calculate points earned
animeCampaignSchema.methods.calculatePoints = function(purchaseAmount) {
  if (!this.points.enabled) return 0
  
  const pointsEarned = purchaseAmount * (this.points.percentage / 100)
  return Math.max(
    this.points.minPoints,
    Math.min(pointsEarned, this.points.maxPoints)
  )
}

// Check if campaign is active
animeCampaignSchema.methods.isActive = function() {
  const now = new Date()
  return this.isActive && now >= this.startDate && now <= this.endDate
}

// Get time remaining
animeCampaignSchema.methods.getTimeRemaining = function() {
  const now = new Date()
  const remaining = this.endDate - now
  
  if (remaining <= 0) return { expired: true }
  
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24))
  const hours = Math.floor((remaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
  
  return { days, hours, minutes, expired: false }
}

// Anime Product Schema
const animeProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  
  // Anime specific
  anime: { type: String, required: true }, // Naruto, One Piece, etc.
  category: { 
    type: String, 
    enum: ['clothing', 'accessories', 'figures', 'cosplay', 'posters', 'other'],
    required: true 
  },
  
  // Media
  images: [String],
  model3D: String, // URL for 3D model
  video: String, // Product video
  
  // Stock
  stock: { type: Number, default: 100 },
  sizes: [String], // S, M, L, XL for clothing
  colors: [String],
  
  // Tags
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isLimited: { type: Boolean, default: false },
  
  // Campaign link
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'AnimeCampaign' },
  
  createdAt: { type: Date, default: Date.now }
})

// Index for search
animeProductSchema.index({ anime: 1, category: 1 })
animeProductSchema.index({ name: 'text', description: 'text' })

// Anime Service
class AnimeStoreService {
  // Create campaign
  async createCampaign(data) {
    const campaign = await AnimeCampaign.create({
      ...data,
      startDate: new Date(),
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000) // 60 days
    })
    return campaign
  }
  
  // Get active campaign
  async getActiveCampaign() {
    const campaign = await AnimeCampaign.findOne({
      isActive: true,
      startDate: { $lte: new Date() },
      endDate: { $gte: new Date() }
    })
    
    if (campaign) {
      campaign.timeRemaining = campaign.getTimeRemaining()
    }
    
    return campaign
  }
  
  // Get anime products
  async getProducts(anime, category, options = {}) {
    const { page = 1, limit = 20, sort = 'newest' } = options
    
    const query = {}
    if (anime) query.anime = anime
    if (category) query.category = category
    
    const sortOptions = {
      newest: { createdAt: -1 },
      priceLow: { price: 1 },
      priceHigh: { price: -1 },
      popular: { stock: -1 }
    }
    
    const products = await AnimeProduct.find(query)
      .sort(sortOptions[sort] || sortOptions.newest)
      .skip((page - 1) * limit)
      .limit(limit)
    
    const total = await AnimeProduct.countDocuments(query)
    
    return {
      products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) }
    }
  }
  
  // Process purchase with campaign
  async processPurchase(userId, products, campaign) {
    let totalOriginal = 0
    let totalDiscounted = 0
    let totalPoints = 0
    
    for (const item of products) {
      const product = await AnimeProduct.findById(item.productId)
      if (!product) continue
      
      const priceCalc = campaign.calculatePrice(product.price)
      totalOriginal += priceCalc.originalPrice
      totalDiscounted += priceCalc.discountedPrice
      
      const points = campaign.calculatePoints(priceCalc.discountedPrice)
      totalPoints += points
    }
    
    return {
      originalTotal: totalOriginal,
      discountedTotal: totalDiscounted,
      totalDiscount: totalOriginal - totalDiscounted,
      pointsEarned: totalPoints,
      savings: ((totalOriginal - totalDiscounted) / totalOriginal * 100).toFixed(1)
    }
  }
  
  // Get anime list
  async getAnimeList() {
    const animes = await AnimeProduct.distinct('anime')
    const animeData = []
    
    for (const anime of animes) {
      const count = await AnimeProduct.countDocuments({ anime })
      animeData.push({ name: anime, productCount: count })
    }
    
    return animeData
  }
}

const AnimeCampaign = mongoose.model('AnimeCampaign', animeCampaignSchema)
const AnimeProduct = mongoose.model('AnimeProduct', animeProductSchema)

module.exports = { 
  AnimeCampaign, 
  AnimeProduct,
  AnimeStoreService: new AnimeStoreService() 
}
