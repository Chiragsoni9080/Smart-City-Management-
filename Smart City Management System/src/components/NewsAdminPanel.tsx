import { useState, useEffect, useRef } from 'react'

// ── Types ────────────────────────────────────────────────────────────────────
interface NewsArticle {
  _id?: string
  id?: string
  title: string
  description: string
  category: string
  image?: string
  location?: string
  priority: 'Low' | 'Medium' | 'High' | 'Critical'
  published: boolean
  createdBy?: string
  createdAt: string
  updatedAt?: string
}

const CATEGORIES = [
  'Latest News',
  'Emergency Alerts',
  'Traffic Updates',
  'Road/Construction Updates',
  'Water Supply Updates',
  'Garbage Collection Updates',
  'City Events'
]

const PRIORITIES: NewsArticle['priority'][] = ['Low', 'Medium', 'High', 'Critical']

// ── Icons ────────────────────────────────────────────────────────────────────
const PlusIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14m7-7H5" />
  </svg>
)

const EditIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
)

const TrashIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
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

const ImageIcon = ({ className = 'w-6 h-6' }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
)

// Default fallback seed data for when backend is unreachable
const seedNewsData: NewsArticle[] = [
  {
    _id: '1',
    title: 'Metro Line 4 Expansion Project Approved',
    description: 'The City Development Authority has officially greenlit the Metro Line 4 expansion connecting Sector 15 to the Industrial Development Zone.',
    category: 'Road/Construction Updates',
    location: 'Sector 15 to Industrial Zone',
    priority: 'High',
    published: true,
    createdBy: 'Admin',
    createdAt: new Date().toISOString()
  },
  {
    _id: '2',
    title: 'Scheduled Water Outage in Sector 9 & 10',
    description: 'A scheduled maintenance at the Central Water Purification Plant will result in temporary water outages in Sectors 9 and 10 this coming Thursday.',
    category: 'Water Supply Updates',
    location: 'Sector 9 & 10',
    priority: 'High',
    published: true,
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString()
  },
  {
    _id: '3',
    title: 'Traffic Alert: Road Closure on High Street Road',
    description: 'Due to repair work on a ruptured sewage line under High Street Road, traffic is diverted between Junction 3 and Junction 4.',
    category: 'Traffic Updates',
    location: 'High Street Road, Junction 3-4',
    priority: 'Medium',
    published: true,
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
  },
  {
    _id: '4',
    title: 'CRITICAL: Heavy Rainfall & Flash Flood Advisory',
    description: 'The Meteorological Department has issued a red warning for heavy to extremely heavy rainfall. Low-lying areas near the river banks are at risk.',
    category: 'Emergency Alerts',
    location: 'Riverside Blocks, Sector 3',
    priority: 'Critical',
    published: true,
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    _id: '5',
    title: 'Annual Smart City Innovation Expo 2026',
    description: 'The annual SmartCityOS Innovation Expo will be held at Convention Center Sector 18. Over 120 exhibitors showcasing technology solutions for municipal governance.',
    category: 'City Events',
    location: 'Convention Center, Sector 18',
    priority: 'Low',
    published: false,
    createdBy: 'Admin',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString()
  }
]

// ── Main Component ───────────────────────────────────────────────────────────
export default function NewsAdminPanel() {
  const [news, setNews] = useState<NewsArticle[]>([])
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategory, setFormCategory] = useState(CATEGORIES[0])
  const [formLocation, setFormLocation] = useState('')
  const [formPriority, setFormPriority] = useState<NewsArticle['priority']>('Medium')
  const [formPublished, setFormPublished] = useState(false)
  const [formImage, setFormImage] = useState('')
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 3500)
  }

  // ── Data fetching ──
  const fetchNews = async () => {
    setLoading(true)
    try {
      const response = await fetch('http://localhost:5000/api/news?adminMode=true', {
        headers: {
          'x-user-role': 'admin',
          'x-user-email': 'admin@municipality.gov'
        }
      })
      if (response.ok) {
        const result = await response.json()
        if (result.success && result.data) {
          setNews(result.data)
          setLoading(false)
          return
        }
      }
      throw new Error('API failed')
    } catch {
      // Fallback to localStorage
      const stored = localStorage.getItem('scm_news_db')
      if (stored) {
        try {
          setNews(JSON.parse(stored))
        } catch {
          setNews(seedNewsData)
          localStorage.setItem('scm_news_db', JSON.stringify(seedNewsData))
        }
      } else {
        setNews(seedNewsData)
        localStorage.setItem('scm_news_db', JSON.stringify(seedNewsData))
      }
      setLoading(false)
    }
  }

  useEffect(() => { fetchNews() }, [])

  // Persist to localStorage fallback
  const persistLocal = (updated: NewsArticle[]) => {
    localStorage.setItem('scm_news_db', JSON.stringify(updated))
    // Dispatch event so NewsPanel (user-side) also refreshes
    window.dispatchEvent(new Event('scm_news_updated'))
  }

  // ── CRUD Handlers ──
  const resetForm = () => {
    setEditingId(null)
    setFormTitle('')
    setFormDescription('')
    setFormCategory(CATEGORIES[0])
    setFormLocation('')
    setFormPriority('Medium')
    setFormPublished(false)
    setFormImage('')
    setShowForm(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      showToast('⚠️ Image must be under 5 MB')
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => setFormImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleSubmit = async () => {
    if (!formTitle.trim() || !formDescription.trim()) {
      showToast('⚠️ Title and description are required')
      return
    }

    const payload = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      category: formCategory,
      location: formLocation.trim() || 'City Wide',
      priority: formPriority,
      published: formPublished,
      image: formImage,
      createdBy: 'Admin'
    }

    try {
      const url = editingId
        ? `http://localhost:5000/api/news/${editingId}`
        : 'http://localhost:5000/api/news'
      const method = editingId ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          'x-user-email': 'admin@municipality.gov'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        showToast(editingId ? '✅ News article updated' : '✅ News article created')
        resetForm()
        fetchNews()
        return
      }
      throw new Error('API failed')
    } catch {
      // Fallback localStorage CRUD
      if (editingId) {
        const updated = news.map(n =>
          (n._id === editingId || n.id === editingId)
            ? { ...n, ...payload, updatedAt: new Date().toISOString() }
            : n
        )
        setNews(updated)
        persistLocal(updated)
        showToast('✅ News article updated (local)')
      } else {
        const newArticle: NewsArticle = {
          ...payload,
          _id: String(Date.now()),
          createdAt: new Date().toISOString()
        }
        const updated = [newArticle, ...news]
        setNews(updated)
        persistLocal(updated)
        showToast('✅ News article created (local)')
      }
      resetForm()
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'DELETE',
        headers: {
          'x-user-role': 'admin',
          'x-user-email': 'admin@municipality.gov'
        }
      })
      if (response.ok) {
        showToast('🗑️ Article deleted')
        setDeleteConfirmId(null)
        fetchNews()
        return
      }
      throw new Error('API failed')
    } catch {
      const updated = news.filter(n => n._id !== id && n.id !== id)
      setNews(updated)
      persistLocal(updated)
      setDeleteConfirmId(null)
      showToast('🗑️ Article deleted (local)')
    }
  }

  const handleTogglePublish = async (article: NewsArticle) => {
    const id = article._id || article.id
    try {
      const response = await fetch(`http://localhost:5000/api/news/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-role': 'admin',
          'x-user-email': 'admin@municipality.gov'
        },
        body: JSON.stringify({ ...article, published: !article.published })
      })
      if (response.ok) {
        showToast(article.published ? '📝 Unpublished' : '🚀 Published')
        fetchNews()
        return
      }
      throw new Error('API failed')
    } catch {
      const updated = news.map(n =>
        (n._id === id || n.id === id) ? { ...n, published: !n.published } : n
      )
      setNews(updated)
      persistLocal(updated)
      showToast(article.published ? '📝 Unpublished (local)' : '🚀 Published (local)')
    }
  }

  const handleEdit = (article: NewsArticle) => {
    setEditingId(article._id || article.id || null)
    setFormTitle(article.title)
    setFormDescription(article.description)
    setFormCategory(article.category)
    setFormLocation(article.location || '')
    setFormPriority(article.priority)
    setFormPublished(article.published)
    setFormImage(article.image || '')
    setShowForm(true)
  }

  // ── Filtering ──
  const filtered = news.filter(article => {
    const matchSearch =
      article.title.toLowerCase().includes(search.toLowerCase()) ||
      article.description.toLowerCase().includes(search.toLowerCase()) ||
      (article.location && article.location.toLowerCase().includes(search.toLowerCase()))
    const matchCategory = !filterCategory || article.category === filterCategory
    return matchSearch && matchCategory
  })

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast */}
      {toast && (
        <div className="fixed top-5 right-5 z-[500] px-5 py-3.5 bg-[#0a1626] text-white text-sm font-semibold rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-fade-in">
          {toast}
        </div>
      )}

      {/* ── Header Bar ── */}
      <div className="glass-card rounded-3xl p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-white">News Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">Create, edit, and manage city news articles</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowForm(true) }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #00b894, #00a381)' }}
        >
          <PlusIcon /> Create New Article
        </button>
      </div>

      {/* ── Search & Filter ── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"><SearchIcon /></span>
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all"
          />
        </div>
        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 rounded-xl text-sm text-white bg-slate-800/40 border border-slate-800 outline-none focus:border-[#00b894] transition-all cursor-pointer"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-white">{news.length}</div>
          <div className="text-[11px] text-slate-400 font-medium mt-1">Total Articles</div>
        </div>
        <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-emerald-400">{news.filter(n => n.published).length}</div>
          <div className="text-[11px] text-emerald-400/70 font-medium mt-1">Published</div>
        </div>
        <div className="bg-amber-500/5 border border-amber-500/15 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-amber-400">{news.filter(n => !n.published).length}</div>
          <div className="text-[11px] text-amber-400/70 font-medium mt-1">Drafts</div>
        </div>
        <div className="bg-rose-500/5 border border-rose-500/15 rounded-2xl p-4 text-center">
          <div className="text-2xl font-black text-rose-400">{news.filter(n => n.priority === 'Critical' || n.priority === 'High').length}</div>
          <div className="text-[11px] text-rose-400/70 font-medium mt-1">High Priority</div>
        </div>
      </div>

      {/* ── News Table ── */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#00b894] border-t-transparent" />
          <p className="text-slate-400 text-sm">Loading articles...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center py-20 border border-slate-800 border-solid">
          <span className="text-4xl block mb-3">📰</span>
          <h3 className="text-lg font-bold text-white mb-1">No articles found</h3>
          <p className="text-slate-500 text-sm">Create a new article or adjust your filters.</p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-slate-800/60">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800/60">
                  <th className="px-5 py-4">Title</th>
                  <th className="px-5 py-4 hidden md:table-cell">Category</th>
                  <th className="px-5 py-4 hidden lg:table-cell">Location</th>
                  <th className="px-5 py-4">Priority</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 hidden md:table-cell">Date</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(article => {
                  const aid = article._id || article.id || ''
                  return (
                    <tr key={aid} className="border-b border-slate-900/40 hover:bg-slate-800/20 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {article.image ? (
                            <img src={article.image} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-lg flex-shrink-0">🏙️</div>
                          )}
                          <span className="text-sm font-bold text-white max-w-[200px] truncate">{article.title}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-xs font-medium text-[#00b894] bg-[#00b894]/10 px-2.5 py-1 rounded-lg">{article.category}</span>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell text-xs text-slate-400">{article.location || '—'}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          article.priority === 'Critical' ? 'bg-rose-500/15 text-rose-400' :
                          article.priority === 'High' ? 'bg-amber-500/15 text-amber-400' :
                          article.priority === 'Medium' ? 'bg-blue-500/15 text-blue-400' :
                          'bg-slate-800 text-slate-400'
                        }`}>
                          {article.priority}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => handleTogglePublish(article)}
                          className={`text-[10px] font-bold px-3 py-1 rounded-full cursor-pointer border-none transition-all ${
                            article.published
                              ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                              : 'bg-slate-800 text-slate-500 hover:bg-slate-700'
                          }`}
                        >
                          {article.published ? '● Published' : '○ Draft'}
                        </button>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell text-xs text-slate-500 font-mono">
                        {formatDate(article.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(article)}
                            className="p-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 cursor-pointer border-none transition-all"
                            title="Edit"
                          >
                            <EditIcon />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(aid)}
                            className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 cursor-pointer border-none transition-all"
                            title="Delete"
                          >
                            <TrashIcon />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(5,10,20,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-sm bg-[#0a1626] rounded-3xl border border-slate-700 p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/25 flex items-center justify-center mx-auto mb-4">
              <TrashIcon className="w-7 h-7 text-rose-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Article?</h3>
            <p className="text-sm text-slate-400 mb-6">This action cannot be undone. The article will be permanently removed.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="flex-1 py-3 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #e53e3e, #c53030)' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Create/Edit Form Modal ── */}
      {showForm && (
        <div className="fixed inset-0 z-[500] flex items-center justify-center p-4" style={{ background: 'rgba(5,10,20,0.88)', backdropFilter: 'blur(10px)' }}>
          <div className="w-full max-w-2xl bg-[#0a1626] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-slate-950/40">
              <h3 className="text-lg font-bold text-white">
                {editingId ? '✏️ Edit Article' : '📝 Create New Article'}
              </h3>
              <button
                onClick={resetForm}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-transparent border-none cursor-pointer"
              >
                <XIcon />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-5 overflow-y-auto max-h-[75vh]">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Title *</label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="Enter article title..."
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Description *</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  placeholder="Enter detailed description..."
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all resize-none"
                />
              </div>

              {/* Row: Category + Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-slate-800/40 border border-slate-800 outline-none focus:border-[#00b894] transition-all cursor-pointer"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Priority</label>
                  <select
                    value={formPriority}
                    onChange={e => setFormPriority(e.target.value as NewsArticle['priority'])}
                    className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-slate-800/40 border border-slate-800 outline-none focus:border-[#00b894] transition-all cursor-pointer"
                  >
                    {PRIORITIES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Location</label>
                <input
                  type="text"
                  value={formLocation}
                  onChange={e => setFormLocation(e.target.value)}
                  placeholder="e.g. Sector 15, Main Road"
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm bg-slate-800/40 border-slate-800 focus:border-[#00b894] transition-all"
                />
              </div>

              {/* Image Upload */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">Image</label>
                <div
                  onClick={() => imageInputRef.current?.click()}
                  className="w-full p-4 rounded-xl border-2 border-dashed border-slate-800 bg-slate-900/30 hover:border-[#00b894]/40 transition-all cursor-pointer flex flex-col items-center justify-center gap-2"
                >
                  {formImage ? (
                    <img src={formImage} alt="Preview" className="max-h-40 rounded-xl object-contain" />
                  ) : (
                    <>
                      <ImageIcon className="w-8 h-8 text-slate-600" />
                      <span className="text-xs text-slate-500">Click to upload image (max 5 MB)</span>
                    </>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                {formImage && (
                  <button
                    onClick={() => setFormImage('')}
                    className="text-xs text-rose-400 hover:text-rose-300 font-semibold bg-transparent border-none cursor-pointer mt-1"
                  >
                    Remove image
                  </button>
                )}
              </div>

              {/* Published Toggle */}
              <div className="flex items-center gap-3 p-4 rounded-xl bg-slate-900/30 border border-slate-800">
                <button
                  onClick={() => setFormPublished(!formPublished)}
                  className={`w-12 h-6 rounded-full relative transition-all duration-300 border-none cursor-pointer ${
                    formPublished ? 'bg-[#00b894]' : 'bg-slate-700'
                  }`}
                >
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${
                    formPublished ? 'left-[26px]' : 'left-0.5'
                  }`} />
                </button>
                <div>
                  <span className="text-sm font-semibold text-white block">
                    {formPublished ? 'Published' : 'Draft'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {formPublished ? 'Article visible to citizens' : 'Article hidden from public feed'}
                  </span>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-6 py-4 bg-slate-950/20 border-t border-slate-900 flex gap-3 justify-end">
              <button
                onClick={resetForm}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 cursor-pointer transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white border-none cursor-pointer transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #00b894, #00a381)' }}
              >
                {editingId ? 'Save Changes' : 'Create Article'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
