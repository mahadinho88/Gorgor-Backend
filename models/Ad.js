const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please select a category']
  },
  subcategory: {
    type: String,
    default: ''
  },
  region: {
    type: String,
    required: [true, 'Please select a region']
  },
  district: {
    type: String,
    required: [true, 'Please select a district']
  },
  contact: {
    type: String,
    required: [true, 'Please provide a contact number']
  },
  images: [{
    type: String
  }],
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  categoryFields: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  adPlan: {
    type: String,
    enum: ['free', 'state', 'two-states', 'premium'],
    default: 'free'
  },
  duration: {
    type: Number,
    default: 3
  },
  coverageRegions: [{
    type: String
  }],
  totalCost: {
    type: Number,
    default: 0
  },
  expiryDate: {
    type: Date
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isSold: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'approved'
  },
  rejectionReason: {
    type: String
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Index for search optimization
adSchema.index({ title: 'text', description: 'text' });
adSchema.index({ category: 1, region: 1, status: 1 });

module.exports = mongoose.model('Ad', adSchema);
