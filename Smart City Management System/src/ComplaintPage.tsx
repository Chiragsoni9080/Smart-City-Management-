import { useState, useRef, useEffect } from 'react'
import React from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
type Category = {
  id: string
  label: string
  icon: string
  color: string
  bg: string
}

type ComplaintStatus = 'submitted' | 'assigned' | 'in_progress' | 'resolved' | 'closed'

type Complaint = {
  id: string
  title: string
  category: string
  description: string
  location: string
  imageUrl?: string
  status: ComplaintStatus
  submittedAt: string
  updatedAt: string
  assignedTo?: string
  timeline: TimelineEntry[]
}

type TimelineEntry = {
  status: ComplaintStatus
  label: string
  description: string
  timestamp: string
  done: boolean
  active?: boolean
}

// ── Data ──────────────────────────────────────────────────────────────────────
const categories: Category[] = [
  { id: 'roads', label: 'Roads & Potholes', icon: '🛣️', color: '#e65100', bg: 'rgba(230,81,0,0.1)' },
  { id: 'water', label: 'Water Supply', icon: '💧', color: '#0288d1', bg: 'rgba(2,136,209,0.1)' },
  { id: 'electricity', label: 'Electricity', icon: '⚡', color: '#f9a825', bg: 'rgba(249,168,37,0.1)' },
  { id: 'sanitation', label: 'Sanitation', icon: '🧹', color: '#388e3c', bg: 'rgba(56,142,60,0.1)' },
  { id: 'streetlight', label: 'Street Lights', icon: '💡', color: '#7b1fa2', bg: 'rgba(123,31,162,0.1)' },
  { id: 'parks', label: 'Parks & Gardens', icon: '🌳', color: '#2e7d32', bg: 'rgba(46,125,50,0.1)' },
  { id: 'noise', label: 'Noise Pollution', icon: '🔊', color: '#c62828', bg: 'rgba(198,40,40,0.1)' },
  { id: 'other', label: 'Other', icon: '📋', color: '#546e7a', bg: 'rgba(84,110,122,0.1)' },
]

const mockComplaints: Complaint[] = [
  {
    id: 'CMP-2024-001',
    title: 'Large pothole on MG Road near Bus Stop 12',
    category: 'roads',
    description: 'There is a very large pothole causing accidents daily.',
    location: 'MG Road, Near Bus Stop 12, Sector 4',
    status: 'in_progress',
    submittedAt: '2024-07-10T09:30:00',
    updatedAt: '2024-07-13T14:00:00',
    assignedTo: 'Roads Maintenance Team B',
    timeline: [
      { status: 'submitted', label: 'Complaint Submitted', description: 'Your complaint has been received and logged.', timestamp: '10 Jul, 9:30 AM', done: true },
      { status: 'assigned', label: 'Assigned to Team', description: 'Assigned to Roads Maintenance Team B for inspection.', timestamp: '11 Jul, 10:00 AM', done: true },
      { status: 'in_progress', label: 'Work In Progress', description: 'Repair work has been initiated at the location.', timestamp: '13 Jul, 2:00 PM', done: true, active: true },
      { status: 'resolved', label: 'Resolved', description: 'Issue resolved and verified.', timestamp: 'Pending', done: false },
      { status: 'closed', label: 'Closed', description: 'Complaint closed after user confirmation.', timestamp: 'Pending', done: false },
    ],
  },
  {
    id: 'CMP-2024-002',
    title: 'No water supply for 3 days in Block C',
    category: 'water',
    description: 'Entire Block C has been without water for 3 consecutive days.',
    location: 'Block C, Residency Towers, Sector 9',
    status: 'resolved',
    submittedAt: '2024-07-08T08:00:00',
    updatedAt: '2024-07-12T11:00:00',
    assignedTo: 'Water Supply Division',
    timeline: [
      { status: 'submitted', label: 'Complaint Submitted', description: 'Your complaint has been received and logged.', timestamp: '08 Jul, 8:00 AM', done: true },
      { status: 'assigned', label: 'Assigned to Team', description: 'Assigned to Water Supply Division.', timestamp: '08 Jul, 11:00 AM', done: true },
      { status: 'in_progress', label: 'Work In Progress', description: 'Pipeline issue identified and repair initiated.', timestamp: '09 Jul, 3:00 PM', done: true },
      { status: 'resolved', label: 'Resolved', description: 'Water supply restored to Block C.', timestamp: '12 Jul, 11:00 AM', done: true, active: true },
      { status: 'closed', label: 'Closed', description: 'Closed after user confirmation.', timestamp: 'Pending', done: false },
    ],
  },
  {
    id: 'CMP-2024-003',
    title: 'Street lights not working on Park Avenue',
    category: 'streetlight',
    description: 'All 6 street lights on Park Avenue have been non-functional for a week.',
    location: 'Park Avenue, Near Central Park, Sector 7',
    status: 'submitted',
    submittedAt: '2024-07-14T18:45:00',
    updatedAt: '2024-07-14T18:45:00',
    timeline: [
      { status: 'submitted', label: 'Complaint Submitted', description: 'Your complaint has been received and logged.', timestamp: '14 Jul, 6:45 PM', done: true, active: true },
      { status: 'assigned', label: 'Assigned to Team', description: 'Pending assignment.', timestamp: 'Pending', done: false },
      { status: 'in_progress', label: 'Work In Progress', description: 'Pending.', timestamp: 'Pending', done: false },
      { status: 'resolved', label: 'Resolved', description: 'Pending.', timestamp: 'Pending', done: false },
      { status: 'closed', label: 'Closed', description: 'Pending.', timestamp: 'Pending', done: false },
    ],
  },
]

const statusConfig: Record<ComplaintStatus, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#1976d2', bg: 'rgba(25,118,210,0.1)' },
  assigned: { label: 'Assigned', color: '#7b1fa2', bg: 'rgba(123,31,162,0.1)' },
  in_progress: { label: 'In Progress', color: '#f57c00', bg: 'rgba(245,124,0,0.1)' },
  resolved: { label: 'Resolved', color: '#388e3c', bg: 'rgba(56,142,60,0.1)' },
  closed: { label: 'Closed', color: '#546e7a', bg: 'rgba(84,110,122,0.1)' },
}

// ── Complaint Page ─────────────────────────────────────────────────────────
export default function ComplaintPage({ onBack, requestLocation }: { onBack: () => void, requestLocation?: () => Promise<boolean> }) {
  const [activeTab, setActiveTab] = useState<'raise' | 'track'>('raise')
  const [currentUser] = useState<{ fullName: string }>(() => {
    try {
      const stored = localStorage.getItem('scm_current_user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed && parsed.fullName) return parsed
      }
    } catch (e) {}
    return { fullName: 'Rohan Sharma' }
  })
  const [selectedCategory, setSelectedCategory] = useState('')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [location, setLocation] = useState('')
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [complaints, setComplaints] = useState<Complaint[]>([])

  useEffect(() => {
    const stored = localStorage.getItem('scm_complaints')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        // Normalize old-format complaints (filed from Dashboard) that may be missing fields
        const normalized: Complaint[] = parsed.map((c: any) => ({
          id: c.id || `CMP-${Date.now()}`,
          title: c.title || 'Untitled Complaint',
          category: c.category || 'other',
          description: c.description || '',
          location: c.location || 'Location not specified',
          imageUrl: c.imageUrl,
          status: (['submitted','assigned','in_progress','resolved','closed'].includes(c.status)
            ? c.status
            : c.status === 'Pending' ? 'submitted'
            : c.status === 'Resolved' ? 'resolved'
            : 'submitted') as ComplaintStatus,
          submittedAt: c.submittedAt || c.date || new Date().toISOString(),
          updatedAt: c.updatedAt || c.date || new Date().toISOString(),
          assignedTo: c.assignedTo,
          timeline: Array.isArray(c.timeline) && c.timeline.length > 0
            ? c.timeline
            : [
                { status: 'submitted', label: 'Complaint Submitted', description: 'Your complaint has been received and logged.', timestamp: c.date || 'Recently', done: true, active: true },
                { status: 'assigned', label: 'Assigned to Team', description: 'Pending assignment.', timestamp: 'Pending', done: false },
                { status: 'in_progress', label: 'Work In Progress', description: 'Pending.', timestamp: 'Pending', done: false },
                { status: 'resolved', label: 'Resolved', description: 'Pending.', timestamp: 'Pending', done: false },
                { status: 'closed', label: 'Closed', description: 'Pending.', timestamp: 'Pending', done: false },
              ],
        }))
        setComplaints(normalized)
        // Persist normalized data back so future loads are clean
        localStorage.setItem('scm_complaints', JSON.stringify(normalized))
      } catch (e) {
        setComplaints(mockComplaints)
      }
    } else {
      setComplaints(mockComplaints)
      localStorage.setItem('scm_complaints', JSON.stringify(mockComplaints))
    }
  }, [])

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3000)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDetectLocation = async () => {
    // If requestLocation is provided, use it to ensure permission is granted
    if (requestLocation) {
      const granted = await requestLocation()
      if (!granted) {
        showToast('⚠️ Location access not enabled. Please allow it from your dashboard.')
        return
      }
    }

    const permission = localStorage.getItem('scm_location_permission')
    const storedCoords = localStorage.getItem('scm_location_coords')

    // If coords already saved from dashboard permission grant, use them
    if (storedCoords && permission === 'granted') {
      try {
        const coords = JSON.parse(storedCoords)
        setLocation(`Current Location — ${coords.lat.toFixed(4)}° N, ${coords.lng.toFixed(4)}° E`)
        showToast('📍 Location auto-filled from your saved permissions!')
        return
      } catch (e) {
        console.error(e)
      }
    }

    // If not yet granted, try requesting live
    if (permission === 'denied' || permission === 'dismissed') {
      showToast('⚠️ Location access not enabled. Please allow it from your dashboard.')
      return
    }

    // Request fresh location from browser
    if (navigator.geolocation) {
      showToast('📡 Detecting your location...')
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude.toFixed(4)
          const lng = pos.coords.longitude.toFixed(4)
          setLocation(`Current Location — ${lat}° N, ${lng}° E`)
          localStorage.setItem('scm_location_coords', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: new Date().toISOString() }))
          localStorage.setItem('scm_location_permission', 'granted')
          showToast('📍 Location detected successfully!')
        },
        () => {
          showToast('⚠️ Unable to detect location. Please enter manually.')
        }
      )
    } else {
      showToast('⚠️ Geolocation is not supported by your browser.')
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedCategory || !title || !description || !location) {
      showToast('⚠️ Please fill all required fields')
      return
    }
    setSubmitting(true)
    setTimeout(() => {
      const newId = `CMP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
      const newComplaint: Complaint = {
        id: newId,
        title,
        category: selectedCategory,
        description,
        location,
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        timeline: [
          { status: 'submitted', label: 'Complaint Submitted', description: 'Your complaint has been received and logged.', timestamp: 'Just now', done: true, active: true },
          { status: 'assigned', label: 'Assigned to Team', description: 'Pending assignment.', timestamp: 'Pending', done: false },
          { status: 'in_progress', label: 'Work In Progress', description: 'Pending.', timestamp: 'Pending', done: false },
          { status: 'resolved', label: 'Resolved', description: 'Pending.', timestamp: 'Pending', done: false },
          { status: 'closed', label: 'Closed', description: 'Pending.', timestamp: 'Pending', done: false },
        ]
      }
      
      const updatedComplaints = [newComplaint, ...complaints]
      setComplaints(updatedComplaints)
      localStorage.setItem('scm_complaints', JSON.stringify(updatedComplaints))

      // Log activity
      try {
        const storedActivities = localStorage.getItem('scm_activities')
        const acts = storedActivities ? JSON.parse(storedActivities) : []
        const updatedActivities = [{ action: `Filed a complaint ${newId} (${title})`, time: 'Just now' }, ...acts]
        localStorage.setItem('scm_activities', JSON.stringify(updatedActivities))
      } catch (e) {}

      setSubmitting(false)
      setSubmitted(true)
    }, 1800)
  }

  const handleReset = () => {
    setSubmitted(false)
    setSelectedCategory('')
    setTitle('')
    setDescription('')
    setLocation('')
    setImagePreview(null)
  }

  return (
    <div className="min-h-screen text-slate-200 animate-gradient-xy p-4 md:p-8" style={{ background: 'linear-gradient(135deg, #020617, #0f172a, #1e293b)' }}>      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-6 right-6 z-[1000] bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl text-sm font-medium border border-slate-700 animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <header className="glass-panel sticky top-0 z-50 rounded-2xl mb-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4 h-16">
          <button
            onClick={onBack}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border-none cursor-pointer transition-colors"
          >←</button>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-gradient-to-br from-indigo-500 to-purple-600">
              📋
            </div>
            <div>
              <div className="font-bold text-slate-100 text-base font-sora">
                Complaint Management
              </div>
              <div className="text-xs text-slate-400">Raise or track city complaints</div>
            </div>
          </div>
          <div className="ml-auto">
            <div className="text-xs text-slate-300 bg-slate-800 rounded-lg px-3 py-1.5 border border-slate-700">
              Citizen: <b className="text-white">{currentUser.fullName}</b>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-1 p-1.5 glass-panel rounded-xl mb-8 w-fit border border-slate-700">
          {(['raise', 'track'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`
              px-7 py-2.5 rounded-lg border-none cursor-pointer font-semibold text-sm transition-all font-sora
              ${activeTab === tab ? 'bg-indigo-500 text-white shadow-lg' : 'bg-transparent text-slate-400 hover:text-slate-200'}
            `}>
              {tab === 'raise' ? '➕ Raise Complaint' : '📊 Track Complaints'}
            </button>
          ))}
        </div>

        {/* ─── RAISE TAB ─────────────────────────────────────── */}
        {activeTab === 'raise' && (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 items-start">
            <div>
              {submitted ? (
                /* Success Screen */
                <div className="glass-card rounded-2xl p-14 text-center">
                  <div className="text-7xl mb-4">✅</div>
                  <h2 className="text-2xl font-bold text-white mb-2 font-sora">
                    Complaint Submitted!
                  </h2>
                  <p className="text-slate-400 text-sm mb-3">
                    Your complaint has been registered successfully.
                  </p>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-7 py-3 inline-block mb-9">
                    <span className="text-sm text-emerald-400 font-bold">Complaint ID: CMP-2024-004</span>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => { setActiveTab('track'); handleReset() }}
                      className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none rounded-xl px-7 py-3.5 cursor-pointer font-semibold text-sm font-sora hover:opacity-90 transition-opacity"
                    >📊 Track My Complaints</button>
                    <button
                      onClick={handleReset}
                      className="bg-slate-800 text-slate-300 border border-slate-700 rounded-xl px-7 py-3.5 cursor-pointer font-semibold text-sm hover:bg-slate-700 transition-colors"
                    >➕ Raise Another</button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>

                  {/* Step 1 — Category */}
                  <div className="glass-card rounded-2xl p-7 mb-5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">1</div>
                      <h3 className="font-bold text-white text-base font-sora m-0">
                        Select Category <span className="text-rose-500">*</span>
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-5 ml-9">What type of issue are you reporting?</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {categories.map(cat => (
                        <button
                          key={cat.id} type="button"
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`
                            rounded-xl p-3.5 cursor-pointer flex flex-col items-center gap-2 transition-all outline-none border-2
                            ${selectedCategory === cat.id ? 'bg-slate-800' : 'bg-slate-900/50 hover:bg-slate-800'}
                          `}
                          style={{ borderColor: selectedCategory === cat.id ? cat.color : 'rgba(255,255,255,0.05)' }}
                        >
                          <span className="text-3xl">{cat.icon}</span>
                          <span className="text-[11px] font-semibold text-center leading-snug" style={{ color: selectedCategory === cat.id ? cat.color : '#94a3b8' }}>
                            {cat.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Step 2 — Details */}
                  <div className="glass-card rounded-2xl p-7 mb-5">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">2</div>
                      <h3 className="font-bold text-white text-base font-sora m-0">Complaint Details</h3>
                    </div>
                    <label className="block mb-4">
                      <span className="text-xs font-semibold text-slate-300 block mb-2">
                        Complaint Title <span className="text-rose-500">*</span>
                      </span>
                      <input
                        type="text" value={title} onChange={e => setTitle(e.target.value)}
                        placeholder="e.g., Large pothole on Main Street near School"
                        className="w-full px-4 py-3 rounded-xl text-sm border-none outline-none text-white bg-slate-900/60 focus:ring-2 focus:ring-indigo-500/50 font-inter transition-all placeholder:text-slate-600"
                      />
                    </label>
                    <label className="block">
                      <span className="text-xs font-semibold text-slate-300 block mb-2">
                        Description <span className="text-rose-500">*</span>
                      </span>
                      <textarea
                        value={description} onChange={e => setDescription(e.target.value)}
                        placeholder="Describe the issue in detail — when it started, how it affects residents, and any other relevant information..."
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl text-sm border-none outline-none text-white bg-slate-900/60 focus:ring-2 focus:ring-indigo-500/50 font-inter transition-all resize-y placeholder:text-slate-600"
                      />
                      <div className="text-right text-[11px] text-slate-500 mt-1">
                        {description.length} / 500
                      </div>
                    </label>
                  </div>

                  {/* Step 3 — Upload Image */}
                  <div className="glass-card rounded-2xl p-7 mb-5">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">3</div>
                      <h3 className="font-bold text-white text-base font-sora m-0">
                        Upload Photo <span className="text-[11px] text-slate-500 font-normal">(optional)</span>
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-5 ml-9">A photo helps authorities identify the issue faster.</p>

                    {imagePreview ? (
                      <div className="relative">
                        <img src={imagePreview} alt="Upload preview" className="w-full max-h-[220px] object-cover rounded-xl border-2 border-emerald-500/30" />
                        <button
                          type="button"
                          onClick={() => { setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = '' }}
                          className="absolute top-2.5 right-2.5 bg-black/60 text-white border-none rounded-full w-8 h-8 cursor-pointer text-lg flex items-center justify-center hover:bg-black/80 transition-colors"
                        >×</button>
                        <div className="absolute bottom-2.5 left-2.5 bg-black/70 text-white text-[11px] rounded-lg px-2.5 py-1 backdrop-blur-sm">
                          ✓ Photo uploaded
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-slate-700 rounded-2xl p-10 text-center cursor-pointer bg-slate-900/40 transition-all hover:border-indigo-500/50 hover:bg-slate-900/60 group"
                      >
                        <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">📷</div>
                        <div className="font-semibold text-slate-200 text-sm mb-1.5">Click to upload a photo</div>
                        <div className="text-[11px] text-slate-500">PNG, JPG, WEBP · Max 10MB</div>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </div>

                  {/* Step 4 — Location */}
                  <div className="glass-card rounded-2xl p-7 mb-6">
                    <div className="flex items-center gap-3 mb-1.5">
                      <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">4</div>
                      <h3 className="font-bold text-white text-base font-sora m-0">
                        Location <span className="text-rose-500">*</span>
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400 mb-5 ml-9">Where exactly is the problem located?</p>

                    <div className="flex gap-2.5 mb-3.5">
                      <input
                        type="text" value={location} onChange={e => setLocation(e.target.value)}
                        placeholder="Enter full address or nearby landmark..."
                        className="flex-1 px-4 py-3 rounded-xl text-sm border-none outline-none text-white bg-slate-900/60 focus:ring-2 focus:ring-indigo-500/50 font-inter transition-all placeholder:text-slate-600"
                      />
                      <button
                        type="button" onClick={handleDetectLocation}
                        className="bg-slate-800 text-indigo-400 hover:text-indigo-300 hover:bg-slate-700 border border-slate-700 rounded-xl px-4 py-3 cursor-pointer font-semibold text-xs whitespace-nowrap flex items-center gap-1.5 transition-colors"
                      >📍 Auto-Detect</button>
                    </div>

                    {/* Map Preview */}
                    <div className="rounded-xl h-40 bg-slate-900/80 flex items-center justify-center flex-col gap-2 relative overflow-hidden border border-slate-800">
                      {/* fake map grid */}
                      <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                      <div className="text-4xl z-10">🗺️</div>
                      <div className="text-xs font-semibold text-slate-400 z-10 text-center px-5">
                        {location || 'Map Preview — Enter location or auto-detect'}
                      </div>
                      {location && (
                        <div className="absolute top-2.5 right-2.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg px-2.5 py-1 text-[10px] font-bold z-20">
                          📍 Located
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit" disabled={submitting}
                    className={`
                      w-full p-4 rounded-xl border-none font-bold text-base font-sora transition-all flex items-center justify-center gap-2
                      ${submitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white cursor-pointer hover:opacity-90 shadow-lg shadow-indigo-500/20'}
                    `}
                  >
                    {submitting ? (
                      <>
                        <span className="inline-block w-4 h-4 border-2 border-slate-500 border-t-slate-300 rounded-full animate-spin" />
                        Submitting Complaint...
                      </>
                    ) : '📋 Submit Complaint'}
                  </button>
                </form>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="flex flex-col gap-5">
              {/* How It Works */}
              <div className="glass-card rounded-2xl p-6">
                <div className="font-bold text-white text-sm mb-5 font-sora">📌 How It Works</div>
                {[
                  { step: '1', label: 'Select complaint category', icon: '🏷️' },
                  { step: '2', label: 'Describe the issue clearly', icon: '✏️' },
                  { step: '3', label: 'Add photo as evidence', icon: '📷' },
                  { step: '4', label: 'Pin the location', icon: '📍' },
                  { step: '5', label: 'Submit & track status', icon: '📊' },
                ].map((s, i, arr) => (
                  <div key={s.step} className={`flex gap-3.5 relative ${i < arr.length - 1 ? 'pb-4' : ''}`}>
                    {i < arr.length - 1 && (
                      <div className="absolute left-4 top-8 w-px h-[calc(100%-16px)] bg-slate-700" />
                    )}
                    <div className="w-8 h-8 rounded-full shrink-0 bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-300 font-bold z-10">
                      {s.step}
                    </div>
                    <div className="pt-1.5">
                      <div className="text-xs font-semibold text-slate-300">{s.icon} {s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Emergency */}
              <div className="bg-gradient-to-br from-rose-900/40 to-slate-900 border border-rose-500/20 rounded-2xl p-6">
                <div className="font-bold text-white text-sm mb-4 font-sora">📞 Emergency? Call Direct</div>
                {[{ label: 'Police', number: '100', emoji: '🚔', color: 'text-blue-400' }, { label: 'Fire', number: '101', emoji: '🚒', color: 'text-rose-400' }, { label: 'Ambulance', number: '102', emoji: '🏥', color: 'text-emerald-400' }].map(c => (
                  <div key={c.number} className="flex justify-between items-center mb-2.5">
                    <span className="text-xs text-slate-300 font-medium">{c.emoji} {c.label}</span>
                    <a href={`tel:${c.number}`} className={`font-bold text-base no-underline ${c.color}`}>{c.number}</a>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="glass-card rounded-2xl p-6">
                <div className="font-bold text-white text-sm mb-4 font-sora">📈 Your Stats</div>
                {[
                  { label: 'Total Raised', value: '3', color: 'text-white' },
                  { label: 'Resolved', value: '1', color: 'text-emerald-400' },
                  { label: 'In Progress', value: '1', color: 'text-amber-400' },
                  { label: 'Pending', value: '1', color: 'text-blue-400' },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center py-2 border-b border-slate-700/50 last:border-0">
                    <span className="text-xs font-semibold text-slate-400">{s.label}</span>
                    <span className={`font-bold text-lg ${s.color}`}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── TRACK TAB ─────────────────────────────────────── */}
        {activeTab === 'track' && (
          <div className={`grid gap-6 items-start ${selectedComplaint ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-3xl mx-auto'}`}>
            {/* Complaint Cards */}
            <div>
              <div className="font-bold text-white text-lg mb-5 font-sora">
                My Complaints ({complaints.length})
              </div>
              {complaints.map(c => {
                const cat = categories.find(x => x.id === c.category)
                const sc = statusConfig[c.status] || statusConfig['submitted']
                const isSelected = selectedComplaint?.id === c.id
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedComplaint(isSelected ? null : c)}
                    className={`
                      glass-card rounded-2xl p-5 mb-4 cursor-pointer transition-all border-2
                      ${isSelected ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-slate-800/80' : 'border-transparent hover:border-slate-700 hover:bg-slate-800/50'}
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: cat?.bg, border: `1px solid ${cat?.color}40` }}>
                        {cat?.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-white text-sm font-sora mb-1.5 truncate">
                          {c.title}
                        </div>
                        <div className="flex gap-2 mb-2 flex-wrap">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40` }}>
                            ● {sc.label}
                          </span>
                          <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                            {c.id}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex gap-3 font-semibold">
                          <span>📍 {(c.location || 'Location N/A').split(',')[0]}</span>
                          <span>🕐 {c.submittedAt ? new Date(c.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : 'Recent'}</span>
                        </div>
                      </div>
                      <span className={`text-lg transition-transform ${isSelected ? 'text-indigo-400 rotate-90' : 'text-slate-600'}`}>›</span>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Status Timeline Panel */}
            {selectedComplaint && (() => {
              const sc = statusConfig[selectedComplaint.status]
              const doneCount = selectedComplaint.timeline.filter(t => t.done).length
              const progress = Math.round((doneCount / selectedComplaint.timeline.length) * 100)
              return (
                <div className="animate-fade-in">
                  <div className="font-bold text-white text-lg mb-5 font-sora">
                    Status Timeline
                  </div>
                  <div className="glass-card rounded-2xl p-7">
                    {/* Complaint Summary */}
                    <div className="mb-6 pb-5 border-b border-slate-700/50">
                      <div className="text-xs font-semibold text-slate-500 mb-1">{selectedComplaint.id}</div>
                      <div className="font-bold text-white text-base font-sora mb-1.5">
                        {selectedComplaint.title}
                      </div>
                      <div className="text-xs font-medium text-slate-400 mb-3">📍 {selectedComplaint.location}</div>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-[11px] font-bold px-3 py-1 rounded-full" style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.color}40` }}>
                          ● {sc.label}
                        </span>
                        {selectedComplaint.assignedTo && (
                          <span className="bg-slate-800/80 text-slate-300 border border-slate-700 text-[11px] font-bold px-3 py-1 rounded-full">
                            👷 {selectedComplaint.assignedTo}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Timeline Steps */}
                    {selectedComplaint.timeline.map((t, i, arr) => {
                      return (
                        <div key={t.status} className={`flex gap-4 relative ${i < arr.length - 1 ? 'pb-7' : ''}`}>
                          {i < arr.length - 1 && (
                            <div className={`absolute left-4 top-8 w-px h-[calc(100%-16px)] transition-colors ${t.done ? 'bg-gradient-to-b from-emerald-500 to-emerald-500/20' : 'bg-slate-700'}`} />
                          )}
                          {/* Dot */}
                          <div className={`
                            w-8 h-8 rounded-full shrink-0 z-10 flex items-center justify-center transition-all border-2
                            ${t.active ? 'bg-slate-900 border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]' : t.done ? 'bg-emerald-500/20 border-emerald-500' : 'bg-slate-800 border-slate-700'}
                          `}>
                            {t.done && !t.active && <span className="text-sm text-emerald-400">✓</span>}
                            {t.active && <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]" />}
                          </div>
                          {/* Content */}
                          <div className="flex-1 pt-1">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <span className={`font-bold text-sm font-sora ${t.done ? 'text-white' : 'text-slate-500'}`}>
                                  {t.label}
                                </span>
                                {t.active && (
                                  <span className="ml-2 bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                    CURRENT
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap mt-0.5">{t.timestamp}</span>
                            </div>
                            <div className={`text-[11px] leading-relaxed ${t.done ? 'text-slate-400' : 'text-slate-600'}`}>{t.description}</div>
                          </div>
                        </div>
                      )
                    })}

                    {/* Progress Bar */}
                    <div className="mt-7 pt-5 border-t border-slate-700/50">
                      <div className="flex justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-300">Resolution Progress</span>
                        <span className="text-[11px] font-bold text-indigo-400">{progress}%</span>
                      </div>
                      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-1000 ease-out" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="flex justify-between mt-1.5">
                        <span className="text-[10px] font-semibold text-slate-500">Submitted</span>
                        <span className="text-[10px] font-semibold text-slate-500">Closed</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}
