# 🏙️ SmartCityOS

<p align="center">
  <b>A comprehensive, full-stack Smart City Management System engineered to bridge the gap between citizens and administration.</b>
</p>

## ✨ Features

- **Live Traffic Monitoring**: Real-time traffic dashboard visualizing city map and alerts (powered by Leaflet & OpenStreetMap).
- **Emergency Broadcasts**: Critical, real-time emergency alert system for citizens.
- **Civic News Integration**: Dynamic news feed featuring local and live civic news (integrating NewsAPI.org).
- **Weather & Environmental Data**: Hyperlocal weather tracking and environmental conditions monitoring.
- **Citizen Complaint System**: An intuitive interface for residents to file, track, and monitor infrastructure issues (e.g., potholes, streetlights).
- **Admin Dashboard**: A secure backend for city officials to review, assign, and resolve citizen complaints, and post civic updates.
- **Premium Glassmorphic UI**: A stunning, modern, and highly responsive user interface designed for maximum engagement.

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS (Custom Theme), React Router.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (Atlas Cloud Integration).
- **Mapping**: Leaflet.js (Replacing Google Maps for free, open-source mapping).

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB server)
- API Keys for OpenWeatherMap and NewsAPI.org

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Chiragsoni9080/Smart-City-Management-.git
   cd Smart-City-Management-
   ```

2. **Setup the Backend Server**
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the `server` directory and add your keys:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   OPENWEATHER_API_KEY=your_openweather_api_key
   NEWSDATA_API_KEY=your_newsapi_org_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Setup the Frontend Application**
   ```bash
   # Open a new terminal window
   cd "Smart City Management System"
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/Chiragsoni9080/Smart-City-Management-/issues).

## 📝 License

This project is licensed under the MIT License.
