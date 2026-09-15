# 🏙️ SmartCityOS — Smart City Management System

<p align="center">
  <b>A next-generation, full-stack urban management platform designed to bridge the gap between citizens and administration.</b>
</p>

## ✨ Features

- 🗺️ **Live Traffic Monitoring** — Real-time city map and traffic alerts (Leaflet + OpenStreetMap)
- 🚨 **Emergency Broadcasts** — Critical real-time emergency alert system
- 📰 **Civic News Integration** — Dynamic local news feed (NewsAPI.org)
- 🌤️ **Weather Tracking** — Hyperlocal weather and environmental data
- 📝 **Citizen Complaint System** — File, track, and monitor civic issues
- 🔐 **Admin Dashboard** — Manage complaints, post news, and oversee city services
- 💎 **Premium Glassmorphic UI** — Modern, responsive, and stunning interface

---

## 📁 Project Structure

```
Smart-City-Management/
├── frontend/       ← React + Vite app  → Deploy to Vercel
└── backend/        ← Node.js + Express → Deploy to Render
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Maps | Leaflet.js + OpenStreetMap |
| APIs | OpenWeatherMap, NewsAPI.org |

---

## 🚀 Local Development

### 1. Clone the repository
```bash
git clone https://github.com/Chiragsoni9080/Smart-City-Management-.git
cd Smart-City-Management-
```

### 2. Setup Backend
```bash
cd backend
npm install
```
Create a `.env` file inside `backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
OPENWEATHER_API_KEY=your_openweather_api_key
NEWSDATA_API_KEY=your_newsapi_org_key
```
Start backend:
```bash
npm run dev
```

### 3. Setup Frontend
```bash
# Open a new terminal
cd frontend
npm install
```
Create a `.env` file inside `frontend/`:
```env
VITE_API_URL=http://localhost:5000
```
Start frontend:
```bash
npm run dev
```

---

## ☁️ Deployment Guide

### Frontend → Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo
2. Set **Root Directory** to `frontend`
3. Build settings are auto-detected (Vite)
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://your-backend-url.onrender.com`
5. Click **Deploy** ✅

### Backend → Render

1. Go to [render.com](https://render.com) → **New Web Service** → Connect your GitHub repo
2. Set **Root Directory** to `backend`
3. Set **Build Command**: `npm install`
4. Set **Start Command**: `node server.js`
5. Add **Environment Variables**:
   - `MONGODB_URI` = your Atlas connection string
   - `OPENWEATHER_API_KEY` = your key
   - `NEWSDATA_API_KEY` = your key
6. Click **Create Web Service** ✅

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📝 License

MIT License
