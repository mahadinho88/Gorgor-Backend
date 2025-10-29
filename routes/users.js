const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');

// @route   GET /api/v1/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching profile'
    });
  }
});

// @route   PUT /api/v1/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', protect, async (req, res) => {
  try {
    const fieldsToUpdate = {
      fullName: req.body.fullName,
      email: req.body.email,
      region: req.body.region,
      district: req.body.district
    };

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating profile'
    });
  }
});

// @route   GET /api/v1/users/favorites
// @desc    Get user's favorite ads
// @access  Private
router.get('/favorites', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching favorites'
    });
  }
});

// @route   POST /api/v1/users/favorites
// @desc    Add ad to favorites
// @access  Private
router.post('/favorites', protect, async (req, res) => {
  try {
    const { adId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user.favorites.includes(adId)) {
      user.favorites.push(adId);
      await user.save();
    }

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding favorite'
    });
  }
});

// @route   DELETE /api/v1/users/favorites/:adId
// @desc    Remove ad from favorites
// @access  Private
router.delete('/favorites/:adId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.adId
    );
    await user.save();

    res.json({
      success: true,
      favorites: user.favorites
    });
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error removing favorite'
    });
  }
});

// @route   GET /api/v1/users/recently-viewed
// @desc    Get recently viewed ads
// @access  Private
router.get('/recently-viewed', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('recentlyViewed');
    
    res.json({
      success: true,
      recentlyViewed: user.recentlyViewed
    });
  } catch (error) {
    console.error('Get recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching recently viewed'
    });
  }
});

// @route   POST /api/v1/users/recently-viewed
// @desc    Add ad to recently viewed
// @access  Private
router.post('/recently-viewed', protect, async (req, res) => {
  try {
    const { adId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    // Remove if already exists
    user.recentlyViewed = user.recentlyViewed.filter(
      id => id.toString() !== adId
    );
    
    // Add to beginning
    user.recentlyViewed.unshift(adId);
    
    // Keep only last 20
    user.recentlyViewed = user.recentlyViewed.slice(0, 20);
    
    await user.save();

    res.json({
      success: true,
      recentlyViewed: user.recentlyViewed
    });
  } catch (error) {
    console.error('Add recently viewed error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error adding recently viewed'
    });
  }
});

module.exports = router;
