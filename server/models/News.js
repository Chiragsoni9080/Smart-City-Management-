const mongoose = require('mongoose');

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Latest News',
        'Emergency Alerts',
        'Traffic Updates',
        'Road/Construction Updates',
        'Water Supply Updates',
        'Garbage Collection Updates',
        'City Events'
      ]
    },
    image: {
      type: String // Stores Base64 encoded image string or URL
    },
    location: {
      type: String,
      default: 'City Wide'
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    published: {
      type: Boolean,
      default: false
    },
    createdBy: {
      type: String,
      default: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('News', newsSchema);
