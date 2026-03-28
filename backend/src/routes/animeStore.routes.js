// Anime Store API Routes
// =====================

const express = require('express')
const router = express.Router()
const { AnimeCampaign, AnimeProduct, AnimeStoreService } = require('../models/AnimeStore.model')
const { auth } = require('../middleware/auth.middleware')

// Get active campaign
router.get('/campaign/active', async (req, res) => {
  try {
    const campaign = await AnimeStoreService.getActiveCampaign()
    
    if (!campaign) {
      return res.json({ 
        success: true, 
        data: null,
        message: 'No active campaign'
      })
    }
    
    res.json({ success: true, data: campaign })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get all campaigns (admin)
router.get('/campaigns', auth, async (req, res) => {
  try {
    const campaigns = await AnimeCampaign.find().sort({ createdAt: -1 })
    res.json({ success: true, data: campaigns })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create campaign (admin)
router.post('/campaign', auth, async (req, res) => {
  try {
    const campaign = await AnimeStoreService.createCampaign(req.body)
    res.json({ success: true, data: campaign })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update campaign (admin)
router.put('/campaign/:id', auth, async (req, res) => {
  try {
    const campaign = await AnimeCampaign.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({ success: true, data: campaign })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get anime products
router.get('/products', async (req, res) => {
  try {
    const { anime, category, page = 1, limit = 20, sort = 'newest' } = req.query
    
    const result = await AnimeStoreService.getProducts(anime, category, {
      page: parseInt(page),
      limit: parseInt(limit),
      sort
    })
    
    res.json({ success: true, ...result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get product by ID
router.get('/products/:id', async (req, res) => {
  try {
    const product = await AnimeProduct.findById(req.params.id)
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    
    // Get campaign for pricing
    const campaign = await AnimeStoreService.getActiveCampaign()
    let pricing = null
    
    if (campaign) {
      pricing = campaign.calculatePrice(product.price)
      pricing.points = campaign.calculatePoints(pricing.discountedPrice)
    }
    
    res.json({ success: true, data: { product, pricing } })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create anime product (admin)
router.post('/products', auth, async (req, res) => {
  try {
    const product = await AnimeProduct.create(req.body)
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update anime product (admin)
router.put('/products/:id', auth, async (req, res) => {
  try {
    const product = await AnimeProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get anime list
router.get('/anime-list', async (req, res) => {
  try {
    const animeList = await AnimeStoreService.getAnimeList()
    res.json({ success: true, data: animeList })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Process purchase with campaign
router.post('/purchase', auth, async (req, res) => {
  try {
    const { products } = req.body
    const campaign = await AnimeStoreService.getActiveCampaign()
    
    if (!campaign) {
      return res.status(400).json({ 
        success: false, 
        error: 'No active campaign' 
      })
    }
    
    const result = await AnimeStoreService.processPurchase(
      req.user._id,
      products,
      campaign
    )
    
    res.json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get campaign stats (admin)
router.get('/campaign/:id/stats', auth, async (req, res) => {
  try {
    const campaign = await AnimeCampaign.findById(req.params.id)
    
    if (!campaign) {
      return res.status(404).json({ success: false, error: 'Campaign not found' })
    }
    
    res.json({ success: true, data: campaign.stats })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router
