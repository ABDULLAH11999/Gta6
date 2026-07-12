'use client'

import { useState } from 'react'
import { Loader2, LogOut } from 'lucide-react'

export function AdminSignoutButton() {
  const [loading, setLoading] = useState(false)

  async function handleSignout() {
    if (loading) return

    setLoading(true)

    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
      })
    } finally {
      window.location.assign('/admin/login')
    }
  }

  return (
    <button
      type="button"
      onClick={() => void handleSignout()}
      disabled={loading}
      className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#1c1c1c] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin text-white" /> : <LogOut className="h-4 w-4 text-white" />}
      {loading ? 'Signing out' : 'Sign out'}
    </button>
  )
}
