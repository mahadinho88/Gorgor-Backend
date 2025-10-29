const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const { protect } = require('../middleware/auth');

// @route   GET /api/v1/ads
// @desc    Get all approved ads
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category, region, minPrice, maxPrice, search } = req.query;
    
    let query = { status: 'approved', isSold: false };
    
    if (category) query.category = category;
    if (region) query.region = region;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    if (search) {
      query.$text = { $search: search };
    }

    const ads = await Ad.find(query)
      .populate('userId', 'fullName phoneNumber region')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ads'
    });
  }
});

// @route   GET /api/v1/ads/featured
// @desc    Get featured ads
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const ads = await Ad.find({ 
      status: 'approved', 
      isFeatured: true, 
      isSold: false 
    })
      .populate('userId', 'fullName phoneNumber region')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Get featured ads error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching featured ads'
    });
  }
});

// @route   GET /api/v1/ads/my-ads
// @desc    Get current user's ads
// @access  Private
router.get('/my-ads', protect, async (req, res) => {
  try {
    const ads = await Ad.find({ userId: req.user._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ads.length,
      ads
    });
  } catch (error) {
    console.error('Get my ads error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching your ads'
    });
  }
});

// @route   GET /api/v1/ads/:id
// @desc    Get single ad by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id)
      .populate('userId', 'fullName phoneNumber email region district');

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Increment views
    ad.views += 1;
    await ad.save();

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching ad'
    });
  }
});

// @route   POST /api/v1/ads
// @desc    Create a new ad
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const adData = {
      ...req.body,
      userId: req.user._id
    };

    const ad = await Ad.create(adData);

    res.status(201).json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating ad'
    });
  }
});

// @route   PUT /api/v1/ads/:id
// @desc    Update an ad
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    let ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Make sure user owns the ad
    if (ad.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this ad'
      });
    }

    ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating ad'
    });
  }
});

// @route   DELETE /api/v1/ads/:id
// @desc    Delete an ad
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    // Make sure user owns the ad
    if (ad.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this ad'
      });
    }

    await ad.deleteOne();

    res.json({
      success: true,
      message: 'Ad deleted successfully'
    });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting ad'
    });
  }
});

// @route   PATCH /api/v1/ads/:id/sold
// @desc    Mark ad as sold
// @access  Private
router.patch('/:id/sold', protect, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);

    if (!ad) {
      return res.status(404).json({
        success: false,
        message: 'Ad not found'
      });
    }

    if (ad.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    ad.isSold = !ad.isSold;
    await ad.save();

    res.json({
      success: true,
      ad
    });
  } catch (error) {
    console.error('Mark sold error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating ad'
    });
  }
});

module.exports = router;
