import { useState, useEffect, useRef } from 'react'

declare global {
  interface Window {
    google: any;
  }
}

// ── Custom SVG Icons for Traffic Dashboard ──────────────────────────────────────
function IconAlert({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  )
}

function IconCamera({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
    </svg>
  )
}

function IconSpeed({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  )
}

function IconTrendingUp({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  )
}

function IconSignal({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  )
}

function IconMap({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
    </svg>
  )
}

function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}

function IconCheck({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  )
}

interface Incident {
  id: string
  title: string
  location: string
  severity: 'Critical' | 'Major' | 'Minor'
  type: 'Accident' | 'Congestion' | 'Construction' | 'Hazard' | 'Flooding'
  time: string
  status: 'Active' | 'Dispatched' | 'Resolved'
  x: number // Map coordinate percentage
  y: number // Map coordinate percentage
}

interface CCTVCamera {
  id: string
  name: string
  location: string
  status: 'Online' | 'Offline'
  speedAvg: number
  vehicleCount: number
  x: number
  y: number
  rotation: number
}

// Read Google Maps API key from Vite env (set VITE_GOOGLE_MAPS_API_KEY in .env)
const ENV_GOOGLE_MAPS_KEY = (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY as string | undefined

export default function TrafficDashboard() {
  // Map View Mode: 'hud' | 'leaflet'
  const [mapMode, setMapMode] = useState<'hud' | 'leaflet'>('leaflet')
  const [leafletLoaded, setLeafletLoaded] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  // Incident state
  const [incidents, setIncidents] = useState<Incident[]>([
    { id: 'inc-101', title: 'Overturned cargo truck blocking right lane', location: 'Highway 4 East (Junction 3)', severity: 'Critical', type: 'Accident', time: '10 mins ago', status: 'Active', x: 72, y: 38 },
    { id: 'inc-102', title: 'Water logging on main underpass road', location: 'Sector 15 Main Circle', severity: 'Major', type: 'Flooding', time: '25 mins ago', status: 'Dispatched', x: 42, y: 56 },
    { id: 'inc-103', title: 'Utility line repairs lane closure', location: 'Grand Avenue (Near central park)', severity: 'Minor', type: 'Construction', time: '1 hr ago', status: 'Active', x: 26, y: 22 }
  ])

  // CCTV cameras state
  const [cameras] = useState<CCTVCamera[]>([
    { id: 'cam-01', name: 'CAM-101 North Junction', location: 'Highway 4 Interchange', status: 'Online', speedAvg: 48, vehicleCount: 28, x: 68, y: 25, rotation: 45 },
    { id: 'cam-02', name: 'CAM-102 Central Square', location: 'Sector 15 Shopping Blvd', status: 'Online', speedAvg: 34, vehicleCount: 42, x: 48, y: 48, rotation: 120 },
    { id: 'cam-03', name: 'CAM-103 East Expressway', location: 'Ring Road exit lane', status: 'Online', speedAvg: 67, vehicleCount: 18, x: 82, y: 65, rotation: -30 },
    { id: 'cam-04', name: 'CAM-104 Westside Tunnel', location: 'Tunnel entry point West', status: 'Online', speedAvg: 41, vehicleCount: 31, x: 18, y: 72, rotation: 190 }
  ])

  // Selected entities for drawer panels
  const [selectedCamera, setSelectedCamera] = useState<CCTVCamera | null>(null)
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [activeTab, setActiveTab] = useState<'analytics' | 'roadways'>('analytics')

  // Incident reporting modal
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [reportTitle, setReportTitle] = useState('')
  const [reportLoc, setReportLoc] = useState('')
  const [reportType, setReportType] = useState<'Accident' | 'Congestion' | 'Construction' | 'Hazard' | 'Flooding'>('Accident')
  const [reportSeverity, setReportSeverity] = useState<'Critical' | 'Major' | 'Minor'>('Major')

  // CCTV Video Animation helper
  const [cctvFrame, setCctvFrame] = useState(0)
  useEffect(() => {
    if (!selectedCamera) return
    const timer = setInterval(() => {
      setCctvFrame(prev => (prev + 1) % 100)
    }, 150)
    return () => clearInterval(timer)
  }, [selectedCamera])

  // Leaflet Maps Dynamic Loading
  useEffect(() => {
    if (mapMode === 'leaflet' && !leafletLoaded) {
      // Load Leaflet CSS
      if (!document.getElementById('leaflet-css')) {
        const link = document.createElement('link')
        link.id = 'leaflet-css'
        link.rel = 'stylesheet'
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
        document.head.appendChild(link)
      }

      // Load Leaflet JS
      if (!document.getElementById('leaflet-js')) {
        const script = document.createElement('script')
        script.id = 'leaflet-js'
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
        script.async = true
        script.onload = () => {
          setLeafletLoaded(true)
        }
        document.head.appendChild(script)
      }
    }
  }, [mapMode, leafletLoaded])

  // Initialize Map once Leaflet is loaded
  useEffect(() => {
    if (leafletLoaded && mapMode === 'leaflet' && mapRef.current) {
      const L = (window as any).L
      if (!L) return

      // Clean up previous instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
      }

      // Initialize Map
      const map = L.map(mapRef.current).setView([24.5854, 73.7125], 13) // Default to Udaipur coordinates
      mapInstanceRef.current = map

      // Add Dark Matter Base layer (free OpenStreetMap dark theme)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map)

      // Add Incident Markers
      incidents.filter(inc => inc.status !== 'Resolved').forEach(inc => {
        const markerColor = inc.severity === 'Critical' ? '#ef4444' : inc.severity === 'Major' ? '#f59e0b' : '#3b82f6'
        
        const circleIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: ${markerColor}; width: 14px; height: 14px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px ${markerColor};"></div>`,
          iconSize: [14, 14],
          iconAnchor: [7, 7]
        })

        const lat = 24.5854 + (inc.y - 50) * 0.001
        const lng = 73.7125 + (inc.x - 50) * 0.001
        
        const marker = L.marker([lat, lng], { icon: circleIcon })
          .bindPopup(`<b>${inc.title}</b><br>${inc.type} - ${inc.severity}`)
          .addTo(map)
          
        marker.on('click', () => {
          setSelectedIncident(inc)
          setSelectedCamera(null)
        })
      })

      // Add Camera Markers
      cameras.forEach(cam => {
        const camIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div style="background-color: #10b981; width: 12px; height: 12px; border-radius: 2px; border: 1px solid white;"></div>`,
          iconSize: [12, 12],
          iconAnchor: [6, 6]
        })

        const lat = 24.5854 + (cam.y - 50) * 0.001
        const lng = 73.7125 + (cam.x - 50) * 0.001
        
        const marker = L.marker([lat, lng], { icon: camIcon })
          .bindPopup(`<b>${cam.name}</b><br>Speed: ${cam.speedAvg} km/h`)
          .addTo(map)
          
        marker.on('click', () => {
          setSelectedCamera(cam)
          setSelectedIncident(null)
        })
      })
    }
    
    return () => {
      if (mapInstanceRef.current && mapMode !== 'leaflet') {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [leafletLoaded, mapMode, incidents, cameras])

  // Handle reporting incident
  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reportTitle || !reportLoc) return

    const newIncident: Incident = {
      id: `inc-${Math.floor(104 + Math.random() * 899)}`,
      title: reportTitle,
      location: reportLoc,
      severity: reportSeverity,
      type: reportType,
      time: 'Just now',
      status: 'Active',
      x: 30 + Math.floor(Math.random() * 40),
      y: 30 + Math.floor(Math.random() * 40)
    }

    setIncidents([newIncident, ...incidents])
    setReportModalOpen(false)
    setReportTitle('')
    setReportLoc('')
    setSelectedIncident(newIncident)
    setSelectedCamera(null)
  }

  // Action: Dispatch emergency support
  const handleDispatch = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updated: Incident = { ...inc, status: 'Dispatched' }
        if (selectedIncident?.id === id) {
          setSelectedIncident(updated)
        }
        return updated
      }
      return inc
    }))
  }

  // Action: Resolve incident and remove from map
  const handleResolve = (id: string) => {
    setIncidents(prev => prev.map(inc => {
      if (inc.id === id) {
        const updated: Incident = { ...inc, status: 'Resolved' }
        if (selectedIncident?.id === id) {
          setSelectedIncident(updated)
        }
        return updated
      }
      return inc
    }))
  }

  // Derived dashboard metrics
  const activeIncidentsCount = incidents.filter(i => i.status !== 'Resolved').length
  const gridCongestionLevel = Math.max(10, Math.min(95, 34 + (activeIncidentsCount * 3) - incidents.filter(i => i.status === 'Resolved').length * 2))

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Custom CSS Styles for Vector Animations ── */}
      <style>{`
        @keyframes dash-flow-green {
          to { stroke-dashoffset: -40; }
        }
        @keyframes dash-flow-yellow {
          to { stroke-dashoffset: -30; }
        }
        @keyframes dash-flow-red {
          to { stroke-dashoffset: -12; }
        }
        .flow-line-green {
          stroke: #10b981;
          stroke-dasharray: 8, 12;
          animation: dash-flow-green 2s linear infinite;
        }
        .flow-line-yellow {
          stroke: #f59e0b;
          stroke-dasharray: 8, 12;
          animation: dash-flow-yellow 3.5s linear infinite;
        }
        .flow-line-red {
          stroke: #ef4444;
          stroke-dasharray: 4, 8;
          animation: dash-flow-red 6s linear infinite;
        }
        .ping-beacon {
          animation: beacon-scale 2s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
        @keyframes beacon-scale {
          0% { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .grid-crt-lines {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
          background-size: 100% 4px, 6px 100%;
        }
      `}</style>

      {/* ── Header Grid HUD ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Congestion Level */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group transition-all">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-amber-500/10 border border-amber-500/20 text-amber-400">
            <IconSpeed className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Overall Congestion</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{gridCongestionLevel}%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400">
                Moderate
              </span>
            </div>
            {/* Minimal Bar */}
            <div className="w-full bg-slate-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-emerald-500 to-amber-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${gridCongestionLevel}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 2: Average Speed */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group transition-all">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <IconTrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Average City Speed</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">43.8 km/h</span>
              <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-0.5">
                <IconTrendingUp className="w-3.5 h-3.5" /> +2.4%
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-2 block">Optimal peak threshold is 50</span>
          </div>
        </div>

        {/* Card 3: Active Incident Alerts */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group transition-all">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
            activeIncidentsCount > 0 ? 'bg-rose-500/15 border border-rose-500/25 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-500'
          }`}>
            <IconAlert className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Active Grid Incidents</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">{activeIncidentsCount}</span>
              {activeIncidentsCount > 0 ? (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400">
                  Critical
                </span>
              ) : (
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400">
                  All Clear
                </span>
              )}
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-2 block">
              {incidents.filter(i => i.status === 'Dispatched').length} emergency dispatches active
            </span>
          </div>
        </div>

        {/* Card 4: Signal Optimization */}
        <div className="glass-card rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden group transition-all">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-blue-500/10 border border-blue-500/20 text-[#42a5f5]">
            <IconSignal className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <span className="text-xs text-slate-400 font-medium block">Signal Efficiency</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-white">91.2%</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">
                AI Synced
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium mt-2 block">Dynamic offsets reducing stop times</span>
          </div>
        </div>

      </div>

      {/* ── Map Panel Toggle & Custom Viewer ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Left Side: Map Visual Interface (Spans 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl overflow-hidden flex flex-col h-[520px]">
            
            {/* Map Top Bar Control panel */}
            <div className="px-6 py-4 bg-[#0d1a2c]/60 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3">
              <div>
                <h3 className="font-bold text-white text-base">Live Grid Monitor</h3>
                <p className="text-xs text-slate-400">Interact with junctions, cameras and alerts</p>
              </div>
              <div className="flex items-center gap-3">
                {/* Map Mode Buttons */}
                <div className="bg-[#07111e] rounded-xl p-1 border border-slate-800 flex">
                  <button 
                    onClick={() => setMapMode('hud')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer ${
                      mapMode === 'hud' ? 'bg-[#00b894] text-white' : 'text-slate-400 hover:text-slate-200 bg-transparent'
                    }`}
                  >
                    <IconMap className="w-3.5 h-3.5" /> HUD Vector
                  </button>
                  <button 
                    onClick={() => setMapMode('google')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors border-none cursor-pointer ${
                      mapMode === 'google' ? 'bg-[#00b894] text-white' : 'text-slate-400 hover:text-slate-200 bg-transparent'
                    }`}
                  >
                    <IconSettings className="w-3.5 h-3.5" /> Google Map
                  </button>
                </div>

                <button 
                  onClick={() => setReportModalOpen(true)}
                  className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                >
                  Report Incident
                </button>
              </div>
            </div>

            {/* Map Display area */}
            <div className="flex-1 relative bg-[#07111e]/90 overflow-hidden">
              {mapMode === 'hud' ? (
                /* Custom HUD Vector City Map */
                <div className="w-full h-full relative select-none">
                  {/* Backdrop Grid Lines */}
                  <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:32px_32px]" />

                  {/* SVG City Map Base */}
                  <svg className="w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="none">
                    {/* Waterbody River */}
                    <path d="M 0,380 Q 200,320 400,350 T 800,310 L 800,450 L 0,450 Z" fill="#082b47" opacity="0.35" />
                    
                    {/* Central Park Greenery */}
                    <rect x="180" y="80" width="120" height="90" fill="#065f46" opacity="0.15" rx="10" stroke="#059669" strokeWidth="1" strokeDasharray="3 3" />
                    <text x="240" y="130" fill="#34d399" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.4" className="font-sans">
                      CENTRAL PARK
                    </text>

                    {/* Urban Zones */}
                    <text x="80" y="60" fill="#64748b" fontSize="9" fontWeight="bold" opacity="0.4">SECTOR 12 (RESIDENTIAL)</text>
                    <text x="680" y="80" fill="#64748b" fontSize="9" fontWeight="bold" opacity="0.4">SECTOR 18 (COMMERCIAL)</text>
                    <text x="640" y="420" fill="#64748b" fontSize="9" fontWeight="bold" opacity="0.4">INDUSTRIAL PARK</text>

                    {/* ── City Roadways ── */}

                    {/* Highway 4 East (Horizontal highway) */}
                    <path d="M 0,180 L 800,180" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                    <path d="M 0,180 L 800,180" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" />
                    {/* Flow lanes */}
                    <path d="M 0,180 L 400,180" className="flow-line-yellow" strokeWidth="2.5" />
                    <path d="M 400,180 L 800,180" className="flow-line-red" strokeWidth="2.5" />

                    {/* Ring Road (Circular outer loop) */}
                    <circle cx="400" cy="225" r="160" stroke="#1e293b" strokeWidth="8" fill="none" opacity="0.8" />
                    <circle cx="400" cy="225" r="160" stroke="#0f172a" strokeWidth="6" fill="none" />
                    {/* Ring road flow split */}
                    <path d="M 400,65 A 160 160 0 0 1 560 225" className="flow-line-green" strokeWidth="2" fill="none" />
                    <path d="M 560,225 A 160 160 0 0 1 400 385" className="flow-line-yellow" strokeWidth="2" fill="none" />
                    <path d="M 400,385 A 160 160 0 0 1 240 225" className="flow-line-green" strokeWidth="2" fill="none" />
                    <path d="M 240,225 A 160 160 0 0 1 400 65" className="flow-line-green" strokeWidth="2" fill="none" />

                    {/* Grand Avenue (Major vertical blvd) */}
                    <path d="M 320,0 L 320,450" stroke="#1e293b" strokeWidth="10" />
                    <path d="M 320,0 L 320,450" stroke="#0f172a" strokeWidth="8" />
                    <path d="M 320,0 L 320,180" className="flow-line-green" strokeWidth="2" />
                    <path d="M 320,180 L 320,450" className="flow-line-yellow" strokeWidth="2" />

                    {/* Sector Blvds */}
                    <path d="M 480,0 L 480,450" stroke="#1e293b" strokeWidth="8" />
                    <path d="M 480,0 L 480,450" stroke="#0f172a" strokeWidth="6" />
                    <path d="M 480,0 L 480,225" className="flow-line-green" strokeWidth="2.0" />
                    <path d="M 480,225 L 480,450" className="flow-line-red" strokeWidth="2.0" />

                    <path d="M 0,270 L 800,270" stroke="#1e293b" strokeWidth="8" />
                    <path d="M 0,270 L 800,270" stroke="#0f172a" strokeWidth="6" />
                    <path d="M 0,270 L 320,270" className="flow-line-green" strokeWidth="2" />
                    <path d="M 320,270 L 800,270" className="flow-line-yellow" strokeWidth="2" />

                    {/* Junction Label Pins */}
                    <circle cx="320" cy="180" r="14" fill="#0f172a" stroke="#475569" strokeWidth="1.5" />
                    <text x="320" y="183" fill="#94a3b8" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">J1</text>

                    <circle cx="480" cy="180" r="14" fill="#0f172a" stroke="#ef4444" strokeWidth="1.5" className="animate-pulse" />
                    <text x="480" y="183" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono">J2</text>
                  </svg>

                  {/* ── Overlay: Accident Hazards on Map ── */}
                  {incidents.filter(inc => inc.status !== 'Resolved').map(inc => (
                    <div 
                      key={inc.id}
                      style={{ left: `${inc.x}%`, top: `${inc.y}%` }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                      onClick={() => {
                        setSelectedIncident(inc)
                        setSelectedCamera(null)
                      }}
                    >
                      {/* Pulsing ring beacon */}
                      <span className={`absolute inline-flex h-10 w-10 rounded-full ping-beacon opacity-75 ${
                        inc.severity === 'Critical' ? 'bg-rose-500' : inc.severity === 'Major' ? 'bg-amber-500' : 'bg-blue-500'
                      }`} style={{ left: '-12px', top: '-12px' }} />
                      
                      {/* Center Pin */}
                      <div className={`w-4 h-4 rounded-full border-2 border-white flex items-center justify-center shadow-lg relative z-20 transition-transform group-hover:scale-125 ${
                        inc.severity === 'Critical' ? 'bg-rose-600' : inc.severity === 'Major' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}>
                        <span className="w-1.5 h-1.5 bg-white rounded-full" />
                      </div>

                      {/* Map Mini Tooltip */}
                      <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2.5 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30">
                        <span className="font-bold block text-[9px] uppercase tracking-wide text-slate-400">{inc.type}</span>
                        {inc.title}
                      </div>
                    </div>
                  ))}

                  {/* ── Overlay: CCTV Cameras on Map ── */}
                  {cameras.map(cam => (
                    <div 
                      key={cam.id}
                      style={{ left: `${cam.x}%`, top: `${cam.y}%` }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 group"
                      onClick={() => {
                        setSelectedCamera(cam)
                        setSelectedIncident(null)
                      }}
                    >
                      {/* Camera Indicator */}
                      <div className={`p-1.5 rounded-lg border shadow-lg flex items-center justify-center transition-all ${
                        selectedCamera?.id === cam.id 
                          ? 'bg-[#00b894] text-white border-white scale-110 z-20' 
                          : 'bg-slate-900/90 text-[#42a5f5] border-[#42a5f5]/30 hover:border-[#42a5f5] hover:scale-105'
                      }`}>
                        <IconCamera className="w-3.5 h-3.5" />
                      </div>

                      {/* Tooltip */}
                      <div className="absolute left-1/2 bottom-full mb-2 transform -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1.5 px-2 rounded-lg border border-slate-700 shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-30">
                        <span className="font-bold text-slate-300 block">{cam.name}</span>
                        Avg Speed: {cam.speedAvg} km/h • Vol: {cam.vehicleCount} v/m
                      </div>
                    </div>
                  ))}

                </div>
              ) : (
                /* Leaflet Map Display Mode */
                <div className="w-full h-full relative">
                  {/* Canvas container for Leaflet Map */}
                  <div ref={mapRef} className="w-full h-full z-0" />
                </div>
              )}

              {/* ── Overlay Panel: CCTV Video Drawer ── */}
              {selectedCamera && (
                <div className="absolute right-4 top-4 w-72 bg-slate-950/95 border border-slate-800 border-solid rounded-2xl shadow-2xl p-4 overflow-hidden z-20 animate-slide-in">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 border-solid pb-2">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <h4 className="text-xs font-bold text-white uppercase">{selectedCamera.name}</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedCamera(null)}
                      className="text-slate-400 hover:text-white text-xs bg-transparent border-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Simulating security video grid */}
                  <div className="w-full h-40 bg-black rounded-lg border border-slate-800 border-solid relative overflow-hidden flex items-center justify-center">
                    <div className="absolute inset-0 grid-crt-lines opacity-40" />

                    <svg className="w-full h-full opacity-60" viewBox="0 0 200 100">
                      <path d="M 100,100 L 100,50 Q 100,20 150,0" stroke="#334155" strokeWidth="24" fill="none" />
                      <path d="M 100,100 L 100,50 Q 100,20 150,0" stroke="#1e293b" strokeWidth="20" fill="none" />
                      <path d="M 100,100 L 100,50 Q 100,20 150,0" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 5" fill="none" />

                      <circle 
                        cx={100 + Math.sin(cctvFrame * 0.1) * 15} 
                        cy={80 - (cctvFrame % 60) * 1.1} 
                        r="3" 
                        fill="#38bdf8" 
                      />
                      <circle 
                        cx={100 + Math.sin((cctvFrame + 30) * 0.1) * 15} 
                        cy={80 - ((cctvFrame + 30) % 60) * 1.1} 
                        r="4" 
                        fill="#f43f5e" 
                      />
                    </svg>

                    <div className="absolute top-2 left-2 font-mono text-[9px] text-emerald-500 bg-black/60 px-1 rounded flex flex-col gap-0.5">
                      <span>REC [HD 1080P]</span>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                    
                    <div className="absolute bottom-2 right-2 font-mono text-[9px] text-emerald-500 bg-black/60 px-1 rounded">
                      FPS: 30.00
                    </div>

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-full h-px bg-emerald-500/20 top-1/2 absolute animate-pulse" />
                    </div>
                  </div>

                  {/* CCTV Telemetry stats */}
                  <div className="grid grid-cols-2 gap-2 mt-3 text-center">
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 border-solid">
                      <span className="text-[10px] text-slate-400 block">Avg Road Speed</span>
                      <span className="text-sm font-bold text-white">{selectedCamera.speedAvg} km/h</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded-xl border border-slate-800 border-solid">
                      <span className="text-[10px] text-slate-400 block">Volume Count</span>
                      <span className="text-sm font-bold text-white">{selectedCamera.vehicleCount} v/m</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-500 mt-2 text-center leading-relaxed">
                    Camera feeds are analyzed in real-time by municipal computer vision agents.
                  </p>
                </div>
              )}

              {/* ── Overlay Panel: Incident Detail Drawer ── */}
              {selectedIncident && (
                <div className="absolute right-4 bottom-4 w-72 bg-slate-900/95 border border-slate-800 border-solid rounded-2xl shadow-2xl p-4 z-20 animate-slide-in">
                  <div className="flex items-center justify-between mb-3 border-b border-slate-800 border-solid pb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${
                        selectedIncident.status === 'Resolved' ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      <h4 className="text-xs font-bold text-white uppercase font-mono">{selectedIncident.id} Details</h4>
                    </div>
                    <button 
                      onClick={() => setSelectedIncident(null)}
                      className="text-slate-400 hover:text-white text-xs bg-transparent border-none cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Location</span>
                      <span className="font-semibold text-white">{selectedIncident.location}</span>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 block">Report Summary</span>
                      <p className="text-slate-300 mt-0.5 leading-relaxed">{selectedIncident.title}</p>
                    </div>

                    <div className="flex gap-4">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Severity</span>
                        <span className={`font-semibold ${
                          selectedIncident.severity === 'Critical' ? 'text-rose-400' : selectedIncident.severity === 'Major' ? 'text-amber-400' : 'text-blue-400'
                        }`}>{selectedIncident.severity}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 block">Reported</span>
                        <span className="text-slate-300 font-semibold">{selectedIncident.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {selectedIncident.status === 'Active' && (
                        <button
                          onClick={() => handleDispatch(selectedIncident.id)}
                          className="flex-1 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg border-none cursor-pointer transition-colors"
                        >
                          Dispatch Services
                        </button>
                      )}
                      {selectedIncident.status !== 'Resolved' && (
                        <button
                          onClick={() => handleResolve(selectedIncident.id)}
                          className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-lg border-none cursor-pointer transition-colors"
                        >
                          Resolve & Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Side Panel: Incident Feed & Quick Control */}
        <div className="space-y-6 md:space-y-8 flex flex-col">
          
          {/* Active Incidents Alert Board */}
          <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col min-h-[380px]">
            <div className="mb-4">
              <h3 className="text-base font-bold text-white">Live Alert Feeds</h3>
              <p className="text-xs text-slate-400">Chronological list of street hazards</p>
            </div>

            {/* Incident Cards list container */}
            <div className="space-y-3 overflow-y-auto flex-1 max-h-[360px] pr-1">
              {incidents.filter(inc => inc.status !== 'Resolved').length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-3">
                    <IconCheck className="w-5 h-5" />
                  </div>
                  <h4 className="text-white text-xs font-bold">All Roads Operational</h4>
                  <p className="text-[10px] text-slate-500 mt-1 max-w-[160px]">
                    No active collisions, closures or delays reported on city grid.
                  </p>
                </div>
              ) : (
                incidents.filter(inc => inc.status !== 'Resolved').map((inc) => (
                  <div 
                    key={inc.id}
                    onClick={() => {
                      setSelectedIncident(inc)
                      setSelectedCamera(null)
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      selectedIncident?.id === inc.id 
                        ? 'bg-slate-800 border-slate-600 scale-[1.02]' 
                        : 'bg-slate-900/50 hover:bg-slate-850 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        inc.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' : inc.severity === 'Major' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                      }`}>
                        {inc.severity} Severity
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{inc.time}</span>
                    </div>
                    
                    <h4 className="text-xs font-bold text-white mb-1 line-clamp-2 leading-relaxed">
                      {inc.title}
                    </h4>
                    
                    <div className="flex justify-between items-center mt-3 text-[10px] text-slate-400">
                      <span>📍 {inc.location}</span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold font-mono ${
                        inc.status === 'Active' ? 'text-rose-400 bg-rose-500/5' : 'text-amber-400 bg-amber-500/5'
                      }`}>{inc.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Resolved incidents count archive banner */}
            {incidents.filter(i => i.status === 'Resolved').length > 0 && (
              <div className="mt-4 p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl text-center flex items-center justify-between text-[10px] text-emerald-400">
                <span>✓ Verified clearances today:</span>
                <span className="font-bold">{incidents.filter(i => i.status === 'Resolved').length} alerts resolved</span>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* ── Sub Panels Section: Charts & Analytics / Roadways Status grid ── */}
      <div className="glass-panel rounded-3xl overflow-hidden">
        
        {/* Sub Header Tab control */}
        <div className="px-6 py-4 bg-[#0d1a2c]/60 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex gap-4">
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                activeTab === 'analytics' ? 'border-[#00b894] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              System Analytics
            </button>
            <button 
              onClick={() => setActiveTab('roadways')}
              className={`text-sm font-bold pb-2 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
                activeTab === 'roadways' ? 'border-[#00b894] text-white' : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              Corridor Grid Status
            </button>
          </div>
          
          <div className="text-[10px] font-mono text-[#00b894] bg-[#00b894]/15 px-2.5 py-1 rounded">
            Updated live at {new Date().toLocaleTimeString()}
          </div>
        </div>

        {/* Container Body */}
        <div className="p-6 md:p-8">
          {activeTab === 'analytics' ? (
            /* Tab Content 1: System Analytics and Custom Charts */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Peak hours line graph */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Daily Congestion Index Peaks
                  </h4>
                  <p className="text-[11px] text-slate-500">Hourly congestion average over last 24 hours</p>
                </div>

                {/* Custom SVG Line Chart */}
                <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl relative h-48">
                  <svg className="w-full h-full" viewBox="0 0 400 150">
                    {/* Grid lines horizontal */}
                    <line x1="40" y1="20" x2="380" y2="20" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 4" />
                    <line x1="40" y1="60" x2="380" y2="60" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 4" />
                    <line x1="40" y1="100" x2="380" y2="100" stroke="#334155" strokeWidth="0.5" strokeDasharray="2 4" />
                    <line x1="40" y1="130" x2="380" y2="130" stroke="#475569" strokeWidth="1" />

                    {/* Line data mapping coordinates */}
                    <path 
                      d="M 40,115 L 80,48 L 130,95 L 180,80 L 240,35 L 290,75 L 340,110 L 380,122" 
                      fill="none" 
                      stroke="url(#chartGrad)" 
                      strokeWidth="3.5" 
                      strokeLinecap="round"
                    />

                    {/* Gradient Area under line */}
                    <path 
                      d="M 40,115 L 80,48 L 130,95 L 180,80 L 240,35 L 290,75 L 340,110 L 380,122 L 380,130 L 40,130 Z" 
                      fill="url(#chartFill)" 
                      opacity="0.15"
                    />

                    {/* Data Points Dots */}
                    <circle cx="80" cy="48" r="5" fill="#f59e0b" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="240" cy="35" r="5" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Axes Text labels */}
                    <text x="35" y="60" fill="#64748b" fontSize="8" textAnchor="end">50%</text>
                    <text x="35" y="100" fill="#64748b" fontSize="8" textAnchor="end">25%</text>
                    
                    <text x="80" y="142" fill="#64748b" fontSize="8" textAnchor="middle">09:00 (Peak)</text>
                    <text x="180" y="142" fill="#64748b" fontSize="8" textAnchor="middle">14:00</text>
                    <text x="240" y="142" fill="#64748b" fontSize="8" textAnchor="middle">17:00 (Peak)</text>
                    <text x="340" y="142" fill="#64748b" fontSize="8" textAnchor="middle">21:00</text>

                    {/* Defs Gradients */}
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="40%" stopColor="#f59e0b" />
                        <stop offset="70%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                      <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>

                  {/* Absolute values overlay badge */}
                  <div className="absolute top-4 right-4 bg-slate-950/70 border border-slate-800 border-solid px-2 py-1 rounded text-[10px] text-slate-300 font-mono">
                    Peak Alert: 85% Congestion
                  </div>
                </div>
              </div>

              {/* Vehicle volume composition split */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Vehicle Type Volume Composition
                  </h4>
                  <p className="text-[11px] text-slate-500">Real-time classification split via AI sensor metrics</p>
                </div>

                <div className="bg-slate-900/60 border border-slate-800 border-solid p-5 rounded-2xl relative h-48 flex flex-col justify-between">
                  <div className="space-y-3">
                    {/* Cars */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Passenger Cars & SUVs</span>
                        <span>54% (Active flow)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#42a5f5] h-full rounded-full" style={{ width: '54%' }} />
                      </div>
                    </div>

                    {/* Transit */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Municipal Buses & Electric Transit</span>
                        <span>22% (Optimized lanes)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '22%' }} />
                      </div>
                    </div>

                    {/* Heavy Cargo */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>Heavy Cargo Logistics & Trucks</span>
                        <span>14% (Restricted routing)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '14%' }} />
                      </div>
                    </div>

                    {/* EV Scooters */}
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold text-slate-300 mb-1">
                        <span>EV Scooters & Bicycles</span>
                        <span>10% (Green lane growth)</span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-purple-500 h-full rounded-full" style={{ width: '10%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Tab Content 2: City Roadways Corridor Detailed Table */
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 border-solid text-slate-400 font-semibold uppercase tracking-wider">
                    <th className="pb-3 pr-4">Roadway Corridor Segment</th>
                    <th className="pb-3 pr-4 text-center">Design speed</th>
                    <th className="pb-3 pr-4 text-center">Avg Flow Speed</th>
                    <th className="pb-3 pr-4 text-center">Status</th>
                    <th className="pb-3 pr-4 text-center">Delay</th>
                    <th className="pb-3">Action Command</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  
                  {/* Road 1 */}
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-4 pr-4 font-bold text-white flex flex-col">
                      <span>Highway 4 Expressway</span>
                      <span className="text-[10px] text-slate-500 font-normal">Sectors 12 to 18 East-West Bypass</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-slate-300">80 km/h</td>
                    <td className="py-4 pr-4 text-center font-mono font-bold text-rose-400 bg-rose-500/5">26 km/h</td>
                    <td className="py-4 pr-4 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-semibold">Heavy Congestion</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-rose-400">+18 mins</td>
                    <td className="py-4">
                      <button className="text-[10px] font-bold text-[#00b894] hover:underline bg-transparent border-none cursor-pointer">
                        Reroute Alert
                      </button>
                    </td>
                  </tr>

                  {/* Road 2 */}
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-4 pr-4 font-bold text-white flex flex-col">
                      <span>Grand Avenue Boulevard</span>
                      <span className="text-[10px] text-slate-500 font-normal">Metro Link Interchange to Central Park</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-slate-300">50 km/h</td>
                    <td className="py-4 pr-4 text-center font-mono font-bold text-amber-400 bg-amber-500/5">38 km/h</td>
                    <td className="py-4 pr-4 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">Moderate Flow</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-amber-400">+4 mins</td>
                    <td className="py-4">
                      <button className="text-[10px] font-bold text-[#00b894] hover:underline bg-transparent border-none cursor-pointer">
                        Optimize Signals
                      </button>
                    </td>
                  </tr>

                  {/* Road 3 */}
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-4 pr-4 font-bold text-white flex flex-col">
                      <span>Ring Road Outer Bypass</span>
                      <span className="text-[10px] text-slate-500 font-normal">Peripheral sector belt transit loop</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-slate-300">60 km/h</td>
                    <td className="py-4 pr-4 text-center font-mono font-bold text-emerald-400 bg-emerald-500/5">58 km/h</td>
                    <td className="py-4 pr-4 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 font-semibold">Free Flowing</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-emerald-400">Clear</td>
                    <td className="py-4">
                      <span className="text-[10px] text-slate-500 font-bold">Auto-Monitored</span>
                    </td>
                  </tr>

                  {/* Road 4 */}
                  <tr className="hover:bg-slate-900/20">
                    <td className="py-4 pr-4 font-bold text-white flex flex-col">
                      <span>Sector 15 Shopping Strip</span>
                      <span className="text-[10px] text-slate-500 font-normal">Local retail corridors - Single lane</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-slate-300">40 km/h</td>
                    <td className="py-4 pr-4 text-center font-mono font-bold text-amber-400 bg-amber-500/5">29 km/h</td>
                    <td className="py-4 pr-4 text-center">
                      <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-400 font-semibold">Moderate Flow</span>
                    </td>
                    <td className="py-4 pr-4 text-center font-mono text-amber-400">+3 mins</td>
                    <td className="py-4">
                      <button className="text-[10px] font-bold text-[#00b894] hover:underline bg-transparent border-none cursor-pointer">
                        Signal Override
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* ── Modal Dialog: Report Hazard ── */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07111e]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a1626] border border-slate-800 border-solid rounded-3xl overflow-hidden shadow-2xl relative">
            
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent" />
            
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">Report Grid Hazard</h3>
                  <p className="text-xs text-slate-500">Submit immediate roadway interruptions</p>
                </div>
                <button 
                  onClick={() => setReportModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer font-bold text-base"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleReportIncident} className="space-y-4 text-xs">
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Incident Title / Summary
                  </label>
                  <input
                    type="text"
                    required
                    value={reportTitle}
                    onChange={(e) => setReportTitle(e.target.value)}
                    placeholder="e.g. Collision blocking left-turn bypass lane"
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 border-solid focus:border-[#00b894] transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Location Description
                  </label>
                  <input
                    type="text"
                    required
                    value={reportLoc}
                    onChange={(e) => setReportLoc(e.target.value)}
                    placeholder="e.g. Highway 4 Interchange (North Junction)"
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 border-solid focus:border-[#00b894] transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Incident Category
                    </label>
                    <select
                      value={reportType}
                      onChange={(e: any) => setReportType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 border-solid focus:border-[#00b894] transition-all"
                    >
                      <option value="Accident">Accident / Collision</option>
                      <option value="Congestion">Heavy Congestion</option>
                      <option value="Construction">Roadworks / Construction</option>
                      <option value="Hazard">Debris / Animal Hazard</option>
                      <option value="Flooding">Flooding / Waterlogging</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                      Grid Severity
                    </label>
                    <select
                      value={reportSeverity}
                      onChange={(e: any) => setReportSeverity(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 border-solid focus:border-[#00b894] transition-all"
                    >
                      <option value="Minor">Minor (Delay &lt; 5 mins)</option>
                      <option value="Major">Major (Bypass lane blocked)</option>
                      <option value="Critical">Critical (Multi-lane lockup)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setReportModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-850 border border-slate-700/60 border-solid cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-rose-500 hover:bg-rose-600 border-none cursor-pointer transition-colors"
                  >
                    Submit Alert Pin
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  )
}
