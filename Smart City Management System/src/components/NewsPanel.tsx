import { useState, useEffect } from 'react'

// ── Icons ────────────────────────────────────────────────────────────────────
const CalendarIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

const MapPinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
)

const SearchIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const XIcon = ({ className = 'w-5 h-5' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
)

// ── Types ────────────────────────────────────────────────────────────────────
interface NewsArticle {
  _id?: string;
  id?: string; // fallback
  title: string;
  description: string;
  category: string;
  image?: string;
  location?: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  published: boolean;
  createdAt: string;
}

const CATEGORIES = [
  'All News',
  'Latest News',
  'Emergency Alerts',
  'Traffic Updates',
  'Road/Construction Updates',
  'Water Supply Updates',
  'Garbage Collection Updates',
  'City Events'
]

const fallbackNews: NewsArticle[] = [
  {
    _id: '1',
    title: 'Metro Line 4 Expansion Project Approved',
    description: 'The City Development Authority has officially greenlit the Metro Line 4 expansion. This new route will add 12 kilometers of rapid rail transit connecting Sector 15 to the Industrial Development Zone. The project features state-of-the-art smart railway stations equipped with solar rooftops, energy-efficient LED light controls, and automated ticketing gates. Construction is set to begin in October 2026, with an estimated completion date in late 2028. Commuters can expect average travel times to be cut in half once operational.',
    category: 'Road/Construction Updates',
    location: 'Sector 15 to Industrial Zone',
    priority: 'High',
    published: true,
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Scheduled Water Outage in Sector 9 & 10',
    description: 'A scheduled maintenance and piping replacement at the Central Water Purification Plant will result in temporary water outages and low pressure in Sectors 9 and 10 this coming Thursday. Outages are scheduled to run from 9:00 AM to 5:00 PM. Residents are advised to store sufficient water in advance. The Municipal Corporation is deploying water tankers to major residential blocks for emergency requirements.',
    category: 'Water Supply Updates',
    location: 'Sector 9 & 10',
    priority: 'High',
    published: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: '3',
    title: 'Traffic Alert: Road Closure on High Street Road',
    description: 'Due to repair work on a ruptured sewage line under High Street Road, traffic is diverted between Junction 3 and Junction 4. Drivers are advised to use the Outer Ring Road as an alternative route. The diversion is expected to remain active for the next 48 hours. Traffic marshals have been deployed at key junctions to direct vehicle flow and minimize congestion.',
    category: 'Traffic Updates',
    location: 'High Street Road, Junction 3-4',
    priority: 'Medium',
    published: true,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    _id: '4',
    title: 'CRITICAL ALERT: Heavy Rainfall & Flash Flood Advisory',
    description: 'The Meteorological Department has issued a red warning for heavy to extremely heavy rainfall over the next 24 hours. Low-lying areas near the river banks, specifically Riverside Blocks in Sector 3, are at risk of waterlogging and flash floods. Citizens are urged to stay indoors, avoid traveling through flooded roads, and follow instructions from civil defense authorities.',
    category: 'Emergency Alerts',
    location: 'Riverside Blocks, Sector 3',
    priority: 'Critical',
    published: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
]

export default function NewsPanel() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All News')
  const [selectedArticle, setSelectedArticle] = useState<NewsArticle | null>(null)
  const [loading, setLoading] = useState(true)
  const [liveSource, setLiveSource] = useState(false)

  // Fetch news: try live API first → local DB → localStorage → static fallback
  const fetchNews = async () => {
    setLoading(true)
    try {
      // 1️⃣ Try live News via backend proxy
      const url = new URL(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`/api/news/live')
      if (search.trim()) url.searchParams.append('q', search.trim())
      
      const liveRes = await fetch(url.toString())
      if (liveRes.ok) {
        const liveResult = await liveRes.json()
        if (liveResult.success && liveResult.data && liveResult.data.length > 0) {
          setNews(liveResult.data)
          setLiveSource(true)
          setLoading(false)
          return
        }
      }
    } catch (_) {}

    try {
      // 2️⃣ Try local MongoDB DB news (admin-created articles)
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}`/api/news')
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data && result.data.length > 0) {
          setNews(result.data)
          setLiveSource(false)
          setLoading(false)
          return
        }
      }
      throw new Error('API failed')
    } catch (_) {
      console.warn('Backend unreachable. Using localStorage / fallback data.')
      const stored = localStorage.getItem('scm_news_db')
      if (stored) {
        try {
          const parsed = JSON.parse(stored) as NewsArticle[]
          setNews(parsed.filter(item => item.published))
        } catch {
          setNews(fallbackNews)
        }
      } else {
        setNews(fallbackNews)
        localStorage.setItem('scm_news_db', JSON.stringify(fallbackNews))
      }
      setLiveSource(false)
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchNews()
    // Event listener to refresh news when administrative edits occur
    window.addEventListener('scm_news_updated', fetchNews)
    return () => window.removeEventListener('scm_news_updated', fetchNews)
  }, [])

  // Auto-search when user types (debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Don't fetch again on initial mount if search is empty (initial load handles it)
      fetchNews()
    }, 800)

    return () => clearTimeout(delayDebounceFn)
  }, [search])

  // Filter news
  const filteredNews = news.filter(article => {
    // If it's a live source, the API already did the search filter, so bypass local text match
    const matchesSearch = liveSource ? true : (
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase()) ||
      (article.location && article.location.toLowerCase().includes(search.toLowerCase()))
    )
    
    const matchesCategory =
      selectedCategory === 'All News' || article.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* ── Search and Filter Controls ── */}
      <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
              <SearchIcon />
            </span>
            <input
              type="text"
              placeholder="Search news, updates, or locations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all"
            />
          </div>
          {/* Live data badge */}
          {liveSource && !loading && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[11px] font-bold text-red-400 uppercase tracking-wide">Live</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.slice(0, 4).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap cursor-pointer transition-all border border-solid ${
                selectedCategory === cat
                  ? 'bg-[#00b894] text-white border-[#00b894]'
                  : 'bg-slate-800/40 text-slate-400 border-slate-800/60 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Category Pill Filters (Sub-menu) */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.slice(4).map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap cursor-pointer transition-all border border-solid ${
              selectedCategory === cat
                ? 'bg-[#00b894] text-white border-[#00b894]'
                : 'bg-slate-800/20 text-slate-500 border-slate-800/40 hover:text-slate-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ── News Articles Grid ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00b894] border-t-transparent" />
          <p className="text-slate-400 text-sm">Fetching city updates...</p>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center border border-slate-800 border-solid py-20">
          <span className="text-4xl block mb-3">📰</span>
          <h3 className="text-lg font-bold text-white mb-1">No news updates found</h3>
          <p className="text-slate-500 text-sm max-w-xs mx-auto">
            Try adjusting your search keywords or choosing a different category.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map(article => (
            <div
              key={article._id || article.id}
              className="glass-card rounded-3xl border border-slate-800/60 overflow-hidden flex flex-col justify-between hover:scale-[1.01] hover:border-slate-700 transition-all"
            >
              <div>
                {/* News Image */}
                <div className="h-44 w-full bg-slate-900 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-800 flex items-center justify-center text-4xl">
                    🏙️
                  </div>
                  {article.image && (
                    <img 
                      src={article.image} 
                      alt={article.title} 
                      className="w-full h-full object-cover relative z-10" 
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {/* Category Badge */}
                  <span className="absolute top-3 left-3 bg-[#0a1626]/90 border border-slate-800 text-[#00b894] text-[10px] font-bold px-2.5 py-1 rounded-lg">
                    {article.category}
                  </span>
                  {/* Priority Tag */}
                  <span className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-lg ${
                    article.priority === 'Critical'
                      ? 'bg-rose-500/90 text-white'
                      : article.priority === 'High'
                      ? 'bg-amber-500/90 text-white'
                      : 'bg-blue-500/90 text-white'
                  }`}>
                    {article.priority}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <h4 className="text-base font-black text-white line-clamp-2 leading-snug">
                    {article.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                    {article.description}
                  </p>
                </div>
              </div>

              {/* Footer metadata */}
              <div className="px-5 pb-5 pt-3 border-t border-slate-900/60 flex flex-col gap-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1">
                    <CalendarIcon />
                    {formatDate(article.createdAt)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    {(article as any).isLive && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                        <span className="text-red-400 font-bold text-[10px]">LIVE</span>
                      </span>
                    )}
                    {article.location && (
                      <span className="flex items-center gap-1 max-w-[120px] truncate">
                        <MapPinIcon />
                        {article.location}
                      </span>
                    )}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedArticle(article)}
                    className="flex-1 py-2.5 rounded-xl bg-slate-800/40 hover:bg-[#00b894] hover:text-white text-slate-300 text-xs font-bold transition-all border border-solid border-slate-800 hover:border-[#00b894] cursor-pointer"
                  >
                    Read More
                  </button>
                  {(article as any).sourceUrl && (
                    <a
                      href={(article as any).sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-700 text-slate-400 hover:text-white text-xs font-bold transition-all border border-solid border-slate-800 cursor-pointer flex items-center gap-1 no-underline"
                      title="Open original article"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── News Article Details Modal ── */}
      {selectedArticle && (
        <div className="fixed inset-0 z-[600] flex items-center justify-center p-4" style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-2xl bg-[#0a1626] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl relative animate-scale-up">
            {/* Top Close bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/40">
              <span className="text-xs font-bold text-[#00b894] uppercase tracking-wider">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
              >
                <XIcon />
              </button>
            </div>

            <div className="overflow-y-auto max-h-[80vh]">
              {/* Cover Image */}
              {selectedArticle.image && (
                <div className="h-64 w-full bg-slate-900">
                  <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-full object-cover" />
                </div>
              )}

              {/* Main article text */}
              <div className="p-6 md:p-8 space-y-5">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md ${
                    selectedArticle.priority === 'Critical'
                      ? 'bg-rose-500/10 text-rose-400'
                      : selectedArticle.priority === 'High'
                      ? 'bg-amber-500/10 text-amber-400'
                      : 'bg-blue-500/10 text-[#42a5f5]'
                  }`}>
                    {selectedArticle.priority} Priority
                  </span>
                  <span className="text-xs text-slate-500 font-mono">
                    Published: {formatDate(selectedArticle.createdAt)}
                  </span>
                  {selectedArticle.location && (
                    <span className="text-xs text-slate-400 font-semibold bg-slate-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <MapPinIcon />
                      {selectedArticle.location}
                    </span>
                  )}
                </div>

                <h3 className="text-xl md:text-2xl font-black text-white leading-tight">
                  {selectedArticle.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {selectedArticle.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-900 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white border-none cursor-pointer transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
