import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore.js'

export default function LoginPage() {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const user = useAuthStore((s) => s.user)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  if (user) {
    navigate('/chat', { replace: true })
    return null
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim() || !email.trim()) {
      setError('Both fields are required, darling.')
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('That doesn\'t look like a proper email, I\'m afraid.')
      return
    }
    login(name.trim(), email.trim())
    navigate('/chat', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 mb-5 shadow-lg shadow-indigo-500/10">
            <span className="text-4xl">🎩</span>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Marquis</h1>
          <p className="text-slate-400 text-sm leading-relaxed max-w-xs mx-auto">
            Your frighteningly well-informed AI study abroad advisor. Visas, admissions, and gently delivered home truths.
          </p>
        </div>

        {/* Card */}
        <div className="bg-slate-800/70 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-lg font-semibold text-slate-100 mb-1">Welcome, aspiring scholar</h2>
          <p className="text-slate-400 text-sm mb-6">Tell me who you are, and we shall begin.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1.5">
                Your Name
              </label>
              <input
                id="name"
                type="text"
                className="input-field"
                placeholder="e.g. Alexandra Chen"
                value={name}
                onChange={(e) => { setName(e.target.value); setError('') }}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="input-field"
                placeholder="e.g. alex@university.edu"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
              />
            </div>

            {error && (
              <p className="text-rose-400 text-sm bg-rose-400/10 border border-rose-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" className="btn-primary w-full mt-2 flex items-center justify-center gap-2">
              <span>Begin My Journey</span>
              <span>→</span>
            </button>
          </form>

          <p className="text-center text-slate-500 text-xs mt-5">
            No account needed. Just your name and email.
          </p>
        </div>

        {/* Tagline */}
        <p className="text-center text-slate-600 text-xs mt-6 italic">
          "I admire your ambition. Now let's make sure it's not wildly misplaced."
        </p>
      </div>
    </div>
  )
}
