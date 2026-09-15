import { useState, useEffect } from 'react'
import TrafficDashboard from './TrafficDashboard'
import EmergencyDashboard from './EmergencyDashboard'
import ComplaintPage from './ComplaintPage'
import NewsPanel from './components/NewsPanel'
import NewsAdminPanel from './components/NewsAdminPanel'
import WeatherDashboard from './components/WeatherDashboard'
import SettingsPage from './SettingsPage'
import Chatbot from './components/Chatbot'

// ── Icons ─────────────────────────────────────────────────────────────────────
function IconDashboard({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="9" />
      <rect x="14" y="3" width="7" height="5" />
      <rect x="14" y="12" width="7" height="9" />
      <rect x="3" y="16" width="7" height="5" />
    </svg>
  )
}

function IconComplaint({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconEmergency({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  )
}

function IconNews({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <line x1="16" y1="9" x2="16.01" y2="9" />
      <line x1="8" y1="9" x2="12" y2="9" />
      <line x1="8" y1="13" x2="16" y2="13" />
    </svg>
  )
}

function IconWeather({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
      <circle cx="12" cy="12" r="4" />
    </svg>
  )
}

function IconSettings({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconLogOut({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function IconPlus({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  )
}




function IconBell({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconGridDashboard({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconMenu({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  )
}

function IconX({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function IconTraffic({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="3" width="12" height="18" rx="2" />
      <circle cx="12" cy="8" r="2" fill="currentColor" />
      <circle cx="12" cy="13" r="2" fill="currentColor" />
      <circle cx="12" cy="18" r="2" fill="currentColor" />
      <path d="M6 8h12M6 13h12M6 18h12" strokeWidth="1" opacity="0.3" />
    </svg>
  )
}

interface DashboardPageProps {
  onLogout: () => void
  onComplaint?: () => void
  requestLocation?: () => Promise<boolean>
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  // User Session State
  const [currentUser, setCurrentUser] = useState<{
    fullName: string
    email: string
    phone: string
    profileImage?: string | null
    role?: string
    address?: string
    password?: string
  }>(() => {
    // Load user from localStorage immediately so no flash of wrong user
    try {
      const stored = localStorage.getItem('scm_current_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.fullName) return parsed
      }
    } catch (e) {}
    return { fullName: 'Rohan Sharma', email: 'rohan@example.com', phone: '+91 98765 43210', profileImage: null }
  })

  // Theme State
  const [theme, setTheme] = useState(() => localStorage.getItem('scm_settings_theme') || 'dark')

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme')
    } else {
      document.documentElement.classList.remove('light-theme')
    }
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    localStorage.setItem('scm_settings_theme', newTheme)
  }

  // Bug Fix: isAdmin was computed before the useEffect below loaded the real user from localStorage.
  // Moving it here ensures it always reflects the current loaded user on every render.
  const isAdmin = currentUser.role === 'admin' || currentUser.email === 'admin@municipality.gov'

  useEffect(() => {
    const userStr = localStorage.getItem('scm_current_user')
    if (userStr) {
      try {
        const parsed = JSON.parse(userStr)
        if (parsed && parsed.fullName) {
          setCurrentUser(parsed)
        }
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const getInitials = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'U'
  }

  const getFirstName = (name: string) => {
    return name.trim().split(/\s+/)[0] || 'User'
  }

  // Sidebar State — persisted so refresh stays on same tab
  const [activeTab, setActiveTabRaw] = useState(() => {
    return localStorage.getItem('scm_last_tab') || 'Dashboard'
  })
  const setActiveTab = (tab: string) => {
    localStorage.setItem('scm_last_tab', tab)
    setActiveTabRaw(tab)
  }
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [timeString, setTimeString] = useState('')
  const [notification, setNotification] = useState<string | null>(null)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Weather Widget State
  const [widgetWeather, setWidgetWeather] = useState<any>(null)
  const [widgetLoading, setWidgetLoading] = useState(true)
  const [widgetError, setWidgetError] = useState<string | null>(null)

  useEffect(() => {
    const loadWidgetWeather = async () => {
      setWidgetLoading(true)
      setWidgetError(null)
      try {
        let url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`/api/weather'
        const coordsStr = localStorage.getItem('scm_location_coords')
        if (coordsStr) {
          const coords = JSON.parse(coordsStr)
          if (coords && coords.lat !== undefined && coords.lng !== undefined) {
            url += `?lat=${coords.lat}&lon=${coords.lng}`
          }
        }
        const response = await fetch(url)
        const result = await response.json()
        if (result.success) {
          setWidgetWeather(result.data)
        } else {
          setWidgetError(result.message)
        }
      } catch (err: any) {
        console.error('Widget weather fetch error:', err)
        setWidgetError('Service unavailable')
      } finally {
        setWidgetLoading(false)
      }
    }
    
    if (activeTab === 'Dashboard') {
      loadWidgetWeather()
    }
  }, [activeTab])

  // Location Permission State
  const [showLocationPrompt, setShowLocationPrompt] = useState(false)

  useEffect(() => {
    const permission = localStorage.getItem('scm_location_permission')
    if (!permission) {
      setShowLocationPrompt(true)
    }
  }, [])

  const handleAllowLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locData = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          }
          localStorage.setItem('scm_location_coords', JSON.stringify(locData))
          localStorage.setItem('scm_location_permission', 'granted')
          setShowLocationPrompt(false)
          setNotification('📍 Location services enabled successfully!')
          setTimeout(() => setNotification(null), 3000)
        },
        (error) => {
          console.error(error)
          localStorage.setItem('scm_location_permission', 'denied')
          setShowLocationPrompt(false)
          setNotification('⚠️ Location permission denied by browser.')
          setTimeout(() => setNotification(null), 3000)
        }
      )
    } else {
      setNotification('⚠️ Geolocation is not supported by your browser.')
      setTimeout(() => setNotification(null), 3000)
      setShowLocationPrompt(false)
    }
  }

  const handleDeclineLocation = () => {
    localStorage.setItem('scm_location_permission', 'dismissed')
    setShowLocationPrompt(false)
  }
  
  // Complaint Modal State
  const [complaintModalOpen, setComplaintModalOpen] = useState(false)
  const [complaintTitle, setComplaintTitle] = useState('')
  const [complaintCategory, setComplaintCategory] = useState('Sanitation')
  const [complaintDesc, setComplaintDesc] = useState('')

  // Lists State
  const [complaints, setComplaints] = useState<any[]>([])
  const [activities, setActivities] = useState<any[]>([])
  const [newsFeed, setNewsFeed] = useState<any[]>([])

  useEffect(() => {
    // Load or initialize complaints
    const storedComplaints = localStorage.getItem('scm_complaints')
    if (storedComplaints) {
      try { setComplaints(JSON.parse(storedComplaints)) } catch(e) {}
    } else {
      const initialComplaints = [
        { id: '#3842', title: 'Streetlight malfunction in Sector 15', status: 'Pending', category: 'Electrical', date: '2026-07-15' },
        { id: '#3811', title: 'Pothole on Central Main Road', status: 'Resolved', category: 'Roads & Infra', date: '2026-07-12' },
        { id: '#3790', title: 'Garbage pile collection delay near park', status: 'Resolved', category: 'Sanitation', date: '2026-07-09' },
      ]
      setComplaints(initialComplaints)
      localStorage.setItem('scm_complaints', JSON.stringify(initialComplaints))
    }

    // Load or initialize activities
    const storedActivities = localStorage.getItem('scm_activities')
    if (storedActivities) {
      try { setActivities(JSON.parse(storedActivities)) } catch(e) {}
    } else {
      const initialActivities = [
        { action: 'Filed a complaint #3842 (Streetlight malfunction)', time: 'Yesterday' },
        { action: 'Paid water tax utility bill online', time: '3 days ago' },
        { action: 'Subscribed to Municipal SmartCityOS updates', time: '1 week ago' },
        { action: 'Updated profile contact number', time: '1 week ago' },
      ]
      setActivities(initialActivities)
      localStorage.setItem('scm_activities', JSON.stringify(initialActivities))
    }

    // Fetch News Feed
    const fetchNews = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`/api/news')
        const data = await res.json()
        if (data.success && data.data) {
          setNewsFeed(data.data.slice(0, 2))
          return
        }
      } catch (e) {}
      
      const stored = localStorage.getItem('scm_news_db')
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          setNewsFeed(parsed.filter((n: any) => n.published).slice(0, 2))
        } catch (e) {}
      }
    }
    fetchNews()
  }, [])

  // Update real-time clock
  useEffect(() => {
    const updateTime = () => {
      const date = new Date()
      setTimeString(date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      }) + ' • ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }))
    }
    updateTime()
    // Bug Fix: was 60000 (1 minute) — initial display was stale until next minute tick
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Emergency dialing simulation
  const handleCallEmergency = (service: string, number: string) => {
    setNotification(`Simulating call: Dialing ${service} (${number})...`)
    setTimeout(() => setNotification(null), 3000)
  }

  // Handle complaint submission
  const handleSubmitComplaint = (e: React.FormEvent) => {
    e.preventDefault()
    if (!complaintTitle || !complaintDesc) return

    const newId = `#${Math.floor(1000 + Math.random() * 9000)}`
    const newComplaint = {
      id: newId,
      title: complaintTitle,
      status: 'Pending',
      category: complaintCategory,
      date: new Date().toISOString().split('T')[0]
    }

    const updatedComplaints = [newComplaint, ...complaints]
    setComplaints(updatedComplaints)
    localStorage.setItem('scm_complaints', JSON.stringify(updatedComplaints))

    const updatedActivities = [
      { action: `Filed a complaint ${newId} (${complaintTitle})`, time: 'Just now' },
      ...activities
    ]
    setActivities(updatedActivities)
    localStorage.setItem('scm_activities', JSON.stringify(updatedActivities))

    // Reset inputs
    setComplaintTitle('')
    setComplaintDesc('')
    setComplaintModalOpen(false)
    setNotification(`Complaint ${newId} filed successfully!`)
    setTimeout(() => setNotification(null), 4000)
  }

  // Derived stats
  const pendingCount = complaints.filter(c => c.status === 'Pending' || ['submitted', 'assigned', 'in_progress'].includes(c.status)).length
  const resolvedCount = complaints.filter(c => c.status === 'Resolved' || ['resolved', 'closed'].includes(c.status)).length
  const totalCount = complaints.length

  const sidebarLinks = [
    { name: 'Dashboard', icon: IconDashboard,  emoji: '🏠', desc: 'Overview' },
    { name: 'Traffic',   icon: IconTraffic,    emoji: '🚦', desc: 'Live roads' },
    { name: 'Complaints',icon: IconComplaint,  emoji: '📋', desc: 'Grievances' },
    { name: 'Emergency', icon: IconEmergency,  emoji: '🚨', desc: 'SOS & Dial' },
    { name: 'News',      icon: IconNews,       emoji: '📰', desc: 'City updates' },
    { name: 'Weather',   icon: IconWeather,    emoji: '🌤️', desc: 'Forecast' },
    { name: 'Settings',  icon: IconSettings,   emoji: '⚙️', desc: 'Account' },
  ]

  return (
    <div className="h-screen w-full bg-[var(--background)] text-slate-100 flex flex-col md:flex-row relative overflow-hidden animate-gradient-xy" style={{ backgroundImage: 'radial-gradient(circle at 15% 50%, rgba(0, 184, 148, 0.08), transparent 40%), radial-gradient(circle at 85% 30%, rgba(66, 165, 245, 0.08), transparent 40%)' }}>
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-5 right-5 z-50 p-4 bg-[#00b894] text-white font-semibold rounded-xl shadow-2xl flex items-center gap-2 animate-fade-in border border-[#00d6ac]">
          <span className="w-2 h-2 bg-white rounded-full animate-ping" />
          {notification}
        </div>
      )}

      {/* ── Location Permission Modal ── */}
      {showLocationPrompt && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4"
          style={{ background: 'rgba(5,12,25,0.82)', backdropFilter: 'blur(8px)' }}
        >
          <div
            className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-700/60"
            style={{ background: 'linear-gradient(145deg, #0d1b2e 0%, #0a1422 100%)' }}
          >
            {/* Top accent bar */}
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #00b894, #42a5f5, #00b894)' }} />

            <div className="p-8">
              {/* Animated Location Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  {/* Outer pulsing rings */}
                  <span className="absolute inset-0 rounded-full bg-[#00b894]/20 animate-ping" style={{ width: 72, height: 72, left: -4, top: -4 }} />
                  <span className="absolute inset-0 rounded-full bg-[#00b894]/10 animate-ping" style={{ width: 88, height: 88, left: -12, top: -12, animationDelay: '0.3s' }} />
                  {/* Icon container */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                    style={{ background: 'linear-gradient(135deg, rgba(0,184,148,0.2), rgba(66,165,245,0.15))', border: '1.5px solid rgba(0,184,148,0.4)' }}
                  >
                    <svg className="w-8 h-8 text-[#00b894]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Headline */}
              <div className="text-center mb-5">
                <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Enable Location Services
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">
                  SmartCityOS uses your location to auto-fill complaint addresses, show nearby incidents on the traffic grid, and improve civic service accuracy.
                </p>
              </div>

              {/* Use-cases */}
              <div className="space-y-2.5 mb-6">
                {[
                  { icon: '📋', label: 'Complaints', desc: 'Auto-fill your current location when filing a grievance' },
                  { icon: '🚦', label: 'Traffic Grid', desc: 'See incidents and alerts nearest to you' },
                  { icon: '🌦️', label: 'Weather & AQI', desc: 'Get hyperlocal air quality and forecast alerts' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
                  >
                    <span className="text-lg flex-shrink-0">{item.icon}</span>
                    <div>
                      <span className="text-xs font-semibold text-white block">{item.label}</span>
                      <span className="text-[11px] text-slate-500">{item.desc}</span>
                    </div>
                    <svg className="w-4 h-4 text-[#00b894] ml-auto flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ))}
              </div>

              {/* Privacy note */}
              <div className="flex items-start gap-2 mb-6 px-3 py-2.5 rounded-xl"
                style={{ background: 'rgba(66,165,245,0.06)', border: '1px solid rgba(66,165,245,0.12)' }}
              >
                <svg className="w-4 h-4 text-[#42a5f5] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <p className="text-[11px] text-[#42a5f5] leading-relaxed">
                  Your location is stored locally on your device only. It is never shared with third parties.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDeclineLocation}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer border-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  Not Now
                </button>
                <button
                  onClick={handleAllowLocation}
                  className="flex-1 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:opacity-90 hover:scale-[1.02] flex items-center justify-center gap-2"
                  style={{ background: 'linear-gradient(135deg, #00b894, #00a381)' }}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Allow Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'rgba(5,15,30,0.75)', backdropFilter: 'blur(6px)' }}
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="rounded-3xl p-8 w-full max-w-sm mx-4 border border-slate-700/80 shadow-2xl"
            style={{ background: 'rgba(10, 22, 38, 0.97)' }}
            onClick={e => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="flex items-center justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
                <svg className="w-8 h-8 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>

            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Logout Confirmation</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Are you sure you want to logout from
              </p>
              <p className="text-[#00b894] font-semibold mt-1">{currentUser.fullName}'s account?</p>
            </div>

            {/* User card mini */}
            <div className="flex items-center gap-3 bg-slate-800/50 rounded-2xl px-4 py-3 mb-6 border border-slate-700/40">
              <div className="w-10 h-10 rounded-xl border border-[#42a5f5]/30 overflow-hidden flex items-center justify-center font-bold text-[#42a5f5] bg-[#42a5f5]/20 flex-shrink-0 text-sm">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{currentUser.fullName}</div>
                <div className="text-xs text-slate-500">{currentUser.email}</div>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 bg-slate-800/50 hover:bg-slate-700/60 hover:text-white transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutModal(false)
                  onLogout()
                }}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Top Navbar */}
      <div className="md:hidden flex items-center justify-between bg-[#0a1626] border-b border-slate-800 px-6 py-4 z-40 w-full">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#07111e] border border-slate-700">
            <IconGridDashboard className="w-4 h-4 text-[#00b894]" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight">
            SmartCity<span className="text-[#00b894]">OS</span>
          </span>
        </div>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer"
        >
          {sidebarOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:sticky top-0 left-0 h-screen w-64 glass-panel border-r border-slate-800/80 flex flex-col justify-between p-6 z-30 transition-transform duration-300 md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Logo */}
          <div className="hidden md:flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#07111e] border border-slate-700">
              <IconGridDashboard className="w-4 h-4 text-[#00b894]" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              SmartCity<span className="text-[#00b894]">OS</span>
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link, idx) => {
              const active = activeTab === link.name
              return (
                <button
                  key={link.name}
                  onClick={() => {
                    setActiveTab(link.name)
                    setSidebarOpen(false)
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-none text-left cursor-pointer group relative overflow-hidden ${
                    active
                      ? 'text-[#00b894]'
                      : 'text-slate-400 hover:text-slate-100'
                  }`}
                  style={{
                    background: active
                      ? 'linear-gradient(90deg, rgba(0,184,148,0.18), rgba(0,184,148,0.06))'
                      : undefined,
                    boxShadow: active ? 'inset 0 0 0 1px rgba(0,184,148,0.2)' : undefined,
                    animationDelay: `${idx * 60}ms`,
                  }}
                >
                  {/* Active left bar */}
                  {active && (
                    <span
                      className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full"
                      style={{ background: 'linear-gradient(to bottom, #00b894, #42a5f5)' }}
                    />
                  )}

                  {/* Hover shimmer */}
                  <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.03), rgba(255,255,255,0.06), rgba(255,255,255,0.03))' }} />

                  {/* Emoji badge */}
                  <span
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0 transition-all duration-300 ${
                      active ? 'scale-110' : 'group-hover:scale-105'
                    }`}
                    style={{
                      background: active
                        ? 'linear-gradient(135deg, rgba(0,184,148,0.25), rgba(66,165,245,0.15))'
                        : 'rgba(255,255,255,0.05)',
                      border: active ? '1px solid rgba(0,184,148,0.35)' : '1px solid rgba(255,255,255,0.07)',
                      boxShadow: active ? '0 2px 8px rgba(0,184,148,0.25)' : undefined,
                    }}
                  >
                    {link.emoji}
                  </span>

                  {/* Label + desc */}
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-semibold leading-tight transition-colors ${
                      active ? 'text-[#00b894]' : 'text-slate-300 group-hover:text-white'
                    }`}>
                      {link.name}
                    </div>
                    <div className="text-[10px] text-slate-600 font-medium leading-tight mt-0.5">
                      {link.desc}
                    </div>
                  </div>

                  {/* Active arrow */}
                  {active && (
                    <span className="text-[#00b894] text-xs opacity-80">›</span>
                  )}
                </button>
              )
            })}
          </nav>
        </div>

        {/* User Card & Logout */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl border border-[#42a5f5]/30 overflow-hidden flex items-center justify-center font-bold text-[#42a5f5] bg-[#42a5f5]/20 flex-shrink-0">
              {currentUser.profileImage ? (
                <img src={currentUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                getInitials(currentUser.fullName)
              )}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">{currentUser.fullName}</div>
              <div className="text-xs text-slate-500 font-medium">Citizen Account</div>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors border-none bg-transparent text-left cursor-pointer"
          >
            <IconLogOut className="w-5 h-5 text-rose-400" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header (Desktop) */}
        <header className="hidden md:flex items-center justify-between border-b border-slate-800/80 px-8 py-5 glass-panel">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-400 uppercase tracking-widest font-mono">
              Online
            </span>
            <span className="text-xs text-slate-500 font-medium">
              {timeString}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={toggleTheme} className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border-none cursor-pointer">
              {theme === 'dark' ? (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>
            <button className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/50 hover:bg-slate-800 border-none cursor-pointer">
              <IconBell className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-800" />
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-slate-700 bg-slate-800/40 flex items-center justify-center text-xs text-[#00b894] font-semibold flex-shrink-0">
                {currentUser.profileImage ? (
                  <img src={currentUser.profileImage} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  getInitials(currentUser.fullName)
                )}
              </div>
              <span className="text-sm text-slate-300">
                Welcome back, <span className="font-semibold text-white">{getFirstName(currentUser.fullName)}</span>
              </span>
            </div>
          </div>
        </header>

        {/* Dashboard Content Container */}
        <main className="p-6 md:p-8 space-y-8 flex-1 overflow-y-auto w-full">
          <div className="max-w-7xl w-full mx-auto space-y-8">
          {activeTab === 'Dashboard' && (
            <>
              {/* Welcome Card */}
          <div className="glass-card relative rounded-3xl p-6 md:p-8 border-l-4 border-l-[#00b894] overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-radial-gradient from-[#00b894]/10 to-transparent rounded-full pointer-events-none" />
            <div className="relative space-y-4">
              <div>
                <span className="text-[#00b894] font-semibold text-sm uppercase tracking-wider block mb-1">Citizen Portal</span>
                <h1 className="text-3xl font-bold text-white tracking-tight">Namaste, {currentUser.fullName}</h1>
              </div>
              <p className="text-slate-400 max-w-xl text-sm leading-relaxed">
                Welcome to your dashboard. From here, you can file utility complaints, contact emergency networks, check local weather advisories, and read recent developmental news updates about Sector 15.
              </p>
              {/* Bug Fix: py-1.8 is not a valid Tailwind class → replaced with py-1.5 */}
              <div className="flex flex-wrap gap-4 text-xs font-medium">
                <div className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  AQI Index: 42 (Good)
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-[#42a5f5]">
                  Municipal Water Tax: Paid
                </div>
                <div className="px-3.5 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400">
                  Power Grid: Stable
                </div>
              </div>
            </div>
          </div>

          {/* Grid Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            
            {/* Left Col - 2 spans on large screens */}
            <div className="lg:col-span-2 flex flex-col gap-6 md:gap-8">
              
              {/* Complaint Status Widget */}
              <div className="glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-white">Your Complaints</h3>
                    <p className="text-xs text-slate-500">Track and monitor filed complaints</p>
                  </div>
                  <button 
                    onClick={() => setComplaintModalOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#00b894] text-white text-xs font-semibold rounded-xl hover:bg-[#00a381] transition-colors border-none cursor-pointer"
                  >
                    <IconPlus className="w-3.5 h-3.5" />
                    New Complaint
                  </button>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-slate-800/30 border border-slate-800 p-4 rounded-2xl text-center">
                    <div className="text-xs text-slate-400 font-medium mb-1">Total Filed</div>
                    <div className="text-2xl font-bold text-white">{totalCount}</div>
                  </div>
                  <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl text-center">
                    <div className="text-xs text-amber-400/80 font-medium mb-1">Pending</div>
                    <div className="text-2xl font-bold text-amber-400">{pendingCount}</div>
                  </div>
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl text-center">
                    <div className="text-xs text-emerald-400/80 font-medium mb-1">Resolved</div>
                    <div className="text-2xl font-bold text-emerald-400">{resolvedCount}</div>
                  </div>
                </div>

                {/* Complaints List */}
                <div className="space-y-3.5">
                  {complaints.map((c) => {
                    const isResolved = c.status === 'Resolved' || ['resolved', 'closed'].includes(c.status)
                    const displayStatus = isResolved ? 'Resolved' : 'Pending'
                    const displayDate = c.date || (c.submittedAt ? new Date(c.submittedAt).toISOString().split('T')[0] : '')
                    return (
                    <div 
                      key={c.id} 
                      className="flex items-center justify-between p-4 bg-slate-800/20 hover:bg-slate-800/30 border border-slate-800/50 rounded-2xl transition-colors"
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold font-mono text-[#00b894]">{c.id}</span>
                          <span className="text-slate-500 font-medium">•</span>
                          <span className="text-xs text-slate-400 font-medium capitalize">{c.category}</span>
                        </div>
                        <h4 className="text-sm font-semibold text-white truncate">{c.title}</h4>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-500">{displayDate}</span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                          isResolved 
                            ? 'bg-emerald-500/10 text-emerald-400' 
                            : 'bg-amber-500/10 text-amber-400'
                        }`}>
                          {displayStatus}
                        </span>
                      </div>
                    </div>
                  )})}
                </div>
              </div>

              {/* City News Feed */}
              <div className="glass-card rounded-3xl p-6 flex-1 flex flex-col">
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-white">City News Feed</h3>
                  <p className="text-xs text-slate-500">Official Municipal notices and updates</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                  {newsFeed.length > 0 ? newsFeed.map((news, idx) => (
                    <div key={news.id || idx} className="bg-slate-800/20 border border-slate-800/50 p-5 rounded-2xl hover:border-slate-700 transition-colors flex flex-col justify-between h-full">
                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded ${idx % 2 === 0 ? 'bg-blue-500/10 text-blue-400' : 'bg-emerald-500/10 text-emerald-400'} font-medium`}>
                            {news.category || 'Update'}
                          </span>
                          <span className="text-xs text-slate-500">
                            {news.publishDate ? new Date(news.publishDate).toLocaleDateString() : 'Recent'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white mb-2 leading-snug">{news.title}</h4>
                        <p className="text-xs text-slate-400 line-clamp-2">
                          {news.excerpt || news.content}
                        </p>
                      </div>
                      <button onClick={() => setActiveTab('News')} className={`text-xs font-semibold ${idx % 2 === 0 ? 'text-blue-400 hover:text-blue-300' : 'text-[#00b894] hover:text-[#00a381]'} mt-4 border-none bg-transparent text-left cursor-pointer p-0`}>
                        Read full release →
                      </button>
                    </div>
                  )) : (
                    <div className="col-span-1 md:col-span-2 py-8 text-center text-slate-500 text-sm">
                      No recent news available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col - Widgets & Emergency info */}
            <div className="space-y-6 md:space-y-8">
              
              {/* Weather Widget */}
              <div className="glass-card rounded-3xl p-6 overflow-hidden relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Weather Forecast</h3>
                    <p className="text-xs text-slate-500">
                      {widgetWeather ? `${widgetWeather.cityName} Realtime Info` : 'Live Municipal Weather'}
                    </p>
                  </div>
                  {/* Bug Fix: py-0.8 is not a valid Tailwind class → replaced with py-1 */}
                  <span className="text-xs font-medium text-[#42a5f5] bg-[#42a5f5]/10 px-2.5 py-1 rounded-full border border-[#42a5f5]/20">
                    Monitored Live
                  </span>
                </div>

                {widgetLoading ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-slate-800/80" />
                    <div className="w-24 h-4 rounded bg-slate-800/80" />
                  </div>
                ) : widgetWeather ? (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://openweathermap.org/img/wn/${widgetWeather.current.icon}@2x.png`}
                          alt={widgetWeather.current.condition}
                          className="w-12 h-12"
                        />
                        <div>
                          <div className="text-3xl font-extrabold text-white">{widgetWeather.current.temp}°C</div>
                          <div className="text-xs text-slate-400 font-medium capitalize">{widgetWeather.current.conditionDesc}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-400">Humidity: <span className="text-white font-medium">{widgetWeather.current.humidity}%</span></div>
                        <div className="text-xs text-slate-400">Wind: <span className="text-white font-medium">{widgetWeather.current.windSpeed} km/h</span></div>
                      </div>
                    </div>

                    {/* 3 Day Forecast Preview */}
                    {widgetWeather.daily && widgetWeather.daily.length > 0 && (
                      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-slate-800">
                        {widgetWeather.daily.slice(0, 3).map((d: any, idx: number) => (
                          <div key={idx} className="text-center bg-slate-800/10 p-2.5 rounded-xl border border-slate-800/40">
                            <div className="text-[10px] text-slate-500 font-semibold uppercase">{idx === 0 ? 'Tomorrow' : d.day}</div>
                            <div className="text-xs font-bold text-white mt-1">{d.tempMax}°C</div>
                            <div className="text-[9px] text-[#42a5f5] mt-0.5 truncate capitalize">{d.condition}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="py-4 text-center">
                    <p className="text-xs text-slate-400">{widgetError || 'Weather data unavailable'}</p>
                  </div>
                )}

                {/* View Forecast Action Button */}
                <button
                  onClick={() => setActiveTab('Weather')}
                  className="w-full mt-4 py-2.5 bg-[#00b894]/10 hover:bg-[#00b894]/20 border border-[#00b894]/30 text-[#00b894] text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 text-center flex items-center justify-center gap-1.5"
                >
                  <span>View Full Weather & Forecast</span>
                  <span>→</span>
                </button>
              </div>

              {/* Emergency Contacts */}
              <div className="bg-[#0a1626]/80 rounded-3xl p-6 border border-slate-800">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-rose-400">Emergency Contacts</h3>
                  <p className="text-xs text-slate-500">Instant dial municipal crisis networks</p>
                </div>

                <div className="space-y-3">
                  {/* Police */}
                  <div className="flex items-center justify-between p-3.5 bg-rose-500/5 hover:bg-rose-500/8 border border-rose-500/10 rounded-2xl transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">Police Department</h4>
                      <p className="text-xs text-slate-500">General Security Help</p>
                    </div>
                    <button 
                      onClick={() => handleCallEmergency('Police Department', '100')}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                    >
                      Call 100
                    </button>
                  </div>

                  {/* Fire */}
                  <div className="flex items-center justify-between p-3.5 bg-rose-500/5 hover:bg-rose-500/8 border border-rose-500/10 rounded-2xl transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">Fire Control Room</h4>
                      <p className="text-xs text-slate-500">Fire & Hazard Emergencies</p>
                    </div>
                    <button 
                      onClick={() => handleCallEmergency('Fire Control Room', '101')}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                    >
                      Call 101
                    </button>
                  </div>

                  {/* Ambulance */}
                  <div className="flex items-center justify-between p-3.5 bg-rose-500/5 hover:bg-rose-500/8 border border-rose-500/10 rounded-2xl transition-colors">
                    <div>
                      <h4 className="text-sm font-bold text-white">Medical & Ambulance</h4>
                      <p className="text-xs text-slate-500">Trauma & Medical Escort</p>
                    </div>
                    <button 
                      onClick={() => handleCallEmergency('Medical & Ambulance Service', '102')}
                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold rounded-xl border-none cursor-pointer transition-colors"
                    >
                      Call 102
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div className="bg-[#0a1626]/80 rounded-3xl p-6 border border-slate-800">
                <div className="mb-5">
                  <h3 className="text-lg font-bold text-white">Recent Activities</h3>
                  <p className="text-xs text-slate-500">Logs of recent transactions & updates</p>
                </div>

                <div className="space-y-4">
                  {activities.map((a, i) => (
                    <div key={i} className="flex gap-3 text-xs leading-normal">
                      <div className="relative flex flex-col items-center">
                        <span className="w-2.5 h-2.5 bg-[#00b894] rounded-full border-2 border-[#07111e] z-10" />
                        {i < activities.length - 1 && <span className="w-px flex-1 bg-slate-800 my-1" />}
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-300 font-medium">{a.action}</p>
                        <span className="text-[10px] text-slate-500 mt-0.5 block">{a.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

          {/* ── Bottom Section: Charts + Activity Feed ── */}
          <div className="space-y-6">

            {/* Section Header */}
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 rounded-full bg-gradient-to-b from-[#00b894] to-[#42a5f5]" />
              <h2 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>City Analytics & Live Feed</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#00b894]/10 text-[#00b894] border border-[#00b894]/20 uppercase tracking-wider">Live</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* ── Chart 1: Monthly Complaints Bar Chart ── */}
              <div className="lg:col-span-2 glass-card rounded-3xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-bold text-white">Complaint Trends</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Monthly complaints filed vs resolved — last 6 months</p>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium">
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-[#42a5f5] inline-block" />Filed</span>
                    <span className="flex items-center gap-1.5 text-slate-400"><span className="w-2.5 h-2.5 rounded-sm bg-[#00b894] inline-block" />Resolved</span>
                  </div>
                </div>

                {/* Bar Chart */}
                <div className="flex items-end gap-3 h-44 px-2">
                  {[
                    { month: 'Mar', filed: 28, resolved: 22 },
                    { month: 'Apr', filed: 35, resolved: 30 },
                    { month: 'May', filed: 42, resolved: 38 },
                    { month: 'Jun', filed: 31, resolved: 28 },
                    { month: 'Jul', filed: 48, resolved: 40 },
                    { month: 'Aug', filed: totalCount + 12, resolved: resolvedCount + 8 },
                  ].map((d, i) => {
                    const maxVal = 60
                    const filedH = Math.round((d.filed / maxVal) * 100)
                    const resolvedH = Math.round((d.resolved / maxVal) * 100)
                    return (
                      <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                        <div className="w-full flex items-end gap-1 h-36">
                          {/* Filed bar */}
                          <div className="flex-1 rounded-t-lg transition-all duration-700 relative group"
                            style={{ height: `${filedH}%`, background: 'linear-gradient(180deg, #42a5f5 0%, rgba(66,165,245,0.4) 100%)', animationDelay: `${i * 80}ms` }}>
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#42a5f5] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1.5 py-0.5 rounded whitespace-nowrap">{d.filed}</div>
                          </div>
                          {/* Resolved bar */}
                          <div className="flex-1 rounded-t-lg transition-all duration-700 relative group"
                            style={{ height: `${resolvedH}%`, background: 'linear-gradient(180deg, #00b894 0%, rgba(0,184,148,0.4) 100%)', animationDelay: `${i * 80 + 40}ms` }}>
                            <div className="absolute -top-7 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#00b894] opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 px-1.5 py-0.5 rounded whitespace-nowrap">{d.resolved}</div>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold">{d.month}</span>
                      </div>
                    )
                  })}
                </div>

                {/* X-axis baseline */}
                <div className="h-px bg-slate-800 mt-1 mx-2" />

                {/* Summary Stats below chart */}
                <div className="grid grid-cols-3 gap-3 mt-5">
                  {[
                    { label: 'Avg Response', value: '2.3 days', color: '#42a5f5', icon: '⏱' },
                    { label: 'Resolution Rate', value: '84%', color: '#00b894', icon: '✅' },
                    { label: 'Top Category', value: 'Roads', color: '#f59e0b', icon: '🏗' },
                  ].map(s => (
                    <div key={s.label} className="bg-slate-800/20 border border-slate-800/50 rounded-2xl p-3.5 flex items-center gap-3">
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <div className="text-[10px] text-slate-500 font-medium">{s.label}</div>
                        <div className="text-sm font-bold" style={{ color: s.color }}>{s.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Chart 2: City Health Donut ── */}
              <div className="glass-card rounded-3xl p-6 flex flex-col">
                <div className="mb-5">
                  <h3 className="text-base font-bold text-white">City Health Score</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Sector 15 — Composite Index</p>
                </div>

                {/* SVG Donut Chart */}
                <div className="flex justify-center my-2">
                  <div className="relative w-36 h-36">
                    <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                      {/* Background ring */}
                      <circle cx="60" cy="60" r="46" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                      {/* Segment 1: Infrastructure 78% */}
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#42a5f5" strokeWidth="14"
                        strokeDasharray={`${0.78 * 289} ${289}`} strokeDashoffset="0" strokeLinecap="round" />
                      {/* Segment 2: Environment 65% */}
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#00b894" strokeWidth="14"
                        strokeDasharray={`${0.65 * 289} ${289}`} strokeDashoffset={`${-(0.78 * 289)}`} strokeLinecap="round" />
                      {/* Segment 3: Safety 91% */}
                      <circle cx="60" cy="60" r="46" fill="none" stroke="#f59e0b" strokeWidth="14"
                        strokeDasharray={`${0.91 * 289} ${289}`} strokeDashoffset={`${-((0.78 + 0.65) * 289)}`} strokeLinecap="round" />
                    </svg>
                    {/* Center label */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-2xl font-extrabold text-white">78</div>
                      <div className="text-[9px] text-slate-400 font-semibold uppercase tracking-wide">/ 100</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="space-y-3 mt-3 flex-1">
                  {[
                    { label: 'Infrastructure', value: 78, color: '#42a5f5' },
                    { label: 'Environment', value: 65, color: '#00b894' },
                    { label: 'Safety', value: 91, color: '#f59e0b' },
                  ].map(item => (
                    <div key={item.label}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                        <span className="text-xs font-bold" style={{ color: item.color }}>{item.value}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${item.value}%`, background: item.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── Activity & Notification Feed ── */}
            <div className="glass-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-base font-bold text-white">Activity & Notification Feed</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time civic events, alerts & system updates</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-[#00b894] rounded-full animate-ping" />
                  <span className="text-xs text-[#00b894] font-semibold">Live</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  {
                    type: 'alert',
                    icon: '🚨',
                    iconBg: 'rgba(239,68,68,0.12)',
                    iconBorder: 'rgba(239,68,68,0.25)',
                    badge: 'Emergency',
                    badgeColor: '#ef4444',
                    badgeBg: 'rgba(239,68,68,0.1)',
                    title: 'Water main burst reported on MG Road',
                    desc: 'Municipal repair crew dispatched. Estimated restoration: 3 hrs.',
                    time: '4 min ago',
                  },
                  {
                    type: 'info',
                    icon: '🚦',
                    iconBg: 'rgba(66,165,245,0.12)',
                    iconBorder: 'rgba(66,165,245,0.25)',
                    badge: 'Traffic',
                    badgeColor: '#42a5f5',
                    badgeBg: 'rgba(66,165,245,0.1)',
                    title: 'Heavy congestion on NH-48 near Toll Plaza',
                    desc: 'Alternate route via Ring Road suggested. Delay: ~22 min.',
                    time: '11 min ago',
                  },
                  {
                    type: 'success',
                    icon: '✅',
                    iconBg: 'rgba(0,184,148,0.12)',
                    iconBorder: 'rgba(0,184,148,0.25)',
                    badge: 'Resolved',
                    badgeColor: '#00b894',
                    badgeBg: 'rgba(0,184,148,0.1)',
                    title: 'Streetlight repairs completed in Sector 7',
                    desc: '34 LED streetlights replaced. Full illumination restored.',
                    time: '38 min ago',
                  },
                  {
                    type: 'notice',
                    icon: '🌧️',
                    iconBg: 'rgba(245,158,11,0.12)',
                    iconBorder: 'rgba(245,158,11,0.25)',
                    badge: 'Advisory',
                    badgeColor: '#f59e0b',
                    badgeBg: 'rgba(245,158,11,0.1)',
                    title: 'Heavy rainfall advisory for next 6 hours',
                    desc: 'Residents advised to avoid low-lying flood-prone areas.',
                    time: '1 hr ago',
                  },
                  {
                    type: 'info',
                    icon: '🏗️',
                    iconBg: 'rgba(139,92,246,0.12)',
                    iconBorder: 'rgba(139,92,246,0.25)',
                    badge: 'Development',
                    badgeColor: '#8b5cf6',
                    badgeBg: 'rgba(139,92,246,0.1)',
                    title: 'Metro Phase 2 construction update',
                    desc: 'Underground drilling complete at Station 4. Track laying begins Monday.',
                    time: '2 hrs ago',
                  },
                  {
                    type: 'system',
                    icon: '🔔',
                    iconBg: 'rgba(255,255,255,0.06)',
                    iconBorder: 'rgba(255,255,255,0.1)',
                    badge: 'System',
                    badgeColor: '#94a3b8',
                    badgeBg: 'rgba(148,163,184,0.08)',
                    title: 'Your complaint #3842 status updated',
                    desc: 'Streetlight malfunction assigned to Electrical Division. ETA: 2 days.',
                    time: '3 hrs ago',
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex gap-3.5 p-4 rounded-2xl border transition-all duration-200 hover:scale-[1.01] cursor-default"
                    style={{ background: 'rgba(255,255,255,0.025)', borderColor: 'rgba(255,255,255,0.07)' }}
                  >
                    {/* Icon */}
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: item.iconBg, border: `1px solid ${item.iconBorder}` }}
                    >
                      {item.icon}
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ color: item.badgeColor, background: item.badgeBg }}
                        >
                          {item.badge}
                        </span>
                        <span className="text-[10px] text-slate-500 ml-auto">{item.time}</span>
                      </div>
                      <p className="text-xs font-semibold text-white leading-snug">{item.title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* View All button */}
              <button className="w-full mt-5 py-2.5 bg-slate-800/40 hover:bg-slate-800/70 border border-slate-700/50 text-slate-400 hover:text-white text-xs font-semibold rounded-xl cursor-pointer transition-all duration-200 flex items-center justify-center gap-2">
                <IconBell className="w-3.5 h-3.5" />
                View All Notifications
              </button>
            </div>

          </div>
          </>
          )}

          {activeTab === 'Traffic' && (
            <TrafficDashboard />
          )}

          {activeTab === 'Complaints' && (
            <ComplaintPage onBack={() => setActiveTab('Dashboard')} />
          )}

          {activeTab === 'Emergency' && (
            <EmergencyDashboard />
          )}

          {activeTab === 'News' && (
            isAdmin ? <NewsAdminPanel /> : <NewsPanel />
          )}

          {activeTab === 'Weather' && (
            <WeatherDashboard />
          )}

          {activeTab === 'Settings' && (
            <SettingsPage
              currentUser={currentUser}
              setCurrentUser={setCurrentUser}
              onLogout={onLogout}
              setNotification={setNotification}
            />
          )}

          {activeTab !== 'Dashboard' && activeTab !== 'Traffic' && activeTab !== 'Complaints' && activeTab !== 'Emergency' && activeTab !== 'News' && activeTab !== 'Weather' && activeTab !== 'Settings' && (
            <div className="bg-[#0a1626]/80 rounded-3xl p-8 border border-slate-800 border-solid text-center py-20 animate-fade-in">
              <h2 className="text-xl font-bold text-white mb-2">{activeTab} Monitor</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto">
                The {activeTab.toLowerCase()} service monitor is currently operating in standard automatic mode. No human overrides are required at this time.
              </p>
            </div>
          )}
          </div>
        </main>
      </div>

      {/* Complaint Submission Modal */}
      {complaintModalOpen && (
        <div className="fixed inset-0 z-50 bg-[#07111e]/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0a1626] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00b894] to-transparent" />
            <div className="p-6 md:p-8 space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white">File New Complaint</h3>
                  <p className="text-xs text-slate-500">Lodge utility or civil grievances</p>
                </div>
                <button 
                  onClick={() => setComplaintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
                >
                  <IconX className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmitComplaint} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="compTitle" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Grievance Title
                  </label>
                  <input
                    type="text"
                    id="compTitle"
                    required
                    value={complaintTitle}
                    onChange={(e) => setComplaintTitle(e.target.value)}
                    placeholder="e.g. Streetlight bulb burnt"
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] focus:box-shadow-[0_0_0_1px_rgba(0,184,148,0.25)] transition-all duration-200"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="compCategory" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Department/Category
                  </label>
                  <select
                    id="compCategory"
                    value={complaintCategory}
                    onChange={(e) => setComplaintCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all duration-200"
                  >
                    <option value="Sanitation">Sanitation & Garbage</option>
                    <option value="Electrical">Electrical & Streetlights</option>
                    <option value="Roads & Infra">Roads & Potholes</option>
                    <option value="Water Supply">Water & Drainage</option>
                    <option value="Security">Security & Civil Safety</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="compDesc" className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
                    Detailed Description
                  </label>
                  <textarea
                    id="compDesc"
                    required
                    rows={4}
                    value={complaintDesc}
                    onChange={(e) => setComplaintDesc(e.target.value)}
                    placeholder="Provide details like location, nearest landmark..."
                    className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] focus:box-shadow-[0_0_0_1px_rgba(0,184,148,0.25)] transition-all duration-200 resize-none"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setComplaintModalOpen(false)}
                    className="flex-1 py-3 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-3 rounded-xl text-xs font-semibold text-white bg-[#00b894] hover:bg-[#00a381] border-none cursor-pointer"
                  >
                    Submit Grievance
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}
      {/* ── CityBot Chatbot ── */}
      <Chatbot />

    </div>
  )
}
