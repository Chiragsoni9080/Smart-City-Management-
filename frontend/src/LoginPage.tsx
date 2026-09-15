import { useState } from 'react'

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

interface LoginPageProps {
  onBack: () => void
  onRegister: () => void
  onSuccess: () => void
}

export default function LoginPage({ onBack, onRegister, onSuccess }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null)
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setNotification({ type: 'error', message: 'Please fill in all fields.' })
      return
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setNotification({ type: 'error', message: 'Please enter a valid email address.' })
      return
    }
    
    setLoading(true)
    setNotification(null)
    
    setTimeout(() => {
      // Load registered users from localStorage
      let storedUsers: { fullName: string; email: string; phone: string; password: string; profileImage?: string | null; role?: string }[] =
        JSON.parse(localStorage.getItem('scm_users') || '[]')

      // Always ensure default demo user exists in the list
      const defaultEmail = 'rohan@example.com'
      const defaultExists = storedUsers.some(u => u.email.toLowerCase() === defaultEmail)
      if (!defaultExists) {
        storedUsers.push({
          fullName: 'Rohan Sharma',
          email: defaultEmail,
          phone: '+91 98765 43210',
          password: 'password123',
          profileImage: null
        })
      }

      const defaultAdminEmail = 'admin@municipality.gov'
      const adminExists = storedUsers.some(u => u.email.toLowerCase() === defaultAdminEmail)
      if (!adminExists) {
        storedUsers.push({
          fullName: 'Admin Administrator',
          email: defaultAdminEmail,
          phone: '+91 99999 99999',
          password: 'password123',
          profileImage: null,
          role: 'admin'
        })
      }
      localStorage.setItem('scm_users', JSON.stringify(storedUsers))

      const matchedUser = storedUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
      )

      setLoading(false)

      if (!matchedUser) {
        setNotification({
          type: 'error',
          message: 'Invalid email or password. Please check your credentials or register a new account.'
        })
        return
      }

      // Save session
      localStorage.setItem('scm_current_user', JSON.stringify(matchedUser))

      setNotification({
        type: 'success',
        message: `Welcome back, ${matchedUser.fullName}! Access granted.`
      })
      setTimeout(() => {
        onSuccess()
      }, 1000)
    }, 1500)
  }


  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!email) {
      setNotification({ 
        type: 'info', 
        message: 'Please enter your email address first, then click Forgot Password.' 
      })
      return
    }
    
    setNotification({ 
      type: 'success', 
      message: `Password reset instructions have been sent to ${email}!` 
    })
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
        className="absolute top-1/4 left-1/4 pointer-events-none w-[350px] h-[350px] rounded-full"
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
      <main className="relative flex-1 flex items-center justify-center py-12 z-10">
        <div className="w-full max-w-md animate-fade-in">
          {/* Form Card */}
          <div 
            className="rounded-3xl p-8 md:p-10 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden"
            style={{
              background: 'rgba(10, 25, 47, 0.75)',
            }}
          >
            {/* Top decorative line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#00b894] to-transparent" />

            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight font-display mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-slate-400">
                Sign in to the City Management Console
              </p>
            </div>

            {/* Notification alert */}
            {notification && (
              <div 
                className={`mb-6 p-4 rounded-xl text-sm border flex flex-col gap-1 transition-all duration-300 ${
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

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
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
                  placeholder="admin@municipality.gov"
                  className="w-full px-4 py-3 rounded-xl border outline-none text-white text-sm transition-all duration-200"
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
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label 
                    htmlFor="password" 
                    className="text-xs font-semibold uppercase tracking-wider text-slate-400 block"
                  >
                    Password
                  </label>
                  <a
                    href="#forgot"
                    onClick={handleForgotPassword}
                    className="text-xs font-medium text-[#42a5f5] hover:text-[#64b5f6] transition-colors"
                  >
                    Forgot Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-4 pr-11 py-3 rounded-xl border outline-none text-white text-sm transition-all duration-200"
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

              {/* Remember Me Checkbox */}
              <div className="flex items-center">
                <label className="flex items-center gap-3 cursor-pointer group text-slate-300">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div 
                      className={`w-5 h-5 rounded-md border transition-all duration-200 flex items-center justify-center ${
                        rememberMe 
                          ? 'bg-[#00b894] border-[#00b894]' 
                          : 'bg-transparent border-slate-700 group-hover:border-slate-500'
                      }`}
                    >
                      {rememberMe && (
                        <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className="text-sm select-none">Remember Me</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer text-white animate-pulse-slow"
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
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Link to Register */}
            <div className="text-center mt-6 text-sm text-slate-400">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={onRegister}
                className="text-[#42a5f5] hover:text-[#64b5f6] font-medium transition-colors border-none bg-transparent cursor-pointer p-0"
              >
                Register
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
