import { useState, useRef, useEffect } from 'react'

// ── Types ──────────────────────────────────────────────────────────────────
interface Message {
  id: number
  role: 'user' | 'bot'
  text: string
  time: string
  emoji?: string
}

// ── Knowledge Base ─────────────────────────────────────────────────────────
const KB: { keywords: string[]; answer: string; emoji: string }[] = [
  {
    keywords: ['hello', 'hi', 'hey', 'namaste', 'helo', 'hii'],
    emoji: '👋',
    answer: 'Namaste! 👋 I\'m **CityBot**, your SmartCityOS assistant.\n\n🌟 I can help you with:\n✅ Filing & tracking complaints\n🌤️ Weather & AQI\n🚦 Traffic updates\n🚨 Emergency services\n📰 City news\n\nWhat do you need help with today?'
  },
  {
    keywords: ['complaint', 'grievance', 'file', 'lodge', 'report', 'issue', 'problem', 'raise', 'submit'],
    emoji: '📋',
    answer: '📋 **Filing a Complaint:**\n\n1️⃣ Click **"Complaints"** in the left sidebar\n2️⃣ Select **"Raise New Complaint"** tab\n3️⃣ Choose category (Roads 🛣️, Water 🚿, Electrical ⚡, etc.)\n4️⃣ Enter title, description & location 📍\n5️⃣ Upload a photo 📸 (optional)\n6️⃣ Click **Submit** ✅\n\n🎫 You\'ll get a unique ID like **CMP-2026-XXXX** for tracking!'
  },
  {
    keywords: ['track', 'status', 'progress', 'update', 'follow', 'check complaint'],
    emoji: '🔍',
    answer: '🔍 **Tracking Your Complaint:**\n\n1️⃣ Go to **Complaints** → **"Track Complaints"** tab\n2️⃣ See all your complaints with live status:\n\n🟡 Submitted → 🟠 Assigned → 🔵 In Progress → ✅ Resolved → 🔒 Closed\n\n📊 Each card shows resolution **progress %** and timestamps!'
  },
  {
    keywords: ['weather', 'temperature', 'rain', 'forecast', 'humidity', 'wind', 'aqi', 'climate'],
    emoji: '🌤️',
    answer: '🌤️ **Weather Information:**\n\nClick **"Weather"** 🌦️ in the sidebar to view:\n🌡️ **Current Temperature** & conditions\n💧 **Humidity** levels\n💨 **Wind Speed**\n📅 **3-Day Forecast**\n🌿 **AQI Index** for air quality\n\n💡 Your Dashboard also has a quick **weather widget** on the right!'
  },
  {
    keywords: ['traffic', 'road', 'jam', 'congestion', 'route', 'map'],
    emoji: '🚦',
    answer: '🚦 **Traffic Monitor:**\n\nClick **"Traffic"** in the sidebar to see:\n🟢 Low congestion zones\n🟡 Medium traffic areas\n🔴 Heavy congestion spots\n🗺️ Affected roads & alternate routes\n⚠️ Live traffic incident reports\n\n🚗 Plan your commute smartly!'
  },
  {
    keywords: ['emergency', 'police', 'ambulance', 'fire', '100', '101', '102', '108', 'urgent', 'sos', 'help'],
    emoji: '🚨',
    answer: '🚨 **Emergency Services:**\n\nClick **"Emergency"** for one-tap dialing:\n🚔 **Police** — 100\n🚒 **Fire Brigade** — 101\n🚑 **Ambulance** — 102 / 108\n🆘 **Disaster Management** — 1077\n🏥 **AIIMS Emergency** — 011-26588500\n\n⚠️ *In real emergency, call directly from your phone!*'
  },
  {
    keywords: ['news', 'updates', 'notice', 'announcement', 'municipal', 'notification'],
    emoji: '📰',
    answer: '📰 **City News Feed:**\n\nClick **"News"** 📡 in the sidebar to read:\n🏗️ Infrastructure project updates\n🌱 Environmental campaigns\n🚿 Water/Power advisories\n📢 Official Municipal notices\n\n👑 Admin users can **publish** new announcements from the admin panel!'
  },
  {
    keywords: ['settings', 'profile', 'account', 'password', 'name', 'phone', 'change', 'update profile', 'edit'],
    emoji: '⚙️',
    answer: '⚙️ **Account Settings:**\n\nClick **"Settings"** to:\n✏️ Update name, email & phone\n🖼️ Change profile picture\n🔐 Update password\n🌙 Switch Dark / Light theme\n🔔 Manage notifications\n\n💾 All changes are saved automatically!'
  },
  {
    keywords: ['login', 'register', 'sign up', 'account', 'signup', 'create account'],
    emoji: '🔐',
    answer: '🔐 **Account Access:**\n\n🆕 **Register:** Click "Create Account" → fill your details\n🔑 **Login:** Enter email & password\n🛡️ Secured with password hashing\n👑 **Admin:** Use `admin@municipality.gov` for admin access\n\n💡 Forgot password? Contact your municipal administrator.'
  },
  {
    keywords: ['admin', 'administrator', 'manage', 'panel', 'publish'],
    emoji: '🛡️',
    answer: '🛡️ **Admin Features:**\n\nAdmin users get extra superpowers:\n📝 **Publish City News** from the News Admin Panel\n📊 View & manage all citizen complaints\n📢 Create platform-wide announcements\n\n🔑 Admin access via email `admin@municipality.gov` or role assignment.'
  },
  {
    keywords: ['smart city', 'smartcityos', 'platform', 'what is', 'about', 'features', 'portal', 'citizen'],
    emoji: '🏙️',
    answer: '🏙️ **About SmartCityOS:**\n\nSmartCityOS is a **digital Citizen Portal** for civic management!\n\n📋 **Complaints** — File & track grievances\n🚦 **Traffic** — Real-time road monitoring\n🌤️ **Weather** — Live weather + AQI\n📰 **News** — Official city updates\n🚨 **Emergency** — Quick-dial services\n⚙️ **Settings** — Manage your profile\n\n🏛️ Built for citizens of Sector 15 Municipal Corporation!'
  },
  {
    keywords: ['location', 'gps', 'coordinates', 'address', 'sector', 'zone'],
    emoji: '📍',
    answer: '📍 **Location Services:**\n\nSmartCityOS uses your GPS to:\n🗺️ Auto-fill location when filing complaints\n🌡️ Show accurate local weather data\n🚦 Display area-relevant traffic info\n\n✅ Grant access from the location prompt after login\n✏️ Or type your location manually in the complaint form.'
  },
  {
    keywords: ['logout', 'sign out', 'exit', 'log out'],
    emoji: '🚪',
    answer: '🚪 **Logging Out:**\n\n1️⃣ Look at the **bottom of the left sidebar**\n2️⃣ Click the 🔴 red **"Logout"** button\n3️⃣ Confirm in the popup dialog\n\n✅ Your session will be cleared safely. See you soon! 👋'
  },
  {
    keywords: ['water', 'supply', 'pipe', 'leakage', 'drainage', 'sewage'],
    emoji: '🚿',
    answer: '🚿 **Water & Drainage Issues:**\n\n1️⃣ **Complaints** → Raise New Complaint\n2️⃣ Category: **"Water Supply"** 💧\n3️⃣ Describe issue + exact location 📍\n4️⃣ Submit → Water Supply Division is alerted ✅\n\n📞 Water Emergency Helpline: **1916**'
  },
  {
    keywords: ['electricity', 'power', 'light', 'streetlight', 'electrical', 'outage', 'cut'],
    emoji: '⚡',
    answer: '⚡ **Electrical Issues:**\n\n1️⃣ **Complaints** → Raise New Complaint\n2️⃣ Category: **"Electrical & Streetlights"** 💡\n3️⃣ Mention street name / pole number if visible\n4️⃣ Submit → Electrical Division notified ✅\n\n📞 Power Emergency: **DISCOM Helpline: 1912**'
  },
  {
    keywords: ['pothole', 'road damage', 'broken road', 'infrastructure', 'construction'],
    emoji: '🛣️',
    answer: '🛣️ **Road & Infrastructure Issues:**\n\n1️⃣ **Complaints** → Raise New Complaint\n2️⃣ Category: **"Roads & Potholes"** 🚗\n3️⃣ Upload a photo 📸 — speeds up processing!\n4️⃣ Submit → Roads Maintenance Team assigned ✅\n\n⏱️ Typical resolution: **3–7 working days**'
  },
  {
    keywords: ['garbage', 'waste', 'dustbin', 'sanitation', 'cleanliness', 'trash', 'dirty'],
    emoji: '🗑️',
    answer: '🗑️ **Sanitation & Garbage Issues:**\n\n1️⃣ **Complaints** → Raise New Complaint\n2️⃣ Category: **"Sanitation & Garbage"** ♻️\n3️⃣ Mention area and nearest landmark 📍\n4️⃣ Submit → Sanitation Dept notified ✅\n\n📅 Regular collection: **Mon, Wed, Fri, Sat**'
  },
  {
    keywords: ['thank', 'thanks', 'thankyou', 'thank you', 'great', 'helpful', 'good', 'awesome', 'nice'],
    emoji: '😊',
    answer: '😊 You\'re very welcome! Happy to help! 🌟\n\nIs there anything else you\'d like to know about **SmartCityOS**? I\'m always here for you! 💬'
  },
  {
    keywords: ['bye', 'goodbye', 'ok', 'okay', 'done', 'chal'],
    emoji: '👋',
    answer: '👋 Goodbye! Stay safe and have a wonderful day! 🌟\n\nYou can open me anytime by clicking the chat button 💬\n\n— **CityBot** 🏙️❤️'
  },
]

const DEFAULT_RESPONSE = "🤔 I didn't quite catch that! Could you rephrase?\n\nYou can ask me about:\n📋 Filing / Tracking Complaints\n🌤️ Weather & Traffic\n🚨 Emergency Services\n📰 City News & Updates\n⚙️ Account & Settings\n🏙️ About SmartCityOS"

const GREETING = "Namaste! 👋 I'm **CityBot** — your SmartCityOS assistant.\n\n🌟 Ask me anything about the platform and I'll guide you!"

// ── Bot Engine ─────────────────────────────────────────────────────────────
function getBotResponse(input: string): { text: string; emoji: string } {
  const lower = input.toLowerCase().trim()
  for (const entry of KB) {
    if (entry.keywords.some(kw => lower.includes(kw))) {
      return { text: entry.answer, emoji: entry.emoji }
    }
  }
  return { text: DEFAULT_RESPONSE, emoji: '🤖' }
}

function getTime() {
  return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

// ── Markdown-like renderer ─────────────────────────────────────────────────
function renderText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} className="font-bold text-white">{part.slice(2, -2)}</strong>
    }
    return part.split('\n').map((line, j, arr) => (
      <span key={`${i}-${j}`}>{line}{j < arr.length - 1 && <br />}</span>
    ))
  })
}

// ── Quick Reply Chips ──────────────────────────────────────────────────────
const quickReplies = [
  { label: '📋 File a complaint', text: 'file a complaint' },
  { label: '🔍 Track complaint', text: 'track my complaint' },
  { label: '🚨 Emergency numbers', text: 'emergency numbers' },
  { label: '🏙️ About SmartCityOS', text: 'what is smartcityos' },
  { label: '🌤️ Check weather', text: 'weather information' },
  { label: '🚦 Traffic update', text: 'traffic update' },
]

// ── Chatbot Component ──────────────────────────────────────────────────────
export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    { id: 0, role: 'bot', text: GREETING, time: getTime(), emoji: '🏙️' }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [unread, setUnread] = useState(0)
  const [pulse, setPulse] = useState(true)
  const [showQuick, setShowQuick] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Stop pulse ring after 5s
  useEffect(() => {
    const t = setTimeout(() => setPulse(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  useEffect(() => {
    if (open) {
      setUnread(0)
      setTimeout(() => inputRef.current?.focus(), 150)
    }
  }, [open])

  const sendMessage = (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text) return
    setShowQuick(false)

    const userMsg: Message = { id: Date.now(), role: 'user', text, time: getTime() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setTyping(true)

    const delay = 700 + Math.random() * 700
    setTimeout(() => {
      const { text: botText, emoji } = getBotResponse(text)
      const botMsg: Message = { id: Date.now() + 1, role: 'bot', text: botText, time: getTime(), emoji }
      setMessages(prev => [...prev, botMsg])
      setTyping(false)
      if (!open) setUnread(u => u + 1)
    }, delay)
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* ── Floating Button ── */}
      <div className="fixed bottom-6 right-6 z-[300]">
        {/* Pulse rings */}
        {pulse && !open && (
          <>
            <span className="absolute inset-0 rounded-2xl animate-ping opacity-40"
              style={{ background: 'rgba(0,184,148,0.5)', animationDuration: '1.5s' }} />
            <span className="absolute inset-0 rounded-2xl animate-ping opacity-20"
              style={{ background: 'rgba(0,184,148,0.3)', animationDuration: '1.5s', animationDelay: '0.4s' }} />
          </>
        )}
        <button
          onClick={() => setOpen(o => !o)}
          className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl border-none cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95"
          style={{
            background: open
              ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
              : 'linear-gradient(135deg, #00b894, #00cec9)',
            boxShadow: open
              ? '0 8px 32px rgba(238,90,36,0.45)'
              : '0 8px 32px rgba(0,184,148,0.45)',
            transition: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
          }}
          title="Open CityBot"
        >
          <span style={{
            display: 'inline-block',
            transition: 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), opacity 0.2s',
            transform: open ? 'rotate(180deg) scale(1)' : 'rotate(0deg) scale(1)',
          }}>
            {open ? (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            )}
          </span>

          {/* Unread badge */}
          {!open && unread > 0 && (
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
              {unread}
            </span>
          )}
        </button>

        {/* Tooltip label */}
        {!open && (
          <div
            className="absolute bottom-0 right-16 whitespace-nowrap px-3 py-1.5 rounded-xl text-xs font-semibold text-white pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, #00b894, #00cec9)',
              boxShadow: '0 4px 12px rgba(0,184,148,0.35)',
              opacity: pulse ? 1 : 0,
              transform: pulse ? 'translateX(0)' : 'translateX(8px)',
              transition: 'opacity 0.5s, transform 0.5s',
            }}
          >
            💬 Ask CityBot!
            <span className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[6px] w-0 h-0"
              style={{ borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '6px solid #00cec9' }} />
          </div>
        )}
      </div>

      {/* ── Chat Window ── */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[299] w-[370px] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50"
          style={{
            maxHeight: 'min(580px, calc(100vh - 120px))',
            background: 'linear-gradient(160deg, #0d1e35 0%, #091420 100%)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,184,148,0.18), inset 0 1px 0 rgba(255,255,255,0.05)',
            animation: 'chatSlideUp 0.35s cubic-bezier(0.34,1.56,0.64,1)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4 border-b border-slate-800/60 flex-shrink-0 relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, rgba(0,184,148,0.15), rgba(66,165,245,0.1), rgba(0,184,148,0.08))' }}
          >
            {/* Animated background shimmer */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(0,184,148,0.06) 50%, transparent 100%)', animation: 'shimmer 3s infinite' }} />

            {/* Bot avatar with rings */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-xl animate-pulse opacity-60"
                style={{ background: 'radial-gradient(circle, rgba(0,184,148,0.4), transparent 70%)', transform: 'scale(1.5)' }} />
              <div
                className="relative w-11 h-11 rounded-xl flex items-center justify-center text-xl"
                style={{ background: 'linear-gradient(135deg, #00b894, #00cec9)', boxShadow: '0 4px 16px rgba(0,184,148,0.5)' }}
              >
                🤖
              </div>
            </div>

            <div className="flex-1 min-w-0 relative z-10">
              <div className="font-bold text-white text-sm flex items-center gap-2">
                CityBot
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">AI</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
                </span>
                <span className="text-[11px] text-emerald-400 font-medium">Online • SmartCityOS Support</span>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700/60 bg-transparent border-none cursor-pointer transition-all duration-200 hover:scale-110 relative z-10"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4" style={{ minHeight: 0 }}>
            {messages.map((msg, idx) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                style={{ animation: `msgAppear 0.3s ease ${Math.min(idx * 0.05, 0.2)}s both` }}
              >
                {/* Bot avatar */}
                {msg.role === 'bot' && (
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-base"
                    style={{ background: 'linear-gradient(135deg, #00b894, #00cec9)', boxShadow: '0 2px 8px rgba(0,184,148,0.4)' }}
                  >
                    {msg.emoji || '🤖'}
                  </div>
                )}

                <div className={`max-w-[82%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div
                    className={`px-4 py-3 text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'text-white rounded-2xl rounded-tr-sm'
                        : 'text-slate-200 rounded-2xl rounded-tl-sm'
                    }`}
                    style={
                      msg.role === 'user'
                        ? {
                          background: 'linear-gradient(135deg, #00b894, #00a381)',
                          boxShadow: '0 4px 12px rgba(0,184,148,0.25)',
                        }
                        : {
                          background: 'rgba(255,255,255,0.055)',
                          border: '1px solid rgba(255,255,255,0.09)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                        }
                    }
                  >
                    {renderText(msg.text)}
                  </div>
                  <span className="text-[10px] text-slate-600 px-1">{msg.time}</span>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {typing && (
              <div className="flex gap-2.5" style={{ animation: 'msgAppear 0.3s ease both' }}>
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 text-base"
                  style={{ background: 'linear-gradient(135deg, #00b894, #00cec9)', boxShadow: '0 2px 8px rgba(0,184,148,0.4)' }}
                >
                  🤖
                </div>
                <div
                  className="px-4 py-3.5 rounded-2xl rounded-tl-sm flex items-center gap-1.5"
                  style={{
                    background: 'rgba(255,255,255,0.055)',
                    border: '1px solid rgba(255,255,255,0.09)',
                  }}
                >
                  <span className="w-2 h-2 rounded-full bg-[#00b894]" style={{ animation: 'typingBounce 1.2s infinite ease-in-out', animationDelay: '0ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#00cec9]" style={{ animation: 'typingBounce 1.2s infinite ease-in-out', animationDelay: '200ms' }} />
                  <span className="w-2 h-2 rounded-full bg-[#42a5f5]" style={{ animation: 'typingBounce 1.2s infinite ease-in-out', animationDelay: '400ms' }} />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Reply Chips */}
          {showQuick && messages.length <= 2 && (
            <div className="px-4 pb-3 flex-shrink-0">
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-2 px-1">Quick Questions 💬</p>
              <div className="flex flex-wrap gap-1.5">
                {quickReplies.map(qr => (
                  <button
                    key={qr.text}
                    onClick={() => sendMessage(qr.text)}
                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border cursor-pointer transition-all duration-200 hover:scale-105 active:scale-95"
                    style={{
                      background: 'rgba(0,184,148,0.07)',
                      border: '1px solid rgba(0,184,148,0.25)',
                      color: '#a7f3d0',
                    }}
                    onMouseEnter={e => {
                      (e.target as HTMLElement).style.background = 'rgba(0,184,148,0.18)'
                      ;(e.target as HTMLElement).style.borderColor = 'rgba(0,184,148,0.5)'
                    }}
                    onMouseLeave={e => {
                      (e.target as HTMLElement).style.background = 'rgba(0,184,148,0.07)'
                      ;(e.target as HTMLElement).style.borderColor = 'rgba(0,184,148,0.25)'
                    }}
                  >
                    {qr.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="px-4 py-4 border-t border-slate-800/70 flex-shrink-0"
            style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div
              className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border transition-all duration-200 focus-within:shadow-lg"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
              onFocus={() => {}}
            >
              <span className="text-base flex-shrink-0">💬</span>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Ask me anything..."
                className="flex-1 bg-transparent border-none outline-none text-white text-xs placeholder:text-slate-600 min-w-0"
                style={{ caretColor: '#00b894' }}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || typing}
                className="w-8 h-8 rounded-xl flex items-center justify-center border-none cursor-pointer transition-all duration-200 flex-shrink-0 disabled:opacity-35 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                style={{
                  background: input.trim() && !typing
                    ? 'linear-gradient(135deg, #00b894, #00a381)'
                    : 'rgba(255,255,255,0.07)',
                  boxShadow: input.trim() && !typing ? '0 4px 12px rgba(0,184,148,0.4)' : 'none',
                  transition: 'all 0.2s cubic-bezier(0.34,1.56,0.64,1)',
                }}
              >
                <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                </svg>
              </button>
            </div>
            <p className="text-[10px] text-slate-700 text-center mt-2 flex items-center justify-center gap-1">
              🏙️ CityBot • SmartCityOS Support
            </p>
          </div>
        </div>
      )}

      {/* Keyframe styles */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)    scale(1); }
        }
        @keyframes msgAppear {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes typingBounce {
          0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
          40%            { transform: scale(1.2); opacity: 1; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </>
  )
}
