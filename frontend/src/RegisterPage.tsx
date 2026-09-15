import React, { useState } from 'react'

function IconArrowLeft({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" />
      <polyline points="12 19 5 12 12 5" />
    </svg>
  )
}

function IconEye({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconEyeOff({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
}

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

interface RegisterPageProps {
  onBack: () => void
  onLogin: () => void
}

export default function RegisterPage({ onBack, onLogin }: RegisterPageProps) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  const [profileImage, setProfileImage] = useState<string | null>(null)

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setNotification({ type: 'error', message: 'Profile photo size must be less than 2MB.' })
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfileImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!fullName || !email || !phone || !password || !confirmPassword) {
      setNotification({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setNotification({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }

    // Phone validation (simple check)
    const phoneRegex = /^\+?[0-9\s-]{10,15}$/
    if (!phoneRegex.test(phone)) {
      setNotification({ type: 'error', message: 'Please enter a valid phone number (10-15 digits).' })
      return
    }
    
    // Password match validation
    if (password !== confirmPassword) {
      setNotification({ type: 'error', message: 'Passwords do not match.' })
      return
    }

    // Password strength check
    if (password.length < 6) {
      setNotification({ type: 'error', message: 'Password must be at least 6 characters long.' })
      return
    }
    
    setLoading(true)
    setNotification(null)

    // Check if email already registered
    const existingUsers: { fullName: string; email: string; phone: string; password: string }[] =
      JSON.parse(localStorage.getItem('scm_users') || '[]')
    const alreadyExists = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase())
    if (alreadyExists) {
      setLoading(false)
      setNotification({ type: 'error', message: 'This email is already registered. Please login instead.' })
      return
    }

    // Simulate network delay then save user
    setTimeout(() => {
      const newUser = { fullName, email, phone, password, profileImage }
      const updatedUsers = [...existingUsers, newUser]
      localStorage.setItem('scm_users', JSON.stringify(updatedUsers))

      setLoading(false)
      setNotification({
        type: 'success',
        message: 'Account created successfully! Redirecting to login page...'
      })
      setTimeout(() => {
        onLogin()
      }, 1500)
    }, 1500)
  }

  return (
    <div 
      className="min-h-screen flex flex-col justify-between relative py-8 px-4 font-sans"
      style={{
        background: 'linear-gradient(135deg, #061726 0%, #0a2540 40%, #0d3b6e 80%, #0e4d6c 100%)',
      }}
    >
      {/* Background decoration */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(65,165,245,0.1) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div
        className="absolute top-1/4 right-1/4 pointer-events-none w-[350px] h-[350px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,184,148,0.06) 0%, transparent 70%)',
        }}
      />

      {/* Top Bar */}
      <header className="relative max-w-7xl w-full mx-auto flex justify-between items-center z-10 px-4 md:px-8">
        <button 
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-all duration-200 text-slate-400 hover:text-white group border-none bg-transparent cursor-pointer"
        >
          <IconArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </button>
        
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#0a2540] border border-slate-700">
            <IconGrid className="w-4 h-4 text-[#00b894]" />
          </div>
          <span className="font-bold text-lg text-white tracking-tight font-display">
            SmartCity<span className="text-[#00b894]">OS</span>
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative flex-1 flex items-center justify-center py-8 z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Form Card */}
          <div 
            className="rounded-3xl p-8 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(10, 25, 47, 0.75)',
            }}
          >
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00b894] to-transparent" />

            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display mb-1.5">
                Create Account
              </h2>
              <p className="text-sm text-slate-400">
                Register to join the Smart City ecosystem
              </p>
            </div>

            {/* Notification alert */}
            {notification && (
              <div 
                className={`mb-5 p-4 rounded-xl text-sm border flex flex-col gap-1 transition-all duration-300 ${
                  notification.type === 'success' 
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400' 
                    : notification.type === 'error'
                    ? 'bg-rose-500/10 border-rose-500/25 text-rose-400'
                    : 'bg-blue-500/10 border-blue-500/25 text-blue-400'
                }`}
              >
                <div className="font-semibold capitalize flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    notification.type === 'success' ? 'bg-emerald-400' : notification.type === 'error' ? 'bg-rose-400' : 'bg-blue-400'
                  }`} />
                  {notification.type}
                </div>
                <div>{notification.message}</div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Profile Image Upload */}
              <div className="flex flex-col items-center justify-center mb-4 space-y-2">
                <div className="relative group cursor-pointer w-20 h-20 rounded-full border-2 border-slate-750 hover:border-[#00b894] transition-all overflow-hidden flex items-center justify-center bg-slate-800/40 shadow-inner">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center text-slate-400 text-xs flex flex-col items-center justify-center p-2">
                      <svg className="w-6 h-6 text-slate-400 group-hover:text-[#00b894] transition-colors mb-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-[9px] uppercase font-semibold text-slate-500 group-hover:text-[#00b894] transition-colors">Add Photo</span>
                    </div>
                  )}
                  {/* Invisible file input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
                {profileImage && (
                  <button
                    type="button"
                    onClick={() => setProfileImage(null)}
                    className="text-[10px] text-rose-450 hover:text-rose-400 font-semibold uppercase tracking-wider bg-transparent border-none cursor-pointer"
                  >
                    Remove Photo
                  </button>
                )}
              </div>

              {/* Full Name Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="fullName" 
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00b894'
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 184, 148, 0.25)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="email" 
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@municipality.gov"
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00b894'
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 184, 148, 0.25)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Phone Number Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="phone" 
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 555-0199"
                  className="w-full px-4 py-2.5 rounded-xl border outline-none text-white text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#00b894'
                    e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 184, 148, 0.25)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="password" 
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border outline-none text-white text-sm transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00b894'
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 184, 148, 0.25)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <label 
                  htmlFor="confirmPassword" 
                  className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border outline-none text-white text-sm transition-all duration-200"
                    style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderColor: 'rgba(255, 255, 255, 0.1)',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#00b894'
                      e.currentTarget.style.boxShadow = '0 0 0 1px rgba(0, 184, 148, 0.25)'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
                  >
                    {showConfirmPassword ? <IconEyeOff className="w-4 h-4" /> : <IconEye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer text-white pt-3"
                style={{
                  background: loading ? '#008b6e' : '#00b894',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = '#00a381'; e.currentTarget.style.transform = 'translateY(-1px)'; } }}
                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = '#00b894'; e.currentTarget.style.transform = 'translateY(0)'; } }}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Registering...
                  </>
                ) : (
                  'Sign Up'
                )}
              </button>
            </form>

            {/* Link to Login */}
            <div className="text-center mt-6 text-sm text-slate-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onLogin}
                className="text-[#42a5f5] hover:text-[#64b5f6] font-medium transition-colors border-none bg-transparent cursor-pointer p-0"
              >
                Log in
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative max-w-7xl w-full mx-auto text-center z-10 px-4">
        <p className="text-xs text-slate-500">
          © 2026 SmartCityOS Inc. Secure connection guaranteed.
        </p>
      </footer>
    </div>
  )
}
