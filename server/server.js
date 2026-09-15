require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const newsRoutes = require('./routes/newsRoutes');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend requests
app.use(cors());

// Parse incoming request bodies as JSON (limit increased for base64 images)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Register routes
app.use('/api/news', newsRoutes);
app.use('/api/weather', weatherRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// 404 Fallback
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'API Route Not Found' });
});

// Basic error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Connect to MongoDB
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartcity';
console.log(`Connecting to MongoDB at: ${dbUri}...`);

mongoose
  .connect(dbUri)
  .then(() => {
    console.log('Connected to MongoDB successfully.');
  })
  .catch((err) => {
    console.warn('\n====================================================');
    console.warn('WARNING: Failed to connect to MongoDB server.');
    console.warn('API will run, but database persistence requires MongoDB to be active.');
    console.warn('Make sure MongoDB service is running (e.g. net start MongoDB).');
    console.warn('====================================================\n');
  });

app.listen(PORT, () => {
  console.log(`Smart City backend server is running on port ${PORT}`);
});
