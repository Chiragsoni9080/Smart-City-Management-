const https = require('https');

const NEWSDATA_API_KEY = process.env.NEWSDATA_API_KEY;

// Detect which API to use based on key format
// NewsAPI.org keys are 32-char hex strings
// NewsData.io keys start with 'pub_'
const isNewsApiOrg = NEWSDATA_API_KEY && !NEWSDATA_API_KEY.startsWith('pub_');

const NEWSDATA_BASE_URL = 'https://newsdata.io/api/1/news';
const NEWSAPI_BASE_URL  = 'https://newsapi.org/v2/everything';

// Per-query cache to avoid hitting free-tier rate limits
let cache = {};
const CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Fetch live city/civic news — auto-routes to newsdata.io OR newsapi.org
 * depending on the API key format set in .env
 * @param {string} query   - keyword search (default: smart city india)
 * @param {string} country - ISO country code (default: in) [newsdata.io only]
 */
function fetchLiveNews(query = 'smart city municipal corporation india', country = 'in') {
  return new Promise((resolve, reject) => {
    const cacheKey = `${query}-${country}`;
    // Serve from cache if still fresh
    if (cache[cacheKey] && Date.now() - cache[cacheKey].timestamp < CACHE_TTL_MS) {
      return resolve(cache[cacheKey].data);
    }

    if (!NEWSDATA_API_KEY) {
      return reject(new Error('NEWSDATA_API_KEY not set in environment.'));
    }

    if (isNewsApiOrg) {
      return fetchFromNewsApiOrg(query, cacheKey, resolve, reject);
    } else {
      return fetchFromNewsDataIo(query, country, cacheKey, resolve, reject);
    }
  });
}

/** Fetch from newsapi.org */
function fetchFromNewsApiOrg(query, cacheKey, resolve, reject) {
  const params = new URLSearchParams({
    apiKey: NEWSDATA_API_KEY,
    q: query,
    language: 'en',
    sortBy: 'publishedAt',
    pageSize: '20',
  });

  const url = `${NEWSAPI_BASE_URL}?${params.toString()}`;

  https.get(url, { headers: { 'User-Agent': 'SmartCityApp/1.0' } }, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(rawData);

        if (parsed.status !== 'ok') {
          return reject(new Error(parsed.message || 'NewsAPI.org returned an error.'));
        }

        const articles = (parsed.articles || []).map((item) => ({
          _id: item.url,
          title: item.title || 'Untitled',
          description: item.description || item.content || 'No description available.',
          category: 'Latest News',
          image: item.urlToImage || null,
          location: item.source?.name || 'India',
          priority: 'Medium',
          published: true,
          source: item.source?.name,
          sourceUrl: item.url,
          createdAt: item.publishedAt ? new Date(item.publishedAt).toISOString() : new Date().toISOString(),
          isLive: true,
        }));

        cache[cacheKey] = { data: articles, timestamp: Date.now() };
        resolve(articles);
      } catch (err) {
        reject(new Error('Failed to parse NewsAPI.org response.'));
      }
    });
  }).on('error', reject);
}

/** Fetch from newsdata.io */
function fetchFromNewsDataIo(query, country, cacheKey, resolve, reject) {
  const params = new URLSearchParams({
    apikey: NEWSDATA_API_KEY,
    q: query,
    country,
    language: 'en',
  });

  const url = `${NEWSDATA_BASE_URL}?${params.toString()}`;

  https.get(url, (res) => {
    let rawData = '';
    res.on('data', (chunk) => { rawData += chunk; });
    res.on('end', () => {
      try {
        const parsed = JSON.parse(rawData);

        if (parsed.status !== 'success') {
          return reject(new Error(parsed.message || 'NewsData.io API returned an error.'));
        }

        const articles = (parsed.results || []).map((item) => ({
          _id: item.article_id || item.link,
          title: item.title || 'Untitled',
          description: item.description || item.content || 'No description available.',
          category: mapCategory(item.category),
          image: item.image_url || null,
          location: item.source_id || 'India',
          priority: 'Medium',
          published: true,
          source: item.source_id,
          sourceUrl: item.link,
          createdAt: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
          isLive: true,
        }));

        cache[cacheKey] = { data: articles, timestamp: Date.now() };
        resolve(articles);
      } catch (err) {
        reject(new Error('Failed to parse NewsData.io response.'));
      }
    });
  }).on('error', reject);
}

/**
 * Map NewsData.io categories to our internal category labels
 */
function mapCategory(cats) {
  if (!cats || !Array.isArray(cats) || cats.length === 0) return 'Latest News';
  const first = cats[0].toLowerCase();
  if (first.includes('politics') || first.includes('government')) return 'Latest News';
  if (first.includes('environment') || first.includes('weather')) return 'Emergency Alerts';
  if (first.includes('transport') || first.includes('traffic')) return 'Traffic Updates';
  if (first.includes('health') || first.includes('crime')) return 'Emergency Alerts';
  if (first.includes('business') || first.includes('technology')) return 'Latest News';
  return 'Latest News';
}

module.exports = { fetchLiveNews };
