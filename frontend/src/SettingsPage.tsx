import { useState, useEffect, useRef } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────
interface CurrentUser {
  fullName: string
  email: string
  phone: string
  profileImage?: string | null
  role?: string
  address?: string
  password?: string
}

interface SettingsPageProps {
  currentUser: CurrentUser
  setCurrentUser: (user: CurrentUser) => void
  onLogout: () => void
  setNotification: (msg: string | null) => void
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function IconUser({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

function IconLock({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  )
}

function IconBell({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function IconPalette({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
      <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
      <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
      <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
      <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
    </svg>
  )
}

function IconShield({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

function IconGlobe({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  )
}

function IconMapPin({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

function IconLogOut({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
    </svg>
  )
}

function IconEye({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

function IconCamera({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconCheck({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function IconAlertTriangle({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  )
}

function IconTrash({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  )
}

function IconMonitor({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function IconSun({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
  )
}

function IconMoon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )
}

function IconActivity({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  )
}

// ── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ checked, onChange, id }: { checked: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#00b894]/50 border-none cursor-pointer flex-shrink-0`}
      style={{ background: checked ? '#00b894' : 'rgba(255,255,255,0.1)' }}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-lg transition-all duration-300`}
        style={{ transform: checked ? 'translateX(26px)' : 'translateX(4px)' }}
      />
    </button>
  )
}

// ── Input Field ───────────────────────────────────────────────────────────────
function SettingsInput({
  id, label, type = 'text', value, onChange, placeholder, disabled = false, icon, rightElement
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  disabled?: boolean
  icon?: React.ReactNode
  rightElement?: React.ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full rounded-xl border px-4 py-3 text-sm text-white outline-none transition-all duration-200 bg-slate-800/40 focus:bg-slate-800/80"
          style={{
            border: '1px solid rgba(255,255,255,0.08)',
            paddingLeft: icon ? '42px' : undefined,
            color: disabled ? '#64748b' : undefined,
            cursor: disabled ? 'not-allowed' : undefined,
            opacity: disabled ? 0.6 : 1
          }}
          onFocus={e => { if (!disabled) { e.currentTarget.style.borderColor = 'rgba(0,184,148,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,184,148,0.08)' } }}
          onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
        />
        {rightElement && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Section Card ──────────────────────────────────────────────────────────────
function SectionCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div
      className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800 animate-fade-in"
    >
      <div className="mb-6 pb-5 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error' | 'info'; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [onClose])

  const colors: Record<string, string> = {
    success: '#00b894',
    error: '#e53e3e',
    info: '#42a5f5',
  }

  return (
    <div
      className="fixed top-5 right-5 z-[200] flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border text-white text-sm font-medium max-w-sm animate-fade-in"
      style={{ background: 'rgba(10,22,38,0.97)', borderColor: `${colors[type]}40` }}
    >
      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: colors[type] }} />
      {message}
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white bg-transparent border-none cursor-pointer p-0">✕</button>
    </div>
  )
}

// ── Translations ──────────────────────────────────────────────────────────────
const translations: Record<string, Record<string, string>> = {
  en: {
    // Page header
    configuration: 'Configuration',
    settings: 'Settings',
    settingsSubtitle: 'Manage your account, preferences and privacy.',
    // Sidebar labels
    profile: 'Profile',
    account: 'Account',
    notifications: 'Notifications',
    appearance: 'Appearance',
    privacySecurity: 'Privacy & Security',
    language: 'Language',
    location: 'Location',
    accountActions: 'Account Actions',
    // Section titles & subtitles
    profileSettings: 'Profile Settings',
    profileSubtitle: 'Manage your public identity and personal information',
    accountSettings: 'Account Settings',
    accountSubtitle: 'Manage your login credentials and account security',
    notificationsTitle: 'Notification Preferences',
    notificationsSubtitle: 'Control how and when SmartCityOS notifies you',
    appearanceTitle: 'Appearance',
    appearanceSubtitle: 'Customize how SmartCityOS looks and feels',
    privacyTitle: 'Privacy & Security',
    privacySubtitle: 'Manage your data, privacy, and security settings',
    languageTitle: 'Language',
    languageSubtitle: 'Select your preferred language for the SmartCityOS interface',
    locationTitle: 'Location Settings',
    locationSubtitle: 'Configure your city, region, and location preferences',
    accountActionsTitle: 'Account Actions',
    accountActionsSubtitle: 'Manage critical account operations',
    // Profile fields
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    address: 'Home Address',
    editProfile: 'Edit Profile',
    saveChanges: 'Save Changes',
    cancel: 'Cancel',
    // Language page
    langActiveLabel: 'Active Language',
    langMoreSoon: 'More languages are coming soon. The interface will be fully translated. Your selection is saved automatically and will persist across sessions.',
    langPreviewLabel: 'Live Preview — selected language is active:',
    // Common
    save: 'Save',
    close: 'Close',
    enabled: 'Enabled',
    disabled: 'Disabled',
  },
  hi: {
    // Page header
    configuration: 'कॉन्फ़िगरेशन',
    settings: 'सेटिंग्स',
    settingsSubtitle: 'अपना खाता, प्राथमिकताएँ और गोपनीयता प्रबंधित करें।',
    // Sidebar labels
    profile: 'प्रोफ़ाइल',
    account: 'खाता',
    notifications: 'सूचनाएँ',
    appearance: 'दिखावट',
    privacySecurity: 'गोपनीयता और सुरक्षा',
    language: 'भाषा',
    location: 'स्थान',
    accountActions: 'खाता कार्रवाइयाँ',
    // Section titles & subtitles
    profileSettings: 'प्रोफ़ाइल सेटिंग्स',
    profileSubtitle: 'अपनी सार्वजनिक पहचान और व्यक्तिगत जानकारी प्रबंधित करें',
    accountSettings: 'खाता सेटिंग्स',
    accountSubtitle: 'अपनी लॉगिन क्रेडेंशियल और खाता सुरक्षा प्रबंधित करें',
    notificationsTitle: 'सूचना प्राथमिकताएँ',
    notificationsSubtitle: 'SmartCityOS आपको कैसे और कब सूचित करे, यह नियंत्रित करें',
    appearanceTitle: 'दिखावट',
    appearanceSubtitle: 'SmartCityOS की उपस्थिति अनुकूलित करें',
    privacyTitle: 'गोपनीयता और सुरक्षा',
    privacySubtitle: 'अपना डेटा, गोपनीयता और सुरक्षा सेटिंग्स प्रबंधित करें',
    languageTitle: 'भाषा',
    languageSubtitle: 'SmartCityOS इंटरफ़ेस के लिए अपनी पसंदीदा भाषा चुनें',
    locationTitle: 'स्थान सेटिंग्स',
    locationSubtitle: 'अपना शहर, क्षेत्र और स्थान प्राथमिकताएँ कॉन्फ़िगर करें',
    accountActionsTitle: 'खाता कार्रवाइयाँ',
    accountActionsSubtitle: 'महत्वपूर्ण खाता संचालन प्रबंधित करें',
    // Profile fields
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'फ़ोन नंबर',
    address: 'घर का पता',
    editProfile: 'प्रोफ़ाइल संपादित करें',
    saveChanges: 'परिवर्तन सहेजें',
    cancel: 'रद्द करें',
    // Language page
    langActiveLabel: 'सक्रिय भाषा',
    langMoreSoon: 'और भाषाएँ जल्द आ रही हैं। इंटरफ़ेस का पूरा अनुवाद किया जाएगा। आपका चयन स्वचालित रूप से सहेजा जाता है।',
    langPreviewLabel: 'लाइव पूर्वावलोकन — चयनित भाषा सक्रिय है:',
    // Common
    save: 'सहेजें',
    close: 'बंद करें',
    enabled: 'सक्षम',
    disabled: 'अक्षम',
  },
}

function getT(lang: string) {
  const dict = translations[lang] || translations.en
  return (key: string) => dict[key] ?? translations.en[key] ?? key
}

// ── Main Settings Page ─────────────────────────────────────────────────────────
function buildSettingsSections(t: (k: string) => string) {
  return [
    { id: 'profile', label: t('profile'), icon: IconUser },
    { id: 'account', label: t('account'), icon: IconLock },
    { id: 'notifications', label: t('notifications'), icon: IconBell },
    { id: 'appearance', label: t('appearance'), icon: IconPalette },
    { id: 'privacy', label: t('privacySecurity'), icon: IconShield },
    { id: 'language', label: t('language'), icon: IconGlobe },
    { id: 'location', label: t('location'), icon: IconMapPin },
    { id: 'danger', label: t('accountActions'), icon: IconLogOut },
  ]
}

export default function SettingsPage({ currentUser, setCurrentUser, onLogout, setNotification }: SettingsPageProps) {
  const [activeSection, setActiveSection] = useState('profile')
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null)
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type })
  }

  // ── 1. Profile State ───────────────────────────────────────────────────────
  const [profileEditing, setProfileEditing] = useState(false)
  const [profileName, setProfileName] = useState(currentUser.fullName)
  const [profileEmail, setProfileEmail] = useState(currentUser.email)
  const [profilePhone, setProfilePhone] = useState(currentUser.phone)
  const [profileAddress, setProfileAddress] = useState(currentUser.address || '')
  const [profileImage, setProfileImage] = useState<string | null>(currentUser.profileImage ?? null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Bug Fix: Sync form state when currentUser prop changes
  useEffect(() => {
    setProfileName(currentUser.fullName)
    setProfileEmail(currentUser.email)
    setProfilePhone(currentUser.phone)
    setProfileAddress(currentUser.address || '')
    setProfileImage(currentUser.profileImage ?? null)
  }, [currentUser])

  const getInitials = (name: string) =>
    name.trim().split(/\s+/).map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'U'

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) { showToast('Image size must be less than 2MB.', 'error'); return }
      const reader = new FileReader()
      reader.onloadend = () => setProfileImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSaveProfile = () => {
    if (!profileName.trim()) { showToast('Full name cannot be empty.', 'error'); return }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileEmail)) { showToast('Please enter a valid email address.', 'error'); return }
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (profilePhone && !phoneRegex.test(profilePhone)) { showToast('Please enter a valid phone number.', 'error'); return }

    // Update scm_current_user
    const updatedUser = { ...currentUser, fullName: profileName, email: profileEmail, phone: profilePhone, address: profileAddress, profileImage }
    localStorage.setItem('scm_current_user', JSON.stringify(updatedUser))

    // Update scm_users list
    const users: CurrentUser[] = JSON.parse(localStorage.getItem('scm_users') || '[]')
    const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase())
    if (idx >= 0) { users[idx] = { ...users[idx], ...updatedUser }; localStorage.setItem('scm_users', JSON.stringify(users)) }

    setCurrentUser(updatedUser)
    setProfileEditing(false)
    showToast('Profile updated successfully!', 'success')
    setNotification('✅ Profile updated successfully!')
    setTimeout(() => setNotification(null), 3000)
  }

  // ── 2. Account / Password State ────────────────────────────────────────────
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmNewPassword, setConfirmNewPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const handleSavePassword = () => {
    if (!currentPassword || !newPassword || !confirmNewPassword) {
      showToast('Please fill in all password fields.', 'error'); return
    }
    // Verify current password
    const users: CurrentUser[] = JSON.parse(localStorage.getItem('scm_users') || '[]')
    const me = users.find(u => u.email.toLowerCase() === currentUser.email.toLowerCase())
    // Bug Fix: Also check the currentUser's password if the user isn't found in the users list
    const actualPassword = me ? (me as any).password : (currentUser as any).password
    if (actualPassword && actualPassword !== currentPassword) {
      showToast('Current password is incorrect.', 'error'); return
    }
    if (newPassword.length < 6) { showToast('New password must be at least 6 characters.', 'error'); return }
    if (newPassword !== confirmNewPassword) { showToast('New passwords do not match.', 'error'); return }

    // Update password in users list
    const idx = users.findIndex(u => u.email.toLowerCase() === currentUser.email.toLowerCase())
    if (idx >= 0) {
      (users[idx] as any).password = newPassword
      localStorage.setItem('scm_users', JSON.stringify(users))
    }
    const updatedUser = { ...currentUser }
    ;(updatedUser as any).password = newPassword
    localStorage.setItem('scm_current_user', JSON.stringify(updatedUser))

    setCurrentPassword(''); setNewPassword(''); setConfirmNewPassword('')
    showToast('Password changed successfully!', 'success')
  }

  const passwordStrength = (pwd: string) => {
    if (!pwd) return { level: 0, label: '', color: '' }
    let score = 0
    if (pwd.length >= 8) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const levels = [
      { level: 0, label: 'Too short', color: '#e53e3e' },
      { level: 1, label: 'Weak', color: '#e53e3e' },
      { level: 2, label: 'Fair', color: '#f6ad55' },
      { level: 3, label: 'Good', color: '#68d391' },
      { level: 4, label: 'Strong', color: '#00b894' },
    ]
    return levels[score]
  }
  const pwdStrength = passwordStrength(newPassword)

  // ── 3. Notification State ──────────────────────────────────────────────────
  const defaultNotifications = {
    emailNotifications: true,
    complaintUpdates: true,
    newsNotifications: false,
    weatherAlerts: true,
    emergencyAlerts: true,
    maintenanceUpdates: false,
  }
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('scm_settings_notifications')
      return saved ? { ...defaultNotifications, ...JSON.parse(saved) } : defaultNotifications
    } catch { return defaultNotifications }
  })

  const updateNotification = (key: keyof typeof notifications, val: boolean) => {
    const updated = { ...notifications, [key]: val }
    setNotifications(updated)
    localStorage.setItem('scm_settings_notifications', JSON.stringify(updated))
    showToast(`${val ? 'Enabled' : 'Disabled'} notification.`, 'info')
  }

  const notificationItems = [
    { key: 'emailNotifications' as const, label: 'Email Notifications', desc: 'Receive updates via your registered email address' },
    { key: 'complaintUpdates' as const, label: 'Complaint Updates', desc: 'Get notified when your complaints are updated or resolved' },
    { key: 'newsNotifications' as const, label: 'News Notifications', desc: 'Receive city news and announcements' },
    { key: 'weatherAlerts' as const, label: 'Weather Alerts', desc: 'Hyperlocal weather warnings and advisories' },
    { key: 'emergencyAlerts' as const, label: 'Emergency Alerts', desc: 'Critical emergency broadcasts (recommended)' },
    { key: 'maintenanceUpdates' as const, label: 'Maintenance Updates', desc: 'Scheduled infrastructure maintenance notifications' },
  ]

  // ── 4. Appearance State ───────────────────────────────────────────────────
  const [theme, setTheme] = useState<'dark' | 'light' | 'system'>(() => {
    try { return (localStorage.getItem('scm_settings_theme') as 'dark' | 'light' | 'system') || 'dark' } catch { return 'dark' }
  })
  const [layout, setLayout] = useState<'comfortable' | 'compact'>(() => {
    try { return (localStorage.getItem('scm_settings_layout') as 'comfortable' | 'compact') || 'comfortable' } catch { return 'comfortable' }
  })

  const handleThemeChange = (t: 'dark' | 'light' | 'system') => {
    setTheme(t); localStorage.setItem('scm_settings_theme', t)
    if (t === 'light') {
      document.documentElement.classList.add('light-theme')
    } else {
      document.documentElement.classList.remove('light-theme')
    }
    showToast(`Theme set to ${t} mode.`, 'info')
  }
  const handleLayoutChange = (l: 'comfortable' | 'compact') => {
    setLayout(l); localStorage.setItem('scm_settings_layout', l)
    showToast(`Layout set to ${l} mode.`, 'info')
  }

  // ── 5. Privacy State ──────────────────────────────────────────────────────
  const [twoFaEnabled, setTwoFaEnabled] = useState(() => {
    try { return localStorage.getItem('scm_settings_2fa') === 'true' } catch { return false }
  })
  const handleToggle2FA = (val: boolean) => {
    setTwoFaEnabled(val); localStorage.setItem('scm_settings_2fa', String(val))
    showToast(val ? 'Two-factor authentication enabled.' : 'Two-factor authentication disabled.', val ? 'success' : 'info')
  }

  const loginActivity = [
    { device: 'Chrome · Windows 11', location: 'Mumbai, India', time: 'Just now', current: true },
    { device: 'SmartCityOS Mobile · Android', location: 'Pune, India', time: '2 hours ago', current: false },
    { device: 'Firefox · macOS', location: 'Bangalore, India', time: '3 days ago', current: false },
  ]

  const handleLogoutAllDevices = () => {
    showToast('All other sessions have been terminated.', 'success')
  }

  // ── 6. Language State ─────────────────────────────────────────────────────
  const [language, setLanguage] = useState(() => {
    try { return localStorage.getItem('scm_settings_language') || 'en' } catch { return 'en' }
  })

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang)
    localStorage.setItem('scm_settings_language', lang)
    const names: Record<string, string> = { en: 'English', hi: 'हिन्दी (Hindi)' }
    showToast(`Language set to ${names[lang] || lang}.`, 'info')
  }

  // Derive translator from current language state
  const t = getT(language)
  const settingsSections = buildSettingsSections(t)

  // ── 7. Location State ─────────────────────────────────────────────────────
  const [locationCity, setLocationCity] = useState(() => {
    try { return localStorage.getItem('scm_settings_city') || '' } catch { return '' }
  })
  const [locationState, setLocationState] = useState(() => {
    try { return localStorage.getItem('scm_settings_state') || '' } catch { return '' }
  })
  const [locationCountry, setLocationCountry] = useState(() => {
    try { return localStorage.getItem('scm_settings_country') || 'India' } catch { return 'India' }
  })
  const [useCurrentLocation, setUseCurrentLocation] = useState(false)
  const locationPermission = localStorage.getItem('scm_location_permission') || 'unknown'

  const handleSaveLocation = () => {
    localStorage.setItem('scm_settings_city', locationCity)
    localStorage.setItem('scm_settings_state', locationState)
    localStorage.setItem('scm_settings_country', locationCountry)
    showToast('Location settings saved.', 'success')
  }

  const handleUseCurrentLocation = (val: boolean) => {
    setUseCurrentLocation(val)
    if (val) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          pos => {
            localStorage.setItem('scm_location_coords', JSON.stringify({ lat: pos.coords.latitude, lng: pos.coords.longitude, timestamp: new Date().toISOString() }))
            localStorage.setItem('scm_location_permission', 'granted')
            showToast('Current location captured successfully!', 'success')
          },
          () => {
            setUseCurrentLocation(false)
            showToast('Location permission denied by browser.', 'error')
          }
        )
      } else {
        setUseCurrentLocation(false)
        showToast('Geolocation is not supported by your browser.', 'error')
      }
    }
  }

  // ── 8. Account Actions State ──────────────────────────────────────────────
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')

  const handleConfirmDelete = () => {
    if (deleteConfirmText !== 'DELETE') {
      showToast('Please type DELETE to confirm.', 'error'); return
    }
    // Remove user from scm_users
    const users: CurrentUser[] = JSON.parse(localStorage.getItem('scm_users') || '[]')
    const filtered = users.filter(u => u.email.toLowerCase() !== currentUser.email.toLowerCase())
    localStorage.setItem('scm_users', JSON.stringify(filtered))
    localStorage.removeItem('scm_current_user')
    onLogout()
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full animate-fade-in">
      {/* Toast */}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />
      )}

      {/* Logout Dialog */}
      {showLogoutDialog && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(5,12,25,0.85)', backdropFilter: 'blur(8px)' }}>
          <div className="glass-card w-full max-w-sm rounded-3xl p-8 border border-slate-700 shadow-2xl">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/25 flex items-center justify-center">
                <IconLogOut className="w-8 h-8 text-rose-400" />
              </div>
            </div>
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">Confirm Logout</h3>
              <p className="text-slate-400 text-sm">Are you sure you want to logout from <span className="text-[#00b894] font-semibold">{currentUser.fullName}'s</span> account?</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutDialog(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancel</button>
              <button onClick={onLogout} className="flex-1 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer" style={{ background: 'linear-gradient(135deg,#e53e3e,#c53030)' }}>Yes, Logout</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" style={{ background: 'rgba(5,12,25,0.9)', backdropFilter: 'blur(10px)' }}>
          <div className="glass-card w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-rose-900/40">
            <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg,#e53e3e,#c53030)' }} />
            <div className="p-8">
              {deleteStep === 1 ? (
                <>
                  <div className="flex justify-center mb-5">
                    <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                      <IconAlertTriangle className="w-8 h-8 text-rose-400" />
                    </div>
                  </div>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-3">Delete Account</h3>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4">
                      This action is <span className="text-rose-400 font-semibold">permanent and irreversible</span>. All your data including complaints, profile, and preferences will be permanently deleted.
                    </p>
                    <div className="text-left space-y-2.5 mb-4">
                      {['All filed complaints and history', 'Profile photo and personal info', 'Notification & appearance preferences', 'Location and language settings'].map(item => (
                        <div key={item} className="flex items-center gap-2.5 text-xs text-slate-400 bg-rose-500/5 border border-rose-500/10 rounded-lg px-3 py-2">
                          <span className="text-rose-400">✕</span> {item}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setShowDeleteDialog(false)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)' }}>Cancel</button>
                    <button onClick={() => setDeleteStep(2)} className="flex-1 py-3 rounded-xl text-sm font-semibold text-rose-400 border border-rose-500/30 cursor-pointer" style={{ background: 'rgba(229,62,62,0.08)' }}>
                      Continue
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-white mb-2">Final Confirmation</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                      Type <span className="font-mono text-rose-400 font-bold">DELETE</span> below to permanently delete your account. This cannot be undone.
                    </p>
                  </div>
                  <div className="mb-5">
                    <input
                      id="delete-confirm-input"
                      type="text"
                      value={deleteConfirmText}
                      onChange={e => setDeleteConfirmText(e.target.value)}
                      placeholder="Type DELETE to confirm"
                      className="w-full rounded-xl border px-4 py-3 text-sm text-white outline-none text-center font-mono tracking-widest"
                      style={{ background: 'rgba(229,62,62,0.05)', borderColor: deleteConfirmText === 'DELETE' ? '#e53e3e' : 'rgba(255,255,255,0.08)', color: '#e53e3e' }}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => { setDeleteStep(1); setDeleteConfirmText('') }} className="flex-1 py-3 rounded-xl text-sm font-semibold text-slate-300 border border-slate-700 cursor-pointer" style={{ background: 'rgba(255,255,255,0.04)' }}>Back</button>
                    <button
                      onClick={handleConfirmDelete}
                      disabled={deleteConfirmText !== 'DELETE'}
                      className="flex-1 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all"
                      style={{ background: deleteConfirmText === 'DELETE' ? 'linear-gradient(135deg,#e53e3e,#c53030)' : 'rgba(255,255,255,0.06)', color: deleteConfirmText === 'DELETE' ? '#fff' : '#64748b', cursor: deleteConfirmText === 'DELETE' ? 'pointer' : 'not-allowed' }}
                    >
                      Delete My Account
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="mb-6">
        <span className="text-[#00b894] font-semibold text-sm uppercase tracking-wider block mb-1">{t('configuration')}</span>
        <h1 className="text-3xl font-bold text-white tracking-tight">{t('settings')}</h1>
        <p className="text-slate-400 text-sm mt-1">{t('settingsSubtitle')}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Sidebar — Section Navigation */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Mobile: horizontal scroll */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {settingsSections.map(s => {
              const Icon = s.icon
              const active = activeSection === s.id
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all border-none cursor-pointer flex-shrink-0"
                  style={{
                    background: active ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#00b894' : '#94a3b8',
                    border: active ? '1px solid rgba(0,184,148,0.2)' : '1px solid rgba(255,255,255,0.06)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {s.label}
                </button>
              )
            })}
          </div>

          {/* Desktop: vertical nav */}
          <nav
            className="hidden lg:block glass-card rounded-2xl p-2 border border-slate-800"
          >
            {settingsSections.map(s => {
              const Icon = s.icon
              const active = activeSection === s.id
              const isDanger = s.id === 'danger'
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border-none text-left cursor-pointer mb-0.5"
                  style={{
                    background: active ? (isDanger ? 'rgba(229,62,62,0.1)' : 'rgba(0,184,148,0.12)') : 'transparent',
                    color: active ? (isDanger ? '#fc8181' : '#00b894') : isDanger ? '#fc8181' : '#94a3b8',
                  }}
                  onMouseEnter={e => { if (!active) { e.currentTarget.style.background = isDanger ? 'rgba(229,62,62,0.06)' : 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = isDanger ? '#fc8181' : '#e2e8f0' } }}
                  onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = isDanger ? '#fc8181' : '#94a3b8' } }}
                >
                  <Icon className={`w-4 h-4 flex-shrink-0 ${active ? (isDanger ? 'text-rose-400' : 'text-[#00b894]') : isDanger ? 'text-rose-400' : 'text-slate-500'}`} />
                  <span className="truncate">{s.label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: isDanger ? '#fc8181' : '#00b894' }} />}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Right — Content Area */}
        <div className="flex-1 min-w-0">

          {/* 1. PROFILE SETTINGS */}
          {activeSection === 'profile' && (
            <SectionCard title={t('profileSettings')} subtitle={t('profileSubtitle')}>
              {/* Avatar */}
              <div className="flex items-center gap-5 mb-8 pb-8 border-b border-slate-800">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-2xl border-2 border-slate-700 overflow-hidden flex items-center justify-center text-2xl font-bold text-[#42a5f5] bg-[#42a5f5]/20">
                    {profileImage
                      ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                      : getInitials(profileName)
                    }
                  </div>
                  {profileEditing && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-[#00b894] border-2 border-[#0a1626] flex items-center justify-center cursor-pointer border-none"
                    >
                      <IconCamera className="w-4 h-4 text-white" />
                    </button>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleProfileImageChange} id="profile-photo-upload" />
                </div>
                <div>
                  <div className="text-white font-semibold text-lg">{profileName}</div>
                  <div className="text-slate-400 text-sm">{profileEmail}</div>
                  <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium" style={{ background: 'rgba(0,184,148,0.1)', color: '#00b894', border: '1px solid rgba(0,184,148,0.2)' }}>
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00b894]" />
                    {currentUser.role === 'admin' ? 'Administrator' : 'Citizen Account'}
                  </div>
                </div>
                <div className="ml-auto">
                  {!profileEditing ? (
                    <button
                      id="edit-profile-btn"
                      onClick={() => setProfileEditing(true)}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all"
                      style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894', border: '1px solid rgba(0,184,148,0.25)' }}
                    >
                      Edit Profile
                    </button>
                  ) : (
                    <button
                      onClick={() => { setProfileEditing(false); setProfileName(currentUser.fullName); setProfileEmail(currentUser.email); setProfilePhone(currentUser.phone); setProfileAddress(currentUser.address || ''); setProfileImage(currentUser.profileImage ?? null) }}
                      className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-400 border border-slate-700 cursor-pointer"
                      style={{ background: 'transparent' }}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </div>

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SettingsInput id="profile-name" label="Full Name" value={profileName} onChange={setProfileName} placeholder="Your full name" disabled={!profileEditing}
                  icon={<IconUser className="w-4 h-4" />}
                />
                <SettingsInput id="profile-email" label="Email Address" type="email" value={profileEmail} onChange={setProfileEmail} placeholder="your@email.com" disabled={!profileEditing} />
                <SettingsInput id="profile-phone" label="Phone Number" type="tel" value={profilePhone} onChange={setProfilePhone} placeholder="+91 98765 43210" disabled={!profileEditing} />
                <SettingsInput id="profile-address" label="Address" value={profileAddress} onChange={setProfileAddress} placeholder="Your home address" disabled={!profileEditing}
                  icon={<IconMapPin className="w-4 h-4" />}
                />
              </div>

              {profileEditing && (
                <div className="mt-6 flex justify-end">
                  <button
                    id="save-profile-btn"
                    onClick={handleSaveProfile}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all"
                    style={{ background: 'linear-gradient(135deg,#00b894,#00a381)' }}
                  >
                    <IconCheck className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </SectionCard>
          )}

          {/* 2. ACCOUNT SETTINGS */}
          {activeSection === 'account' && (
            <SectionCard title="Account Settings" subtitle="Manage your login credentials and account security">
              <div className="space-y-5">
                <div>
                  <label htmlFor="current-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Current Password</label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrent ? 'text' : 'password'}
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                      className="w-full rounded-xl border px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,184,148,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,184,148,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer p-1">
                      {showCurrent ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">New Password</label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNew ? 'text' : 'password'}
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full rounded-xl border px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,184,148,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,184,148,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer p-1">
                      {showNew ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {/* Password strength */}
                  {newPassword && (
                    <div className="mt-2 space-y-1">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4].map(i => (
                          <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300" style={{ background: i <= pwdStrength.level ? pwdStrength.color : 'rgba(255,255,255,0.08)' }} />
                        ))}
                      </div>
                      <p className="text-xs" style={{ color: pwdStrength.color }}>{pwdStrength.label}</p>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="confirm-new-password" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Confirm New Password</label>
                  <div className="relative">
                    <input
                      id="confirm-new-password"
                      type={showConfirm ? 'text' : 'password'}
                      value={confirmNewPassword}
                      onChange={e => setConfirmNewPassword(e.target.value)}
                      placeholder="Confirm new password"
                      className="w-full rounded-xl border px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-200"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderColor: confirmNewPassword && confirmNewPassword !== newPassword ? '#e53e3e' : undefined }}
                      onFocus={e => { e.currentTarget.style.borderColor = 'rgba(0,184,148,0.5)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,184,148,0.08)' }}
                      onBlur={e => { e.currentTarget.style.borderColor = confirmNewPassword && confirmNewPassword !== newPassword ? '#e53e3e' : 'rgba(255,255,255,0.08)'; e.currentTarget.style.boxShadow = 'none' }}
                    />
                    <button onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 bg-transparent border-none cursor-pointer p-1">
                      {showConfirm ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                    </button>
                  </div>
                  {confirmNewPassword && confirmNewPassword !== newPassword && (
                    <p className="text-xs text-rose-400 mt-1">Passwords do not match</p>
                  )}
                </div>

                <div className="pt-2">
                  <button
                    id="save-password-btn"
                    onClick={handleSavePassword}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all"
                    style={{ background: 'linear-gradient(135deg,#00b894,#00a381)' }}
                  >
                    <IconLock className="w-4 h-4" />
                    Save Password
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* 3. NOTIFICATION SETTINGS */}
          {activeSection === 'notifications' && (
            <SectionCard title="Notification Settings" subtitle="Choose which alerts and updates you want to receive">
              <div className="space-y-1">
                {notificationItems.map((item, i) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between py-4 transition-colors rounded-xl px-3"
                    style={{ borderBottom: i < notificationItems.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.02)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div className="flex-1 pr-4">
                      <div className="text-sm font-semibold text-white">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <Toggle
                      id={`notif-${item.key}`}
                      checked={notifications[item.key]}
                      onChange={(val) => updateNotification(item.key, val)}
                    />
                  </div>
                ))}
              </div>
            </SectionCard>
          )}

          {/* 4. APPEARANCE SETTINGS */}
          {activeSection === 'appearance' && (
            <SectionCard title="Appearance Settings" subtitle="Customize how SmartCityOS looks and feels">
              {/* Theme Selection */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-white mb-4">Color Theme</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {([
                    { value: 'dark', label: 'Dark Mode', desc: 'Deep dark interface', icon: IconMoon, preview: 'from-slate-900 to-slate-800' },
                    { value: 'light', label: 'Light Mode', desc: 'Clean light interface', icon: IconSun, preview: 'from-gray-100 to-white' },
                    { value: 'system', label: 'System Default', desc: 'Follows OS preference', icon: IconMonitor, preview: 'from-slate-700 to-gray-200' },
                  ] as const).map(t => {
                    const Icon = t.icon
                    const active = theme === t.value
                    return (
                      <button
                        key={t.value}
                        id={`theme-${t.value}`}
                        onClick={() => handleThemeChange(t.value)}
                        className="relative p-4 rounded-2xl text-left border transition-all duration-200 cursor-pointer"
                        style={{
                          background: active ? 'rgba(0,184,148,0.1)' : 'rgba(255,255,255,0.03)',
                          borderColor: active ? 'rgba(0,184,148,0.4)' : 'rgba(255,255,255,0.08)',
                        }}
                      >
                        <div className={`w-full h-12 rounded-lg mb-3 bg-gradient-to-br ${t.preview} border border-white/10`} />
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className={`w-4 h-4 ${active ? 'text-[#00b894]' : 'text-slate-400'}`} />
                          <span className={`text-sm font-semibold ${active ? 'text-[#00b894]' : 'text-white'}`}>{t.label}</span>
                        </div>
                        <p className="text-xs text-slate-500">{t.desc}</p>
                        {active && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00b894] flex items-center justify-center">
                            <IconCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Layout Selection */}
              <div>
                <h3 className="text-sm font-semibold text-white mb-4">Layout Density</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {([
                    { value: 'comfortable', label: 'Comfortable', desc: 'More spacing, easier to read' },
                    { value: 'compact', label: 'Compact', desc: 'Denser layout, more content visible' },
                  ] as const).map(l => {
                    const active = layout === l.value
                    return (
                      <button
                        key={l.value}
                        id={`layout-${l.value}`}
                        onClick={() => handleLayoutChange(l.value)}
                        className="relative p-5 rounded-2xl text-left border transition-all duration-200 cursor-pointer"
                        style={{
                          background: active ? 'rgba(0,184,148,0.1)' : 'rgba(255,255,255,0.03)',
                          borderColor: active ? 'rgba(0,184,148,0.4)' : 'rgba(255,255,255,0.08)',
                        }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {/* Visual preview */}
                          <div className="flex flex-col gap-1 mr-1">
                            {(l.value === 'comfortable' ? [16, 16, 16] : [8, 8, 8, 8]).map((h, i) => (
                              <div key={i} className="rounded" style={{ width: 24, height: h, background: active ? 'rgba(0,184,148,0.4)' : 'rgba(255,255,255,0.1)' }} />
                            ))}
                          </div>
                          <div>
                            <span className={`text-sm font-semibold block ${active ? 'text-[#00b894]' : 'text-white'}`}>{l.label}</span>
                            <p className="text-xs text-slate-500">{l.desc}</p>
                          </div>
                        </div>
                        {active && (
                          <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#00b894] flex items-center justify-center">
                            <IconCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>
            </SectionCard>
          )}

          {/* 5. PRIVACY & SECURITY */}
          {activeSection === 'privacy' && (
            <SectionCard title="Privacy & Security" subtitle="Control your account security and data access">
              {/* 2FA */}
              <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-800">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    Two-Factor Authentication
                    {twoFaEnabled && <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}>Active</span>}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">Add an extra layer of security to your account login</div>
                </div>
                <Toggle id="two-fa-toggle" checked={twoFaEnabled} onChange={handleToggle2FA} />
              </div>

              {/* Login Activity */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <IconActivity className="w-4 h-4 text-slate-400" />
                  <h3 className="text-sm font-semibold text-white">Recent Login Activity</h3>
                </div>
                <div className="space-y-3">
                  {loginActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-800 transition-colors" style={{ background: 'rgba(255,255,255,0.02)' }}>
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: activity.current ? 'rgba(0,184,148,0.15)' : 'rgba(255,255,255,0.05)' }}>
                        <IconMonitor className={`w-5 h-5 ${activity.current ? 'text-[#00b894]' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white flex items-center gap-2">
                          {activity.device}
                          {activity.current && <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,184,148,0.15)', color: '#00b894' }}>Current</span>}
                        </div>
                        <div className="text-xs text-slate-500">{activity.location} · {activity.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Logout all devices */}
              <div className="p-5 rounded-2xl border border-slate-800" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-semibold text-white">Active Sessions</div>
                    <div className="text-xs text-slate-500 mt-0.5">{loginActivity.length} active session{loginActivity.length !== 1 ? 's' : ''} across devices</div>
                  </div>
                  <button
                    id="logout-all-devices-btn"
                    onClick={handleLogoutAllDevices}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border border-rose-500/30 text-rose-400 cursor-pointer transition-all"
                    style={{ background: 'rgba(229,62,62,0.06)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,62,62,0.12)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,62,62,0.06)' }}
                  >
                    <IconLogOut className="w-4 h-4" />
                    Logout All Devices
                  </button>
                </div>
              </div>
            </SectionCard>
          )}

          {/* 6. LANGUAGE */}
          {activeSection === 'language' && (
            <SectionCard title={t('languageTitle')} subtitle={t('languageSubtitle')}>
              <div className="space-y-3">

                {/* Active language indicator */}
                <div className="flex items-center gap-3 px-4 py-3 rounded-2xl mb-2"
                  style={{ background: 'rgba(0,184,148,0.06)', border: '1px solid rgba(0,184,148,0.18)' }}>
                  <span className="w-2 h-2 rounded-full bg-[#00b894] animate-ping flex-shrink-0" />
                  <span className="text-xs font-semibold text-[#00b894]">{t('langActiveLabel')}:</span>
                  <span className="text-xs text-white font-bold">
                    {language === 'hi' ? '🇮🇳 हिन्दी (Hindi)' : '🇬🇧 English'}
                  </span>
                </div>

                {[
                  { code: 'en', name: 'English', native: 'English', flag: '🇬🇧', preview: 'Settings · Profile · Save Changes' },
                  { code: 'hi', name: 'Hindi', native: 'हिन्दी', flag: '🇮🇳', preview: 'सेटिंग्स · प्रोफ़ाइल · परिवर्तन सहेजें' },
                ].map(lang => {
                  const active = language === lang.code
                  return (
                    <button
                      key={lang.code}
                      id={`lang-${lang.code}`}
                      onClick={() => handleLanguageChange(lang.code)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer"
                      style={{
                        background: active ? 'rgba(0,184,148,0.08)' : 'rgba(255,255,255,0.03)',
                        borderColor: active ? 'rgba(0,184,148,0.3)' : 'rgba(255,255,255,0.08)',
                        transform: active ? 'scale(1.01)' : 'scale(1)',
                      }}
                    >
                      <span className="text-3xl">{lang.flag}</span>
                      <div className="flex-1">
                        <div className={`text-sm font-semibold ${active ? 'text-[#00b894]' : 'text-white'}`}>
                          {lang.name}
                          {active && <span className="ml-2 text-[10px] font-normal text-[#00b894] bg-[#00b894]/10 px-2 py-0.5 rounded-full">Active</span>}
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">{lang.native}</div>
                        <div className="text-[10px] text-slate-600 mt-1 font-mono">{lang.preview}</div>
                      </div>
                      {active && (
                        <div className="w-6 h-6 rounded-full bg-[#00b894] flex items-center justify-center flex-shrink-0">
                          <IconCheck className="w-3.5 h-3.5 text-white" />
                        </div>
                      )}
                    </button>
                  )
                })}

                {/* Live preview panel */}
                <div className="mt-2 p-4 rounded-2xl border border-slate-700/60" style={{ background: 'rgba(255,255,255,0.025)' }}>
                  <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-3">{t('langPreviewLabel')}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'settings', label: 'Settings' },
                      { key: 'profile', label: 'Profile' },
                      { key: 'saveChanges', label: 'Save Changes' },
                      { key: 'notifications', label: 'Notifications' },
                      { key: 'location', label: 'Location' },
                      { key: 'cancel', label: 'Cancel' },
                    ].map(item => (
                      <div key={item.key} className="flex items-center justify-between bg-slate-800/30 rounded-lg px-3 py-2">
                        <span className="text-[10px] text-slate-500">{item.label}</span>
                        <span className="text-xs font-semibold text-white">{t(item.key)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-2 p-4 rounded-2xl border border-slate-800" style={{ background: 'rgba(66,165,245,0.05)' }}>
                  <div className="flex items-start gap-3">
                    <span className="text-[#42a5f5] mt-0.5">ℹ</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{t('langMoreSoon')}</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

          {/* 7. LOCATION SETTINGS */}
          {activeSection === 'location' && (
            <SectionCard title="Location Settings" subtitle="Configure your city, region, and location preferences">
              {/* Permission Status */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl border border-slate-800" style={{ background: 'rgba(255,255,255,0.02)' }}>
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${locationPermission === 'granted' ? 'bg-[#00b894]' : locationPermission === 'denied' ? 'bg-rose-400' : 'bg-yellow-400'}`} style={{ boxShadow: locationPermission === 'granted' ? '0 0 8px rgba(0,184,148,0.5)' : undefined }} />
                <div>
                  <div className="text-sm font-semibold text-white">
                    Location Permission: <span style={{ color: locationPermission === 'granted' ? '#00b894' : locationPermission === 'denied' ? '#fc8181' : '#f6ad55' }}>
                      {locationPermission === 'granted' ? 'Granted' : locationPermission === 'denied' ? 'Denied' : 'Not Set'}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">GPS / browser location access status</div>
                </div>
              </div>

              {/* Use Current Location Toggle */}
              <div className="flex items-center justify-between py-4 mb-6 border-b border-slate-800">
                <div>
                  <div className="text-sm font-semibold text-white">Use Current Location</div>
                  <div className="text-xs text-slate-500 mt-0.5">Auto-detect location using GPS for live city data</div>
                </div>
                <Toggle id="use-current-location-toggle" checked={useCurrentLocation} onChange={handleUseCurrentLocation} />
              </div>

              {/* Manual Location Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                <SettingsInput id="location-city" label="City" value={locationCity} onChange={setLocationCity} placeholder="e.g. Mumbai" icon={<IconMapPin className="w-4 h-4" />} />
                <SettingsInput id="location-state" label="State / Province" value={locationState} onChange={setLocationState} placeholder="e.g. Maharashtra" />
                <SettingsInput id="location-country" label="Country" value={locationCountry} onChange={setLocationCountry} placeholder="e.g. India" icon={<IconGlobe className="w-4 h-4" />} />
              </div>

              <button
                id="save-location-btn"
                onClick={handleSaveLocation}
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all"
                style={{ background: 'linear-gradient(135deg,#00b894,#00a381)' }}
              >
                <IconCheck className="w-4 h-4" />
                Save Location
              </button>
            </SectionCard>
          )}

          {/* 8. ACCOUNT ACTIONS */}
          {activeSection === 'danger' && (
            <div className="space-y-5">
              {/* Logout Card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-slate-800">
                <div className="mb-5 pb-5 border-b border-slate-800">
                  <h2 className="text-lg font-bold text-white">Logout</h2>
                  <p className="text-xs text-slate-500 mt-1">End your current session and return to the login page</p>
                </div>
                <div className="flex items-center gap-5">
                  <div className="flex-1">
                    <p className="text-sm text-slate-400">You are currently signed in as <span className="text-white font-semibold">{currentUser.fullName}</span> ({currentUser.email}).</p>
                  </div>
                  <button
                    id="logout-btn"
                    onClick={() => setShowLogoutDialog(true)}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-white border-none cursor-pointer transition-all flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg,#e53e3e,#c53030)' }}
                  >
                    <IconLogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>

              {/* Delete Account Card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 border border-rose-900/30">
                <div className="mb-5 pb-5 border-b border-rose-900/20">
                  <h2 className="text-lg font-bold text-rose-400 flex items-center gap-2">
                    <IconAlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">These actions are irreversible. Please proceed with caution.</p>
                </div>
                <div className="flex items-start gap-5">
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-white mb-1">Delete Account</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Permanently delete your SmartCityOS account and all associated data. This action <strong className="text-rose-400">cannot be undone</strong>. All your complaints, profile information, and preferences will be permanently erased.
                    </p>
                  </div>
                  <button
                    id="delete-account-btn"
                    onClick={() => { setShowDeleteDialog(true); setDeleteStep(1); setDeleteConfirmText('') }}
                    className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold border border-rose-500/30 text-rose-400 cursor-pointer transition-all flex-shrink-0"
                    style={{ background: 'rgba(229,62,62,0.08)' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,62,62,0.15)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(229,62,62,0.08)' }}
                  >
                    <IconTrash className="w-4 h-4" />
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
