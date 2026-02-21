'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import PasswordProtection from '@/components/PasswordProtection'

function AdminAuthGate({ children }) {
  const [authed, setAuthed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuthenticated')
    if (auth === 'true') setAuthed(true)
    setLoading(false)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/admin/auth-check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      sessionStorage.setItem('adminAuthenticated', 'true')
      setAuthed(true)
      setError('')
    } else {
      setError('Incorrect password.')
      setPassword('')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
    </div>
  )

  if (authed) return <>{children}</>

  return (
    <div className="min-h-screen bg-[#0a0a12] flex items-center justify-center">
      <div className="w-80 rounded-2xl border border-white/8 bg-white/[0.02] p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center text-black text-sm font-bold">⚡</div>
          <div>
            <div className="text-white text-sm font-bold font-mono">TrimPulses</div>
            <div className="text-slate-500 text-xs font-mono">admin console</div>
          </div>
        </div>
        <h1 className="text-white text-lg font-bold font-mono mb-1">Admin Login</h1>
        <p className="text-slate-500 text-xs mb-6">Enter your admin password to continue.</p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError('') }}
            placeholder="Password"
            autoFocus
            className="w-full bg-white/[0.04] border border-white/8 rounded-lg px-3 py-2.5 text-white text-sm font-mono placeholder-slate-600 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {error && <p className="text-red-400 text-xs font-mono">{error}</p>}
          <button
            type="submit"
            className="w-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-400 hover:bg-cyan-500/20 rounded-lg py-2.5 text-sm font-mono font-bold transition-all"
          >
            → Access Dashboard
          </button>
        </form>
      </div>
    </div>
  )
}

export default function ConditionalLayout({ children }) {
  const pathname = usePathname()
  const isAdmin = pathname.startsWith('/admin')

  if (isAdmin) {
    return (
      <main>
        <AdminAuthGate>{children}</AdminAuthGate>
      </main>
    )
  }

  return (
    <PasswordProtection>
      <Navigation />
      <main>{children}</main>
      <Footer />
    </PasswordProtection>
  )
}
