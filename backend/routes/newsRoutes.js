const express = require('express');
const router = express.Router();
const News = require('../models/News');
const authMiddleware = require('../middleware/authMiddleware');
const { fetchLiveNews } = require('../services/newsService');

// @route   GET /api/news/live
// @desc    Fetch live city news from NewsData.io (proxied, API key stays server-side)
router.get('/live', async (req, res) => {
  try {
    const { q, country } = req.query;
    const articles = await fetchLiveNews(
      q || 'smart city municipal corporation india',
      country || 'in'
    );
    res.json({ success: true, count: articles.length, data: articles, source: 'newsdata.io' });
  } catch (error) {
    console.error('NewsData.io fetch error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
});


// @route   GET /api/news
// @desc    Get all news articles (supports filtering and search)
router.get('/', async (req, res) => {
  try {
    const { search, category, adminMode } = req.query;
    let query = {};

    // Citizens only see published articles
    if (adminMode !== 'true') {
      query.published = true;
    }

    if (category) {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } }
      ];
    }

    const news = await News.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: news.length, data: news });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   GET /api/news/:id
// @desc    Get single news article details
router.get('/:id', async (req, res) => {
  try {
    const article = await News.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({ success: true, data: article });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// @route   POST /api/news
// @desc    Create new news article (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, image, location, priority, published, createdBy } = req.body;

    const newArticle = new News({
      title,
      description,
      category,
      image,
      location,
      priority,
      published,
      createdBy: createdBy || 'Admin'
    });

    const saved = await newArticle.save();
    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   PUT /api/news/:id
// @desc    Update an existing news article (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, description, category, image, location, priority, published } = req.body;

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { title, description, category, image, location, priority, published },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }

    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});

// @route   DELETE /api/news/:id
// @desc    Delete a news article (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Article not found.' });
    }
    res.json({ success: true, message: 'Article deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
