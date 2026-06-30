'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export function AdminLoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(username: string, password: string) {
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
        }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        setError(data.error || 'Login failed.')
        return
      }

      window.location.assign('/admin')
    } catch {
      setError('Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        void submit(String(formData.get('username') || ''), String(formData.get('password') || ''))
      }}
      className="mt-6 space-y-4 rounded-[1.4rem] border border-white/10 bg-[#111111] p-5 sm:p-6"
    >
      <input
        name="username"
        placeholder="Admin username or email"
        required
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white/30 focus:bg-[#0d0d0d]"
      />
      <input
        name="password"
        type="password"
        placeholder="Admin password"
        required
        className="w-full rounded-xl border border-white/10 bg-black px-4 py-3 text-sm font-medium text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white/30 focus:bg-[#0d0d0d]"
      />
      {error ? <p className="text-xs font-semibold text-zinc-300">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl border border-white/10 bg-white px-5 py-3 text-sm font-bold text-black transition-all hover:bg-zinc-100 disabled:opacity-70"
      >
        <span className="inline-flex items-center justify-center gap-2">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {loading ? 'Signing in...' : 'Enter admin panel'}
        </span>
      </button>
    </form>
  )
}
