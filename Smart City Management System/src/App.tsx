import { useState, useEffect, useRef } from 'react'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import DashboardPage from './DashboardPage'
import ComplaintPage from './ComplaintPage'

// ── City SVG Illustration ─────────────────────────────────────────────────────
function CitySVG() {
  return (
    <svg
      viewBox="0 0 560 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-label="Smart city digital illustration"
    >
      {/* Grid ground */}
      <defs>
        <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0a2540" stopOpacity="0" />
          <stop offset="100%" stopColor="#0d3a6a" stopOpacity="0.18" />
        </linearGradient>
        <linearGradient id="buildingGrad1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565c0" />
          <stop offset="100%" stopColor="#0d3a6a" />
        </linearGradient>
        <linearGradient id="buildingGrad2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#0a2540" />
        </linearGradient>
        <linearGradient id="buildingGrad3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00b894" />
          <stop offset="100%" stopColor="#00796b" />
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1565c0" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#0a2540" stopOpacity="0.08" />
        </linearGradient>
        <radialGradient id="glowGreen" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00b894" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#00b894" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="glowBlue" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#42a5f5" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#42a5f5" stopOpacity="0" />
        </radialGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Background glow */}
      <ellipse cx="280" cy="300" rx="250" ry="100" fill="url(#groundGrad)" />

      {/* Grid lines — ground plane */}
      {[330, 345, 360, 375, 390, 405].map((y, i) => (
        <line
          key={`h${i}`}
          x1={50 + i * 8}
          y1={y}
          x2={510 - i * 8}
          y2={y}
          stroke="#1976d2"
          strokeOpacity="0.25"
          strokeWidth="0.8"
        />
      ))}
      {[130, 170, 210, 250, 290, 330, 370, 410].map((x, i) => (
        <line
          key={`v${i}`}
          x1={x}
          y1={320}
          x2={x + (i < 4 ? -20 : 20)}
          y2={415}
          stroke="#1976d2"
          strokeOpacity="0.2"
          strokeWidth="0.8"
        />
      ))}

      {/* Roads */}
      <rect x="0" y="326" width="560" height="8" fill="#0a1f3a" opacity="0.5" rx="1" />
      <rect x="250" y="240" width="10" height="90" fill="#0a1f3a" opacity="0.4" rx="1" />
      <rect x="170" y="290" width="170" height="6" fill="#0a1f3a" opacity="0.35" rx="1" />

      {/* Road markings */}
      {[60, 100, 140, 180, 220, 300, 340, 380, 420, 460].map((x, i) => (
        <rect key={`road${i}`} x={x} y="329" width="16" height="2" fill="#ffffff" opacity="0.18" rx="1" />
      ))}

      {/* ── Buildings ── */}
      {/* Far left small */}
      <rect x="42" y="270" width="28" height="60" fill="url(#buildingGrad2)" rx="1" opacity="0.7" />
      <rect x="44" y="272" width="6" height="6" fill="#42a5f5" opacity="0.5" />
      <rect x="52" y="272" width="6" height="6" fill="#42a5f5" opacity="0.5" />
      <rect x="44" y="282" width="6" height="6" fill="#42a5f5" opacity="0.3" />
      <rect x="52" y="282" width="6" height="6" fill="#42a5f5" opacity="0.5" />

      {/* Left tower tall */}
      <rect x="80" y="190" width="38" height="140" fill="url(#buildingGrad1)" rx="1" />
      <rect x="80" y="180" width="38" height="12" fill="#1976d2" rx="1" />
      <rect x="97" y="168" width="4" height="14" fill="#42a5f5" opacity="0.8" />
      {[200, 212, 224, 236, 248, 260, 272, 284, 296].map((y, i) => (
        <g key={`w1g${i}`}>
          <rect x="84" y={y} width="7" height="8" fill="#42a5f5" opacity={i % 3 === 0 ? 0.7 : 0.3} />
          <rect x="94" y={y} width="7" height="8" fill="#42a5f5" opacity={i % 2 === 0 ? 0.5 : 0.2} />
          <rect x="104" y={y} width="7" height="8" fill="#42a5f5" opacity={i % 3 === 1 ? 0.6 : 0.25} />
        </g>
      ))}

      {/* Left wide mid */}
      <rect x="130" y="228" width="52" height="102" fill="#0d3a6a" rx="1" />
      <rect x="130" y="220" width="52" height="10" fill="#1565c0" rx="1" />
      {[236, 248, 260, 272, 284, 296, 308].map((y, i) => (
        <g key={`w2g${i}`}>
          <rect x="134" y={y} width="10" height="8" fill="#42a5f5" opacity={i % 2 === 0 ? 0.5 : 0.2} />
          <rect x="148" y={y} width="10" height="8" fill="#42a5f5" opacity={i % 3 === 0 ? 0.6 : 0.25} />
          <rect x="162" y={y} width="10" height="8" fill="#00b894" opacity={i % 4 === 0 ? 0.6 : 0.15} />
        </g>
      ))}

      {/* Central tower (tallest) */}
      <rect x="196" y="130" width="62" height="200" fill="url(#buildingGrad1)" rx="2" />
      <rect x="196" y="118" width="62" height="14" fill="#1976d2" rx="2" />
      <rect x="224" y="100" width="6" height="20" fill="#42a5f5" opacity="0.9" filter="url(#glow)" />
      <circle cx="227" cy="98" r="3" fill="#00b894" opacity="0.9" filter="url(#glow)" />
      {[140, 154, 168, 182, 196, 210, 224, 238, 252, 266, 280, 294].map((y, i) => (
        <g key={`wg${i}`}>
          <rect x="200" y={y} width="12" height="10" fill="#42a5f5" opacity={i % 2 === 0 ? 0.6 : 0.2} />
          <rect x="216" y={y} width="12" height="10" fill="#42a5f5" opacity={i % 3 === 1 ? 0.55 : 0.25} />
          <rect x="232" y={y} width="12" height="10" fill="#00b894" opacity={i % 4 === 0 ? 0.7 : 0.1} />
          <rect x="248" y={y} width="6" height="10" fill="#42a5f5" opacity={i % 3 === 2 ? 0.5 : 0.2} />
        </g>
      ))}

      {/* Right mid tower */}
      <rect x="276" y="172" width="48" height="158" fill="url(#buildingGrad2)" rx="1" />
      <rect x="276" y="162" width="48" height="12" fill="#1976d2" rx="1" />
      <rect x="298" y="150" width="4" height="14" fill="#42a5f5" opacity="0.7" />
      {[180, 193, 206, 219, 232, 245, 258, 271, 284, 297, 310].map((y, i) => (
        <g key={`w3g${i}`}>
          <rect x="280" y={y} width="10" height="9" fill="#42a5f5" opacity={i % 2 === 0 ? 0.55 : 0.2} />
          <rect x="294" y={y} width="10" height="9" fill="#42a5f5" opacity={i % 3 === 0 ? 0.5 : 0.15} />
          <rect x="308" y={y} width="10" height="9" fill="#00b894" opacity={i % 3 === 1 ? 0.5 : 0.1} />
        </g>
      ))}

      {/* Green accent building */}
      <rect x="338" y="210" width="44" height="120" fill="#0a2540" rx="1" />
      <rect x="338" y="200" width="44" height="12" fill="#00b894" rx="1" opacity="0.85" />
      {[220, 232, 244, 256, 268, 280, 292, 304].map((y, i) => (
        <g key={`w4g${i}`}>
          <rect x="342" y={y} width="9" height="8" fill="#00b894" opacity={i % 2 === 0 ? 0.55 : 0.2} />
          <rect x="354" y={y} width="9" height="8" fill="#00b894" opacity={i % 3 === 0 ? 0.6 : 0.15} />
          <rect x="366" y={y} width="9" height="8" fill="#42a5f5" opacity={i % 4 === 0 ? 0.5 : 0.1} />
        </g>
      ))}

      {/* Right smaller buildings */}
      <rect x="394" y="242" width="36" height="88" fill="url(#buildingGrad2)" rx="1" opacity="0.8" />
      <rect x="394" y="234" width="36" height="10" fill="#1976d2" rx="1" opacity="0.8" />
      {[250, 262, 274, 286, 298, 310].map((y, i) => (
        <g key={`w5g${i}`}>
          <rect x="398" y={y} width="8" height="7" fill="#42a5f5" opacity={0.4} />
          <rect x="409" y={y} width="8" height="7" fill="#42a5f5" opacity={0.25} />
          <rect x="420" y={y} width="6" height="7" fill="#00b894" opacity={i % 3 === 0 ? 0.5 : 0.1} />
        </g>
      ))}

      <rect x="442" y="260" width="28" height="70" fill="#0d3a6a" rx="1" opacity="0.75" />
      <rect x="444" y="264" width="7" height="6" fill="#42a5f5" opacity="0.4" />
      <rect x="454" y="264" width="7" height="6" fill="#42a5f5" opacity="0.3" />
      <rect x="444" y="274" width="7" height="6" fill="#00b894" opacity="0.35" />
      <rect x="454" y="274" width="7" height="6" fill="#42a5f5" opacity="0.25" />

      <rect x="480" y="278" width="24" height="52" fill="#0a2540" rx="1" opacity="0.65" />
      <rect x="482" y="282" width="5" height="5" fill="#42a5f5" opacity="0.35" />
      <rect x="490" y="282" width="5" height="5" fill="#42a5f5" opacity="0.25" />

      {/* ── Data network nodes ── */}
      {/* Node connections */}
      <line x1="99" y1="192" x2="227" y2="100" stroke="#00b894" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="4 4" />
      <line x1="227" y1="100" x2="300" y2="164" stroke="#42a5f5" strokeWidth="1" strokeOpacity="0.4" strokeDasharray="4 4" />
      <line x1="300" y1="164" x2="360" y2="200" stroke="#00b894" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="3 5" />
      <line x1="156" y1="220" x2="227" y2="100" stroke="#42a5f5" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="3 5" />
      <line x1="360" y1="200" x2="412" y2="238" stroke="#42a5f5" strokeWidth="0.8" strokeOpacity="0.25" strokeDasharray="3 4" />

      {/* Nodes */}
      <circle cx="99" cy="192" r="5" fill="#42a5f5" opacity="0.85" filter="url(#glow)" />
      <circle cx="99" cy="192" r="9" fill="#42a5f5" opacity="0.12" />
      <circle cx="156" cy="220" r="4" fill="#00b894" opacity="0.85" filter="url(#glow)" />
      <circle cx="156" cy="220" r="8" fill="#00b894" opacity="0.1" />
      <circle cx="300" cy="164" r="5" fill="#42a5f5" opacity="0.8" filter="url(#glow)" />
      <circle cx="300" cy="164" r="9" fill="#42a5f5" opacity="0.12" />
      <circle cx="360" cy="200" r="4" fill="#00b894" opacity="0.8" filter="url(#glow)" />
      <circle cx="360" cy="200" r="8" fill="#00b894" opacity="0.1" />
      <circle cx="412" cy="238" r="3" fill="#42a5f5" opacity="0.7" />
      <circle cx="412" cy="238" r="6" fill="#42a5f5" opacity="0.1" />

      {/* Data pulse dots on lines */}
      <circle cx="163" cy="146" r="2.5" fill="#00b894" opacity="0.9" filter="url(#glow)" />
      <circle cx="263" cy="132" r="2" fill="#42a5f5" opacity="0.8" />
      <circle cx="330" cy="182" r="2" fill="#00b894" opacity="0.75" />

      {/* Floating data chips */}
      <rect x="60" y="150" width="52" height="20" rx="4" fill="#0d3a6a" opacity="0.9" stroke="#1976d2" strokeWidth="0.8" strokeOpacity="0.6" />
      <rect x="64" y="156" width="8" height="8" rx="1" fill="#00b894" opacity="0.8" />
      <rect x="76" y="157" width="28" height="3" rx="1" fill="#42a5f5" opacity="0.5" />
      <rect x="76" y="162" width="18" height="2" rx="1" fill="#42a5f5" opacity="0.3" />

      <rect x="400" y="148" width="58" height="22" rx="4" fill="#0d3a6a" opacity="0.9" stroke="#00b894" strokeWidth="0.8" strokeOpacity="0.5" />
      <rect x="405" y="154" width="8" height="8" rx="1" fill="#42a5f5" opacity="0.8" />
      <rect x="417" y="155" width="32" height="3" rx="1" fill="#42a5f5" opacity="0.45" />
      <rect x="417" y="160" width="22" height="2" rx="1" fill="#00b894" opacity="0.35" />

      <rect x="118" y="340" width="46" height="18" rx="3" fill="#0a2540" opacity="0.85" stroke="#1976d2" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="141" y="352" fontSize="7" fill="#42a5f5" textAnchor="middle" opacity="0.8" fontFamily="monospace">IoT • 2847</text>

      <rect x="310" y="340" width="52" height="18" rx="3" fill="#0a2540" opacity="0.85" stroke="#00b894" strokeWidth="0.8" strokeOpacity="0.5" />
      <text x="336" y="352" fontSize="7" fill="#00b894" textAnchor="middle" opacity="0.8" fontFamily="monospace">99.8% uptime</text>

      {/* Solar panels on central building roof */}
      {[200, 210, 220, 230, 240, 248].map((x, i) => (
        <rect key={`sol${i}`} x={x} y="119" width="8" height="5" rx="0.5" fill="#00b894" opacity="0.6" />
      ))}

      {/* Wind turbines */}
      <line x1="490" y1="200" x2="490" y2="260" stroke="#1976d2" strokeWidth="1.5" strokeOpacity="0.5" />
      <ellipse cx="490" cy="200" rx="14" ry="3" fill="none" stroke="#42a5f5" strokeWidth="1" strokeOpacity="0.5" transform="rotate(-30 490 200)" />
      <circle cx="490" cy="200" r="2.5" fill="#42a5f5" opacity="0.8" />

      <line x1="510" y1="220" x2="510" y2="268" stroke="#1976d2" strokeWidth="1.2" strokeOpacity="0.4" />
      <ellipse cx="510" cy="220" rx="11" ry="2.5" fill="none" stroke="#42a5f5" strokeWidth="0.8" strokeOpacity="0.4" transform="rotate(-30 510 220)" />
      <circle cx="510" cy="220" r="2" fill="#42a5f5" opacity="0.6" />

      {/* Glow beneath city */}
      <ellipse cx="260" cy="334" rx="200" ry="18" fill="url(#glowBlue)" />
    </svg>
  )
}

// ── Icon components ───────────────────────────────────────────────────────────
function IconGrid({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconWifi({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <line x1="12" y1="20" x2="12.01" y2="20" strokeWidth="2.5" />
    </svg>
  )
}

function IconZap({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

function IconLeaf({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 8C8 10 5.9 16.17 3.82 22H3c0-9.94 5-16.5 14-14z" />
    </svg>
  )
}

function IconTruck({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13" rx="1" />
      <path d="M16 8h4l3 3v5h-7V8z" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  )
}

function IconShield({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconBarChart({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
      <line x1="2" y1="20" x2="22" y2="20" />
    </svg>
  )
}

function IconChevronDown({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
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

function IconArrowRight({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

// ── Nav ───────────────────────────────────────────────────────────────────────
const navLinks = ['Home', 'Services', 'About', 'Contact']

function Navbar({ scrolled, setView }: { scrolled: boolean; setView: (view: 'landing' | 'login' | 'register' | 'dashboard') => void }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(10,37,64,0.08)' : 'none',
        boxShadow: scrolled ? '0 2px 20px rgba(10,37,64,0.08)' : 'none',
      }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: scrolled ? '#0a2540' : 'rgba(255,255,255,0.15)', border: scrolled ? 'none' : '1px solid rgba(255,255,255,0.3)' }}
          >
            <IconGrid className={`w-4 h-4 ${scrolled ? 'text-[#00b894]' : 'text-white'}`} />
          </div>
          <span
            className="font-bold text-lg tracking-tight"
            style={{
              fontFamily: "'Sora', sans-serif",
              color: scrolled ? '#0a2540' : '#ffffff',
            }}
          >
            SmartCity<span style={{ color: '#00b894' }}>OS</span>
          </span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium transition-colors duration-200"
              style={{
                color: scrolled ? '#374151' : 'rgba(255,255,255,0.85)',
                fontFamily: "'Inter', sans-serif",
                textDecoration: 'none',
              }}
              onMouseEnter={e => (e.currentTarget.style.color = scrolled ? '#0a2540' : '#ffffff')}
              onMouseLeave={e => (e.currentTarget.style.color = scrolled ? '#374151' : 'rgba(255,255,255,0.85)')}
            >
              {link}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="#login"
            onClick={(e) => {
              e.preventDefault()
              setView('login')
            }}
            className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
            style={{
              color: scrolled ? '#0a2540' : 'rgba(255,255,255,0.9)',
              fontFamily: "'Inter', sans-serif",
              textDecoration: 'none',
            }}
          >
            Login
          </a>
          <button
            onClick={() => setView('register')}
            className="text-sm font-semibold px-5 py-2.5 rounded-lg transition-all duration-200"
            style={{
              background: '#00b894',
              color: '#ffffff',
              fontFamily: "'Sora', sans-serif",
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#00a381')}
            onMouseLeave={e => (e.currentTarget.style.background = '#00b894')}
          >
            Get Started
          </button>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg"
          style={{ color: scrolled ? '#0a2540' : '#ffffff', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <IconX /> : <IconMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden px-6 pb-6 flex flex-col gap-4"
          style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)' }}
        >
          {navLinks.map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-sm font-medium py-2"
              style={{ color: '#374151', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
              onClick={() => setMobileOpen(false)}
            >
              {link}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <a
              href="#login"
              onClick={(e) => {
                e.preventDefault()
                setView('login')
                setMobileOpen(false)
              }}
              className="text-sm font-medium px-4 py-2 rounded-lg"
              style={{ color: '#0a2540', textDecoration: 'none' }}
            >
              Login
            </a>
            <button
              onClick={() => {
                setView('register')
                setMobileOpen(false)
              }}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg"
              style={{ background: '#00b894', color: '#fff', border: 'none', cursor: 'pointer' }}
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Hero ──────────────────────────────────────────────────────────────────────
function Hero({ setView }: { setView: (view: 'landing' | 'login' | 'register' | 'dashboard') => void }) {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #061726 0%, #0a2540 40%, #0d3b6e 70%, #0e4d6c 100%)',
      }}
    >
      {/* Background dots */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(65,165,245,0.15) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />
      {/* Accent glow */}
      <div
        className="absolute top-1/4 right-1/4 pointer-events-none"
        style={{
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(0,184,148,0.12) 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute bottom-1/3 left-1/4 pointer-events-none"
        style={{
          width: 400,
          height: 400,
          background: 'radial-gradient(circle, rgba(66,165,245,0.1) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12 pt-28 pb-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left — text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-8 text-xs font-medium"
              style={{
                background: 'rgba(0,184,148,0.15)',
                border: '1px solid rgba(0,184,148,0.35)',
                color: '#4ecca3',
                fontFamily: "'Inter', sans-serif",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: '#00b894' }}
              />
              Next-Generation Urban Intelligence Platform
            </div>

            <h1
              className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight mb-6"
              style={{
                fontFamily: "'Sora', sans-serif",
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              The City That{' '}
              <span
                style={{
                  background: 'linear-gradient(90deg, #00b894 0%, #42a5f5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Thinks
              </span>{' '}
              <br />For You
            </h1>

            <p
              className="text-lg leading-relaxed mb-10 max-w-lg"
              style={{
                color: 'rgba(255,255,255,0.65)',
                fontFamily: "'Inter', sans-serif",
                fontWeight: 300,
              }}
            >
              SmartCityOS unifies infrastructure monitoring, energy management,
              citizen services, and real-time analytics into a single intelligent
              platform — built for the cities of tomorrow.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setView('register')}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm transition-all duration-200"
                style={{
                  background: '#00b894',
                  color: '#ffffff',
                  fontFamily: "'Sora', sans-serif",
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#00a381'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                Request a Demo
                <IconArrowRight className="w-4 h-4" />
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-medium text-sm transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  color: 'rgba(255,255,255,0.9)',
                  fontFamily: "'Inter', sans-serif",
                  border: '1px solid rgba(255,255,255,0.18)',
                  cursor: 'pointer',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.14)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
              >
                Watch Overview
              </button>
            </div>

            {/* Trust badges */}
            <div
              className="flex flex-wrap items-center gap-6 mt-12 pt-8"
              style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}
            >
              {['ISO 27001 Certified', 'GDPR Compliant', 'SOC 2 Type II'].map(badge => (
                <div key={badge} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,184,148,0.2)' }}>
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="none" stroke="#00b894" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>
                    {badge}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — city illustration */}
          <div className="relative flex items-center justify-center">
            <div
              className="relative w-full"
              style={{ maxWidth: 580, aspectRatio: '4/3' }}
            >
              {/* Glow behind illustration */}
              <div
                className="absolute inset-0 rounded-3xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(0,184,148,0.08) 0%, transparent 70%)' }}
              />
              <CitySVG />
            </div>

            {/* Floating metric cards */}
            <div
              className="absolute top-8 left-0 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(10,25,50,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(66,165,245,0.3)',
              }}
            >
              <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>Energy Saved Today</div>
              <div className="font-bold text-xl" style={{ color: '#00b894', fontFamily: "'Sora', sans-serif" }}>
                18.4 <span className="text-sm font-normal">MWh</span>
              </div>
            </div>

            <div
              className="absolute bottom-12 right-0 px-4 py-3 rounded-xl"
              style={{
                background: 'rgba(10,25,50,0.85)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(0,184,148,0.3)',
              }}
            >
              <div className="text-xs mb-0.5" style={{ color: 'rgba(255,255,255,0.5)', fontFamily: "'Inter', sans-serif" }}>Active IoT Sensors</div>
              <div className="font-bold text-xl" style={{ color: '#42a5f5', fontFamily: "'Sora', sans-serif" }}>
                2,847
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-40">
        <span className="text-xs text-white" style={{ fontFamily: "'Inter', sans-serif" }}>Scroll</span>
        <IconChevronDown className="w-4 h-4 text-white animate-bounce" />
      </div>
    </section>
  )
}

// ── Features ──────────────────────────────────────────────────────────────────
const features = [
  {
    icon: IconWifi,
    title: 'IoT Infrastructure',
    desc: 'Connect thousands of sensors and edge devices across the city grid with sub-50ms latency and 99.9% uptime guarantees.',
    color: '#42a5f5',
    bg: 'rgba(66,165,245,0.08)',
  },
  {
    icon: IconZap,
    title: 'Smart Energy Grid',
    desc: 'AI-driven load balancing and renewable integration reduces municipal energy costs by up to 34% in the first year.',
    color: '#00b894',
    bg: 'rgba(0,184,148,0.08)',
  },
  {
    icon: IconLeaf,
    title: 'Environmental Monitoring',
    desc: 'Real-time air quality, noise, and waste management dashboards give administrators actionable environmental insights.',
    color: '#26a69a',
    bg: 'rgba(38,166,154,0.08)',
  },
  {
    icon: IconTruck,
    title: 'Traffic & Mobility',
    desc: 'Adaptive traffic signal control and predictive routing reduce average commute times and carbon emissions simultaneously.',
    color: '#1976d2',
    bg: 'rgba(25,118,210,0.08)',
  },
  {
    icon: IconShield,
    title: 'Public Safety',
    desc: 'Integrated emergency response coordination with intelligent dispatch routing and predictive incident modeling.',
    color: '#e57373',
    bg: 'rgba(229,115,115,0.08)',
  },
  {
    icon: IconBarChart,
    title: 'City Analytics',
    desc: 'Unified data platform with natural-language querying, automated reports, and predictive forecasting for city planners.',
    color: '#7986cb',
    bg: 'rgba(121,134,203,0.08)',
  },
]

function Features() {
  return (
    <section id="services" className="py-24 lg:py-32" style={{ background: '#ffffff' }}>
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-20">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(0,184,148,0.1)',
              color: '#00b894',
              fontFamily: "'Inter', sans-serif",
              border: '1px solid rgba(0,184,148,0.2)',
            }}
          >
            Platform Services
          </div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            style={{ fontFamily: "'Sora', sans-serif", color: '#0a2540', letterSpacing: '-0.02em' }}
          >
            Every system a city needs,<br />in one platform.
          </h2>
          <p
            className="text-base leading-relaxed"
            style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
          >
            SmartCityOS integrates disparate municipal systems into a cohesive operational layer,
            reducing vendor complexity and enabling data-driven governance.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((f, i) => {
            const Icon = f.icon
            return (
              <div
                key={i}
                className="group p-8 rounded-2xl transition-all duration-300"
                style={{
                  background: '#f9fafb',
                  border: '1px solid rgba(10,37,64,0.06)',
                  cursor: 'default',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = '#fff'
                  e.currentTarget.style.border = `1px solid ${f.color}30`
                  e.currentTarget.style.boxShadow = `0 8px 32px ${f.color}12`
                  e.currentTarget.style.transform = 'translateY(-3px)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = '#f9fafb'
                  e.currentTarget.style.border = '1px solid rgba(10,37,64,0.06)'
                  e.currentTarget.style.boxShadow = 'none'
                  e.currentTarget.style.transform = 'translateY(0)'
                }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: f.bg }}
                >
                  <div style={{ color: f.color }}>
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <h3
                  className="text-lg font-semibold mb-3"
                  style={{ fontFamily: "'Sora', sans-serif", color: '#0a2540' }}
                >
                  {f.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: '#6b7280', fontFamily: "'Inter', sans-serif" }}
                >
                  {f.desc}
                </p>
                <div
                  className="flex items-center gap-1 mt-5 text-xs font-medium transition-colors duration-200"
                  style={{ color: f.color, fontFamily: "'Inter', sans-serif" }}
                >
                  Learn more
                  <IconArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── Stats ─────────────────────────────────────────────────────────────────────
const stats = [
  { value: '140+', label: 'Cities Deployed', sub: 'Across 28 countries' },
  { value: '2.3M', label: 'IoT Endpoints', sub: 'Active and monitored' },
  { value: '34%', label: 'Energy Savings', sub: 'Average per municipality' },
  { value: '99.97%', label: 'Platform Uptime', sub: 'Over the last 36 months' },
]

function Stats({ setView }: { setView: (view: 'landing' | 'login' | 'register' | 'dashboard') => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) setVisible(true) },
      { threshold: 0.3 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <section
      id="about"
      ref={ref}
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #0a2540 0%, #0d3b6e 50%, #0e4d6c 100%)' }}
    >
      {/* Dot bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent 0%, #00b894 50%, transparent 100%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
        {/* Section header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-3 py-1 rounded-full text-xs font-semibold mb-4"
            style={{
              background: 'rgba(0,184,148,0.15)',
              color: '#4ecca3',
              fontFamily: "'Inter', sans-serif",
              border: '1px solid rgba(0,184,148,0.3)',
            }}
          >
            Platform at Scale
          </div>
          <h2
            className="text-3xl md:text-4xl font-bold text-white"
            style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '-0.02em' }}
          >
            Trusted by forward-thinking cities
          </h2>
          <p
            className="mt-3 text-base max-w-xl mx-auto"
            style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif" }}
          >
            From mid-size municipalities to megacities, SmartCityOS scales to meet
            the complexity of any urban environment.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="text-center px-8 py-10 rounded-2xl transition-all duration-500"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(24px)',
                transitionDelay: `${i * 100}ms`,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.35)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
            >
              <div
                className="text-4xl lg:text-5xl font-bold mb-2"
                style={{
                  fontFamily: "'Sora', sans-serif",
                  background: 'linear-gradient(90deg, #00b894 0%, #42a5f5 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </div>
              <div
                className="text-base font-semibold mb-1"
                style={{ color: '#ffffff', fontFamily: "'Sora', sans-serif" }}
              >
                {s.label}
              </div>
              <div
                className="text-xs"
                style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}
              >
                {s.sub}
              </div>
            </div>
          ))}
        </div>

        {/* CTA strip */}
        <div
          className="mt-16 rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: 'rgba(0,184,148,0.1)',
            border: '1px solid rgba(0,184,148,0.25)',
          }}
        >
          <div>
            <h3
              className="text-xl font-bold text-white mb-1"
              style={{ fontFamily: "'Sora', sans-serif" }}
            >
              Ready to transform your city?
            </h3>
            <p
              className="text-sm"
              style={{ color: 'rgba(255,255,255,0.55)', fontFamily: "'Inter', sans-serif" }}
            >
              Join 140+ cities already operating smarter with SmartCityOS.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setView('register')}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-200"
              style={{
                background: '#00b894',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'Sora', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#00a381'}
              onMouseLeave={e => e.currentTarget.style.background = '#00b894'}
            >
              Schedule a Demo
            </button>
            <button
              className="px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.85)',
                border: '1px solid rgba(255,255,255,0.18)',
                cursor: 'pointer',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Footer ────────────────────────────────────────────────────────────────────
const footerLinks = {
  Platform: ['Dashboard', 'IoT Management', 'Analytics', 'Integrations', 'API Docs'],
  Solutions: ['Smart Traffic', 'Energy Grid', 'Waste Management', 'Public Safety', 'E-Gov'],
  Company: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'],
  Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security'],
}

function Footer() {
  return (
    <footer id="contact" style={{ background: '#061726' }}>
      {/* Top divider */}
      <div className="h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-12 py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8 mb-16">
          {/* Brand column */}
          <div className="lg:col-span-2 max-w-sm">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.08)' }}>
                <IconGrid className="w-5 h-5 text-[#00b894]" />
              </div>
              <span className="font-bold text-xl text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                SmartCity<span style={{ color: '#00b894' }}>OS</span>
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}>
              The intelligent operating system for the modern city. Connecting infrastructure,
              people, and data to build more sustainable, efficient, and equitable urban environments.
            </p>
            <div className="flex gap-3">
              {['tw', 'li', 'gh', 'yt'].map(s => (
                <div
                  key={s}
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-mono uppercase transition-all duration-200 cursor-pointer"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.5)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,184,148,0.15)'; e.currentTarget.style.color = '#00b894'; e.currentTarget.style.borderColor = 'rgba(0,184,148,0.3)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                >
                  {s}
                </div>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4
                className="text-xs font-semibold uppercase tracking-widest mb-5"
                style={{ color: 'rgba(255,255,255,0.35)', fontFamily: "'Inter', sans-serif" }}
              >
                {category}
              </h4>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm transition-colors duration-200"
                      style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#ffffff')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div
          className="rounded-2xl p-6 md:p-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div>
            <h4 className="font-semibold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
              City Intelligence Newsletter
            </h4>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}>
              Monthly insights on smart city trends, case studies, and platform updates.
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="city@municipality.gov"
              className="flex-1 md:w-64 px-4 py-2.5 rounded-lg text-sm outline-none transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.12)',
                color: '#ffffff',
                fontFamily: "'Inter', sans-serif",
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(0,184,148,0.5)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
            />
            <button
              className="px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap"
              style={{ background: '#00b894', color: '#fff', border: 'none', cursor: 'pointer', fontFamily: "'Sora', sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = '#00a381'}
              onMouseLeave={e => e.currentTarget.style.background = '#00b894'}
            >
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)', fontFamily: "'Inter', sans-serif" }}>
            © 2024 SmartCityOS Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map(item => (
              <a
                key={item}
                href="#"
                className="text-xs transition-colors duration-200"
                style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontFamily: "'Inter', sans-serif" }}
                onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.3)'}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

// ── Global Location Permission Modal ─────────────────────────────────────────
function LocationPermissionModal({ onAllow, onDecline }: { onAllow: () => void; onDecline: () => void }) {
  return (
    <div
      className="fixed inset-0 z-[300] flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(5,12,25,0.85)', backdropFilter: 'blur(10px)' }}
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
              <span className="absolute rounded-full bg-[#00b894]/20 animate-ping" style={{ width: 72, height: 72, left: -4, top: -4 }} />
              <span className="absolute rounded-full bg-[#00b894]/10 animate-ping" style={{ width: 88, height: 88, left: -12, top: -12, animationDelay: '0.35s' }} />
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
              SmartCityOS needs your location to auto-fill complaint addresses, show nearby incidents on the traffic grid, and deliver hyperlocal civic services.
            </p>
          </div>

          {/* Use-cases */}
          <div className="space-y-2.5 mb-6">
            {[
              { icon: '📋', label: 'Complaints', desc: 'Auto-fill your current location when filing a grievance' },
              { icon: '🚦', label: 'Traffic Grid', desc: 'See incidents and camera alerts nearest to you' },
              { icon: '🌦️', label: 'Weather & AQI', desc: 'Get hyperlocal air quality and forecast alerts' },
            ].map(item => (
              <div key={item.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}
              >
                <span className="text-lg flex-shrink-0">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-white block">{item.label}</span>
                  <span className="text-[11px] text-slate-500">{item.desc}</span>
                </div>
                <svg className="w-4 h-4 text-[#00b894] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
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
              Your location is stored locally on your device only and is never shared with third parties.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onDecline}
              className="flex-1 py-3 rounded-2xl text-sm font-semibold text-slate-400 hover:text-slate-200 transition-colors cursor-pointer border-none"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              Not Now
            </button>
            <button
              onClick={onAllow}
              className="flex-1 py-3 rounded-2xl text-sm font-bold text-white cursor-pointer border-none transition-all hover:opacity-90 flex items-center justify-center gap-2"
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
  )
}

// App
export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [view, setViewRaw] = useState<'landing' | 'login' | 'register' | 'dashboard' | 'complaint'>(() => {
    const saved = (localStorage.getItem('scm_view') as any) || 'landing'
    // Guard: if saved view needs auth but no session exists, go to login
    if (saved === 'dashboard' || saved === 'complaint') {
      const user = localStorage.getItem('scm_current_user')
      if (!user) return 'login'
    }
    return saved
  })

  const setView = (newView: 'landing' | 'login' | 'register' | 'dashboard' | 'complaint') => {
    localStorage.setItem('scm_view', newView)
    setViewRaw(newView)
  }

  // ── Global Location Permission State ──
  const [showLocationModal, setShowLocationModal] = useState(false)
  const [locationResolve, setLocationResolve] = useState<((granted: boolean) => void) | null>(null)

  // Call this from any page/component that needs location
  const requestLocation = (): Promise<boolean> => {
    const permission = localStorage.getItem('scm_location_permission')
    if (permission === 'granted') return Promise.resolve(true)

    // Show our custom modal and wait for user decision
    return new Promise((resolve) => {
      setLocationResolve(() => resolve)
      setShowLocationModal(true)
    })
  }

  const handleAllowLocation = () => {
    setShowLocationModal(false)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          localStorage.setItem('scm_location_coords', JSON.stringify({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: new Date().toISOString()
          }))
          localStorage.setItem('scm_location_permission', 'granted')
          if (locationResolve) locationResolve(true)
          setLocationResolve(null)
        },
        () => {
          localStorage.setItem('scm_location_permission', 'denied')
          if (locationResolve) locationResolve(false)
          setLocationResolve(null)
        }
      )
    } else {
      if (locationResolve) locationResolve(false)
      setLocationResolve(null)
    }
  }

  const handleDeclineLocation = () => {
    setShowLocationModal(false)
    // Do NOT save to localStorage — ask again next time they need location
    if (locationResolve) locationResolve(false)
    setLocationResolve(null)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [view])

  if (view === 'login') {
    return (
      <LoginPage
        onBack={() => setView('landing')}
        onRegister={() => setView('register')}
        onSuccess={() => setView('dashboard')}
      />
    )
  }

  if (view === 'register') {
    return <RegisterPage onBack={() => setView('landing')} onLogin={() => setView('login')} />
  }

  if (view === 'dashboard') {
    return (
      <>
        {showLocationModal && (
          <LocationPermissionModal onAllow={handleAllowLocation} onDecline={handleDeclineLocation} />
        )}
        <DashboardPage
          onLogout={() => {
            localStorage.removeItem('scm_current_user')
            localStorage.removeItem('scm_view')
            localStorage.removeItem('scm_last_tab')
            setView('landing')
          }}
          onComplaint={() => setView('complaint')}
          requestLocation={requestLocation}
        />
      </>
    )
  }

  if (view === 'complaint') {
    return (
      <>
        {showLocationModal && (
          <LocationPermissionModal onAllow={handleAllowLocation} onDecline={handleDeclineLocation} />
        )}
        <ComplaintPage onBack={() => setView('dashboard')} requestLocation={requestLocation} />
      </>
    )
  }

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar scrolled={scrolled} setView={setView} />
      <Hero setView={setView} />
      <Features />
      <Stats setView={setView} />
      <Footer />
    </div>
  )
}
