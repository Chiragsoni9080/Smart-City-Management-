import { useState, useEffect, useRef, useMemo, useCallback } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
interface QueueEntry {
  id: string
  name: string
  service: 'Police' | 'Ambulance' | 'Fire Brigade'
  priority: 'Critical' | 'High' | 'Medium'
  issue: string
  time: string
  status: 'Dispatched' | 'En Route' | 'Waiting' | 'Resolved'
  eta?: string
  position?: number
}

interface Hospital {
  id: string
  name: string
  distance: string
  eta: string
  bedsAvailable: number
  icuAvailable: number
  emergency24h: boolean
  type: string
  phone: string
}

interface EmergencyNotif {
  id: string
  type: 'fire' | 'medical' | 'crime' | 'accident' | 'flood' | 'alert'
  title: string
  desc: string
  location: string
  time: string
  severity: 'Critical' | 'High' | 'Medium'
  read: boolean
}

// ── Icons ────────────────────────────────────────────────────────────────────
const Shield = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
)

const Ambulance = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5h15M12 3v6m3-3H9m-4.5 6h15a2 2 0 012 2v4a2 2 0 01-2 2H4.5a2 2 0 01-2-2v-4a2 2 0 012-2z" />
  </svg>
)

const Flame = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
  </svg>
)

const Hospital = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
)

const Bell = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
  </svg>
)

const Phone = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.948V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 7V5z" />
  </svg>
)

const MapPin = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const ListFilter = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h6M15 16h2" />
  </svg>
)

const Check = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
)

// ── Main Component ───────────────────────────────────────────────────────────
export default function EmergencyDashboard() {
  // SOS State
  const [sosActive, setSosActive] = useState(false)
  const [sosCountdown, setSosCountdown] = useState(5)
  const [sosConfirming, setSosConfirming] = useState(false)
  const [sosDispatched, setSosDispatched] = useState(false)
  const sosTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Active tab for sub-panels
  const [activePanel, setActivePanel] = useState<'hospitals' | 'queue' | 'notifications'>('notifications')

  // Calling simulation
  const [calling, setCalling] = useState<string | null>(null)
  const [callToast, setCallToast] = useState<string | null>(null)

  // Notifications
  const [notifications, setNotifications] = useState<EmergencyNotif[]>([
    { id: 'n1', type: 'accident', title: 'Multi-vehicle collision reported', desc: 'Pile-up involving 4 vehicles near Highway 4 East Junction. Ambulances deployed.', location: 'Highway 4 East, Junction 3', time: '4 mins ago', severity: 'Critical', read: false },
    { id: 'n2', type: 'fire', title: 'Building fire — Sector 9 Industrial', desc: 'Fire reported on floor 2 of Sector 9 industrial warehouse. Fire Brigade unit 3 en route.', location: 'Sector 9, Industrial Zone', time: '12 mins ago', severity: 'High', read: false },
    { id: 'n3', type: 'medical', title: 'Mass casualty medical advisory', desc: 'City hospital systems placed on standby alert for incoming trauma cases from highway incident.', location: 'City General Hospital', time: '18 mins ago', severity: 'High', read: true },
    { id: 'n4', type: 'crime', title: 'Armed robbery at Commercial Block C', desc: 'Police unit 7 responding to armed robbery report at Central Bank, Block C.', location: 'Commercial Block C, Sector 4', time: '29 mins ago', severity: 'Medium', read: true },
    { id: 'n5', type: 'flood', title: 'Flash flood advisory — Lower Sector 3', desc: 'Waterlogging reported in residential sectors near riverside. Evacuation advisories issued.', location: 'Sector 3, Riverside Blocks', time: '41 mins ago', severity: 'Medium', read: true },
  ])

  // Queue entries
  const [queue, setQueue] = useState<QueueEntry[]>([
    { id: 'q1', name: 'Rohan Sharma', service: 'Ambulance', priority: 'Critical', issue: 'Cardiac arrest — unconscious patient', time: '3 mins ago', status: 'En Route', eta: '4 mins', position: 1 },
    { id: 'q2', name: 'Priya Verma', service: 'Police', priority: 'High', issue: 'Domestic assault — immediate police required', time: '7 mins ago', status: 'Dispatched', eta: '6 mins', position: 2 },
    { id: 'q3', name: 'Ankit Mehta', service: 'Fire Brigade', priority: 'High', issue: 'Gas leak detected in residential complex', time: '11 mins ago', status: 'En Route', eta: '8 mins', position: 3 },
    { id: 'q4', name: 'Sunita Devi', service: 'Ambulance', priority: 'Medium', issue: 'Fall injury — elderly patient, possible fracture', time: '14 mins ago', status: 'Waiting', position: 4 },
    { id: 'q5', name: 'Arjun Kapoor', service: 'Police', priority: 'Medium', issue: 'Vehicle theft at parking lot B12', time: '21 mins ago', status: 'Dispatched', eta: '12 mins', position: 5 },
  ])

  // Nearby hospitals
  const hospitals: Hospital[] = useMemo(() => [
    { id: 'h1', name: 'City General Hospital', distance: '0.8 km', eta: '4 min', bedsAvailable: 12, icuAvailable: 3, emergency24h: true, type: 'Government', phone: '011-2345-6789' },
    { id: 'h2', name: 'Apollo MultiSpecialty', distance: '1.4 km', eta: '7 min', bedsAvailable: 8, icuAvailable: 5, emergency24h: true, type: 'Private', phone: '011-9876-5432' },
    { id: 'h3', name: 'AIIMS Sector 18', distance: '2.2 km', eta: '10 min', bedsAvailable: 24, icuAvailable: 7, emergency24h: true, type: 'Government', phone: '011-1111-2222' },
    { id: 'h4', name: 'Max Super Speciality', distance: '3.1 km', eta: '13 min', bedsAvailable: 6, icuAvailable: 2, emergency24h: true, type: 'Private', phone: '011-4455-6677' },
  ], [])

  // SOS Countdown logic
  useEffect(() => {
    if (sosActive && !sosDispatched) {
      setSosCountdown(5)
      sosTimerRef.current = setInterval(() => {
        setSosCountdown(prev => {
          if (prev <= 1) {
            clearInterval(sosTimerRef.current!)
            setSosActive(false)
            setSosDispatched(true)
            setSosConfirming(false)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (sosTimerRef.current) clearInterval(sosTimerRef.current)
    }
  }, [sosActive])

  const handleSosPress = useCallback(() => {
    setSosConfirming(true)
  }, [])

  const handleSosConfirm = useCallback(() => {
    setSosConfirming(false)
    setSosActive(true)
  }, [])

  const handleSosCancel = useCallback(() => {
    setSosActive(false)
    setSosConfirming(false)
    setSosDispatched(false)
    setSosCountdown(5)
    if (sosTimerRef.current) clearInterval(sosTimerRef.current)
  }, [])

  const handleCall = useCallback((service: string, number: string) => {
    setCalling(service)
    setCallToast(`📞 Connecting to ${service} (${number})...`)
    setTimeout(() => {
      setCalling(null)
      setCallToast(`✅ Call connected to ${service}. Stay on the line.`)
      setTimeout(() => setCallToast(null), 3500)
    }, 2000)
  }, [])

  const handleMarkRead = useCallback((id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }, [])

  const handleResolveQueue = useCallback((id: string) => {
    setQueue(prev => prev.map(q => q.id === id ? { ...q, status: 'Resolved' as const } : q))
  }, [])

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications])

  const notifTypeConfig: Record<EmergencyNotif['type'], { label: string; color: string; bg: string; icon: string }> = useMemo(() => ({
    fire: { label: 'Fire', color: '#f97316', bg: 'rgba(249,115,22,0.1)', icon: '🔥' },
    medical: { label: 'Medical', color: '#ec4899', bg: 'rgba(236,72,153,0.1)', icon: '🏥' },
    crime: { label: 'Crime', color: '#a855f7', bg: 'rgba(168,85,247,0.1)', icon: '🚨' },
    accident: { label: 'Accident', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: '💥' },
    flood: { label: 'Flood', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)', icon: '🌊' },
    alert: { label: 'Alert', color: '#eab308', bg: 'rgba(234,179,8,0.1)', icon: '⚠️' },
  }), [])

  const serviceConfig = useMemo(() => ({
    Police:       { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)', border: 'rgba(59,130,246,0.25)', number: '100', icon: Shield, label: 'Police Control Room', desc: 'Law enforcement & security' },
    Ambulance:    { color: '#ec4899', bg: 'rgba(236,72,153,0.12)', border: 'rgba(236,72,153,0.25)', number: '102', icon: Ambulance, label: 'Ambulance Services', desc: 'Medical & trauma response' },
    'Fire Brigade': { color: '#f97316', bg: 'rgba(249,115,22,0.12)', border: 'rgba(249,115,22,0.25)', number: '101', icon: Flame, label: 'Fire Brigade Control', desc: 'Fire & hazard emergencies' },
  }), [])

  return (
    <div className="space-y-6">
      <style>{`
        @keyframes sos-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.6), 0 0 0 0 rgba(239,68,68,0.3); }
          50% { box-shadow: 0 0 0 18px rgba(239,68,68,0.0), 0 0 0 36px rgba(239,68,68,0.0); }
        }
        @keyframes sos-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        .sos-btn-active { animation: sos-pulse 1s ease-in-out infinite; }
        .sos-ring { animation: sos-ring 1.4s ease-out infinite; }
      `}</style>

      {/* Call Toast */}
      {callToast && (
        <div className="fixed top-5 right-5 z-[500] px-5 py-3.5 bg-[#0a1626] text-white text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          <span>{callToast}</span>
        </div>
      )}

      {/* ── SOS Confirm Modal ── */}
      {sosConfirming && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(5,10,20,0.9)', backdropFilter: 'blur(12px)' }}>
          <div className="w-full max-w-sm mx-4 rounded-3xl overflow-hidden shadow-2xl border border-rose-500/30" style={{ background: 'linear-gradient(145deg, #1a0808, #0d0606)' }}>
            <div className="p-8 text-center">
              <div className="flex justify-center mb-5">
                <div className="relative w-20 h-20">
                  <span className="absolute inset-0 rounded-full bg-rose-500/30 sos-ring" />
                  <div className="w-20 h-20 rounded-full bg-rose-600 flex items-center justify-center border-4 border-rose-400 relative z-10">
                    <span className="text-3xl font-black text-white">SOS</span>
                  </div>
                </div>
              </div>
              <h3 className="text-xl font-black text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>Send Emergency SOS?</h3>
              <p className="text-sm text-rose-300/80 leading-relaxed mb-6 max-w-xs mx-auto">
                This will immediately alert Police, Ambulance, and Fire Brigade with your current location. Only use in genuine emergencies.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleSosCancel}
                  className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-300 cursor-pointer border-none transition-colors"
                  style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSosConfirm}
                  className="flex-1 py-3 rounded-2xl text-sm font-black text-white cursor-pointer border-none transition-all"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #991b1b)' }}
                >
                  🚨 Send SOS Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SOS Active Countdown Overlay ── */}
      {sosActive && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center" style={{ background: 'rgba(50,0,0,0.92)', backdropFilter: 'blur(14px)' }}>
          <div className="text-center">
            <p className="text-rose-300 text-sm font-semibold uppercase tracking-widest mb-6">Sending SOS in</p>
            <div className="w-36 h-36 rounded-full bg-rose-600 flex items-center justify-center mx-auto mb-6 sos-btn-active border-4 border-rose-400">
              <span className="text-7xl font-black text-white">{sosCountdown}</span>
            </div>
            <p className="text-white text-lg font-bold mb-2">Alerting all emergency services</p>
            <p className="text-rose-300/70 text-sm mb-8">Police • Ambulance • Fire Brigade</p>
            <button
              onClick={handleSosCancel}
              className="px-8 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer border-none"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              Cancel SOS
            </button>
          </div>
        </div>
      )}

      {/* ── SOS Dispatched Confirmation ── */}
      {sosDispatched && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-start gap-4 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 border border-rose-500/30 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🚨</span>
          </div>
          <div className="flex-1">
            <p className="text-rose-300 font-bold text-sm">SOS Alert Dispatched Successfully</p>
            <p className="text-rose-300/70 text-xs mt-1">All emergency services have been notified with your location. Help is on the way. Estimated arrival: <span className="font-bold text-rose-200">4–6 minutes</span>.</p>
          </div>
          <button onClick={handleSosCancel} className="text-rose-400/60 hover:text-rose-300 text-xs border-none bg-transparent cursor-pointer font-bold">Dismiss</button>
        </div>
      )}

      {/* ── TOP ROW: SOS Button + 3 Service Dials ── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

        {/* BIG SOS Button */}
        <div className="glass-card rounded-3xl border border-rose-500/20 p-6 flex flex-col items-center justify-center text-center gap-4"
          style={{ background: 'linear-gradient(135deg, rgba(10,22,38,0.95) 0%, rgba(127,29,29,0.12) 100%)' }}
        >
          <p className="text-xs font-bold uppercase tracking-widest text-rose-400/70">EMERGENCY SOS</p>

          {/* Pulsing SOS button */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-28 h-28 rounded-full bg-rose-500/20 sos-ring" />
            <span className="absolute w-28 h-28 rounded-full bg-rose-500/10 sos-ring" style={{ animationDelay: '0.7s' }} />
            <button
              id="sos-button"
              onClick={handleSosPress}
              disabled={sosActive || sosConfirming}
              className="w-24 h-24 rounded-full text-white font-black text-2xl border-4 border-rose-400 shadow-2xl cursor-pointer relative z-10 transition-all hover:scale-105 sos-btn-active"
              style={{ background: 'linear-gradient(135deg, #dc2626, #7f1d1d)' }}
            >
              SOS
            </button>
          </div>

          <p className="text-[11px] text-slate-500 leading-relaxed max-w-[150px]">
            Press and hold to alert Police, Ambulance & Fire Brigade instantly
          </p>
        </div>

        {/* 3 Emergency Service Cards */}
        {(Object.entries(serviceConfig) as [keyof typeof serviceConfig, typeof serviceConfig[keyof typeof serviceConfig]][]).map(([name, cfg]) => {
          const Icon = cfg.icon
          const isCalling = calling === name
          return (
            <div
              key={name}
              className="glass-card rounded-3xl border p-6 flex flex-col gap-5 hover:scale-[1.01] transition-transform"
              style={{ borderColor: cfg.border, background: `linear-gradient(145deg, #0d1b2e 0%, ${cfg.bg} 100%)` }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center border flex-shrink-0" style={{ background: cfg.bg, borderColor: cfg.border, color: cfg.color }}>
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{cfg.label}</h3>
                  <p className="text-[11px]" style={{ color: `${cfg.color}99` }}>{cfg.desc}</p>
                </div>
              </div>

              {/* Status dot */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[11px] text-slate-400 font-medium">Available 24×7 — City Network</span>
              </div>

              <button
                id={`call-${name.toLowerCase().replace(' ', '-')}`}
                onClick={() => handleCall(name, cfg.number)}
                disabled={isCalling}
                className="w-full py-3 rounded-2xl text-sm font-black text-white border-none cursor-pointer transition-all hover:opacity-90 flex items-center justify-center gap-2"
                style={{ background: isCalling ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${cfg.color}, ${cfg.color}cc)` }}
              >
                <Phone className="w-4 h-4" />
                {isCalling ? 'Connecting...' : `Call ${cfg.number}`}
              </button>
            </div>
          )
        })}
      </div>

      {/* ── BOTTOM PANELS ── */}
      <div className="glass-panel rounded-3xl overflow-hidden">

        {/* Sub-panel Tab Controls */}
        <div className="px-6 py-4 border-b border-slate-800/80 flex items-center justify-between flex-wrap gap-3"
          style={{ background: 'rgba(13,27,46,0.6)' }}
        >
          <div className="flex gap-1 bg-[#07111e] rounded-xl p-1 border border-slate-800">
            {([
              { key: 'notifications', label: 'Emergency Alerts', icon: Bell },
              { key: 'queue', label: 'Priority Queue', icon: ListFilter },
              { key: 'hospitals', label: 'Nearby Hospitals', icon: Hospital },
            ] as const).map(tab => {
              const TabIcon = tab.icon
              const active = activePanel === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActivePanel(tab.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all border-none cursor-pointer relative ${active ? 'bg-rose-500 text-white' : 'text-slate-400 hover:text-slate-200 bg-transparent'}`}
                >
                  <TabIcon className="w-3.5 h-3.5" />
                  {tab.label}
                  {tab.key === 'notifications' && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-400 text-white text-[9px] font-black flex items-center justify-center">{unreadCount}</span>
                  )}
                </button>
              )
            })}
          </div>

          <div className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-3 py-1.5 rounded-lg border border-rose-500/20">
            🔴 LIVE — Emergency Grid Active
          </div>
        </div>

        <div className="p-6">

          {/* ── PANEL 1: Emergency Notifications ── */}
          {activePanel === 'notifications' && (
            <div className="space-y-3">
              {notifications.map(notif => {
                const cfg = notifTypeConfig[notif.type]
                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all ${notif.read ? 'opacity-60' : 'opacity-100'}`}
                    style={{
                      background: notif.read ? 'rgba(255,255,255,0.02)' : cfg.bg,
                      borderColor: notif.read ? 'rgba(255,255,255,0.06)' : cfg.color + '40',
                    }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Type indicator */}
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-base" style={{ background: cfg.bg, border: `1px solid ${cfg.color}40` }}>
                        {cfg.icon}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide" style={{ background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${notif.severity === 'Critical' ? 'bg-rose-500/10 text-rose-400' : notif.severity === 'High' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {notif.severity}
                          </span>
                          {!notif.read && <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />}
                        </div>

                        <h4 className="text-sm font-bold text-white mb-1">{notif.title}</h4>
                        <p className="text-xs text-slate-400 leading-relaxed mb-2">{notif.desc}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <MapPin className="w-3 h-3" />
                            {notif.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-slate-500 font-mono">{notif.time}</span>
                            {!notif.read && (
                              <button
                                onClick={() => handleMarkRead(notif.id)}
                                className="text-[10px] text-emerald-400 hover:text-emerald-300 font-semibold border-none bg-transparent cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Mark read
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── PANEL 2: Priority Queue System ── */}
          {activePanel === 'queue' && (
            <div className="space-y-4">
              {/* Queue Header Stats */}
              <div className="grid grid-cols-3 gap-4 mb-2">
                <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{queue.filter(q => q.status !== 'Resolved').length}</div>
                  <div className="text-[11px] text-slate-400 font-medium mt-1">Active Cases</div>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-rose-400">{queue.filter(q => q.priority === 'Critical' && q.status !== 'Resolved').length}</div>
                  <div className="text-[11px] text-rose-400/70 font-medium mt-1">Critical Priority</div>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-emerald-400">{queue.filter(q => q.status === 'Resolved').length}</div>
                  <div className="text-[11px] text-emerald-400/70 font-medium mt-1">Resolved Today</div>
                </div>
              </div>

              {/* Queue Items */}
              <div className="space-y-3">
                {queue.map((item, index) => {
                  const svc = serviceConfig[item.service]
                  const Icon = svc.icon
                  const isResolved = item.status === 'Resolved'
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-all ${isResolved ? 'opacity-50' : ''}`}
                      style={{
                        background: isResolved ? 'rgba(255,255,255,0.02)' : 'rgba(13,27,46,0.6)',
                        borderColor: item.priority === 'Critical' && !isResolved ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.07)',
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Priority Position Badge */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black flex-shrink-0 ${item.priority === 'Critical' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' : item.priority === 'High' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-300 border border-slate-700'}`}>
                          {isResolved ? <Check className="w-4 h-4" /> : `#${index + 1}`}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className="text-sm font-bold text-white">{item.name}</span>
                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold border" style={{ background: svc.bg, borderColor: svc.border, color: svc.color }}>
                              <Icon className="w-3 h-3" />
                              {item.service}
                            </div>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.priority === 'Critical' ? 'bg-rose-500/15 text-rose-400' : item.priority === 'High' ? 'bg-amber-500/15 text-amber-400' : 'bg-blue-500/15 text-blue-400'}`}>
                              {item.priority}
                            </span>
                          </div>

                          <p className="text-xs text-slate-400 mb-2 leading-relaxed">{item.issue}</p>

                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div className="flex items-center gap-3 text-[11px]">
                              <span className={`px-2 py-0.5 rounded-md font-semibold ${item.status === 'En Route' ? 'bg-emerald-500/10 text-emerald-400' : item.status === 'Dispatched' ? 'bg-blue-500/10 text-blue-400' : item.status === 'Resolved' ? 'bg-slate-700 text-slate-400' : 'bg-amber-500/10 text-amber-400'}`}>
                                {item.status}
                              </span>
                              {item.eta && !isResolved && (
                                <span className="text-slate-500 font-mono">ETA: <span className="text-white font-bold">{item.eta}</span></span>
                              )}
                              <span className="text-slate-600 font-mono">{item.time}</span>
                            </div>

                            {!isResolved && (
                              <button
                                onClick={() => handleResolveQueue(item.id)}
                                className="text-[10px] font-bold text-emerald-400 hover:text-emerald-300 border-none bg-transparent cursor-pointer flex items-center gap-1"
                              >
                                <Check className="w-3 h-3" /> Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ── PANEL 3: Nearby Hospitals ── */}
          {activePanel === 'hospitals' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {hospitals.map((hosp, idx) => (
                  <div
                    key={hosp.id}
                    className="p-5 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all"
                    style={{ background: 'rgba(13,27,46,0.6)' }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-rose-500/10 border border-rose-500/20 text-rose-400">
                          <Hospital className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-white leading-tight">{hosp.name}</h4>
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 inline-block ${hosp.type === 'Government' ? 'bg-blue-500/10 text-blue-400' : 'bg-purple-500/10 text-purple-400'}`}>
                            {hosp.type}
                          </span>
                        </div>
                      </div>

                      {idx === 0 && (
                        <span className="text-[9px] font-bold px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                          Nearest
                        </span>
                      )}
                    </div>

                    {/* Distance + ETA */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="bg-slate-900/60 rounded-xl p-2.5 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <div>
                          <div className="text-xs font-bold text-white">{hosp.distance}</div>
                          <div className="text-[9px] text-slate-500">Distance</div>
                        </div>
                      </div>
                      <div className="bg-slate-900/60 rounded-xl p-2.5 flex items-center gap-2">
                        <span className="text-sm">🚗</span>
                        <div>
                          <div className="text-xs font-bold text-white">{hosp.eta}</div>
                          <div className="text-[9px] text-slate-500">ETA by vehicle</div>
                        </div>
                      </div>
                    </div>

                    {/* Bed availability */}
                    <div className="flex items-center gap-3 mb-4 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400" />
                        <span className="text-slate-400">General: <span className="text-white font-bold">{hosp.bedsAvailable} beds</span></span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-400" />
                        <span className="text-slate-400">ICU: <span className="text-white font-bold">{hosp.icuAvailable} units</span></span>
                      </div>
                    </div>

                    {/* 24h badge + call button */}
                    <div className="flex gap-2">
                      {hosp.emergency24h && (
                        <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-bold text-emerald-400 border border-emerald-500/20 bg-emerald-500/5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          24h Emergency
                        </div>
                      )}
                      <button
                        onClick={() => handleCall(hosp.name, hosp.phone)}
                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white border-none cursor-pointer flex items-center justify-center gap-1.5 transition-all hover:opacity-90"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #be185d)' }}
                      >
                        <Phone className="w-3.5 h-3.5" />
                        Call Hospital
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
