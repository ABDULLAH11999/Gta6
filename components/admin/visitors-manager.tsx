'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Activity, Clock, Globe, MapPin, RefreshCw, Trash2, Users } from 'lucide-react'
import { GlassInset, GlassPanel, StatusBadge } from '@/components/ui/glass'
import { formatExactDateTime, formatRelativeTime } from '@/lib/time'
import type { VisitorRecord } from '@/lib/types'

type VisitorMode = 'all' | 'unique' | 'new' | 'return'

export function VisitorsManager({
  initialVisitors,
}: Readonly<{
  initialVisitors: VisitorRecord[]
}>) {
  const router = useRouter()
  const [ipFilter, setIpFilter] = useState('')
  const [pageFilter, setPageFilter] = useState('')
  const [modeFilter, setModeFilter] = useState<VisitorMode>('all')
  const [clearing, setClearing] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [, setTick] = useState(0)

  // Live timer tick so relative timestamps update dynamically every 10 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setTick((t) => t + 1)
    }, 10000)
    return () => clearInterval(timer)
  }, [])

  const visitors = [...initialVisitors].sort((a, b) => {
    const left = new Date(b.timestamp || 0).getTime()
    const right = new Date(a.timestamp || 0).getTime()
    return left - right
  })

  const now = Date.now()
  const activeRecently = visitors.filter((v) => {
    const elapsed = now - new Date(v.timestamp || 0).getTime()
    return elapsed >= 0 && elapsed <= 15 * 60 * 1000
  }).length

  const filtered = visitors.filter((visitor, index, list) => {
    const matchesMode =
      modeFilter === 'all'
        ? true
        : modeFilter === 'unique'
          ? list.findIndex((item) => item.ip === visitor.ip) === index
          : visitor.type.toLowerCase() === modeFilter

    const matchesIp = !ipFilter || visitor.ip.toLowerCase().includes(ipFilter.toLowerCase())
    const matchesPage = !pageFilter || visitor.page.toLowerCase().includes(pageFilter.toLowerCase())

    return matchesMode && matchesIp && matchesPage
  })

  const uniqueVisitors = new Set(visitors.map((visitor) => visitor.ip)).size
  const returnVisitors = visitors.filter((visitor) => visitor.type === 'Return').length
  const newVisitors = visitors.filter((visitor) => visitor.type === 'New').length

  async function handleClearLogs() {
    if (!confirm('Are you sure you want to clear all visitor tracking records?')) return
    setClearing(true)
    try {
      const res = await fetch('/api/visitors', { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to clear logs')
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to clear logs')
    } finally {
      setClearing(false)
    }
  }

  function handleManualRefresh() {
    setRefreshing(true)
    router.refresh()
    setTimeout(() => setRefreshing(false), 500)
  }

  const fieldClass =
    'w-full rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs font-semibold text-white outline-none transition-all placeholder:text-zinc-500 focus:border-pink-500/50'

  return (
    <div className="space-y-5">
      {/* Minimalist Header Card */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-[#120c24]/80 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.26em] text-pink-400">Live Traffic Engine</p>
          </div>
          <h2 className="mt-1 text-xl font-black text-white">Dynamic Visitor Analytics</h2>
          <p className="text-xs text-zinc-400 mt-0.5">Real-time location, IP tracking, and dynamic timestamps</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-bold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin text-cyan-400' : 'text-cyan-400'}`} />
            Refresh
          </button>
          <button
            type="button"
            onClick={handleClearLogs}
            disabled={clearing || visitors.length === 0}
            className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3.5 py-2 text-xs font-bold text-rose-200 transition hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5 text-rose-400" />
            Clear
          </button>
        </div>
      </div>

      {/* Minimalist Metrics Grid */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <MinimalMetric label="Total Visits" value={visitors.length} tone="pink" icon={Activity} />
        <MinimalMetric label="Unique Visitors" value={uniqueVisitors} tone="cyan" icon={Users} />
        <MinimalMetric label="Active Live (15m)" value={activeRecently} tone="emerald" icon={Globe} livePulse />
        <MinimalMetric label="Returning Visits" value={returnVisitors} tone="violet" icon={Clock} />
      </div>

      {/* Main Table & Filter Container */}
      <div className="rounded-2xl border border-white/10 bg-[#120c24]/80 p-5 backdrop-blur-md">
        {/* Minimal Filters Bar */}
        <div className="mb-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
          <input
            value={ipFilter}
            onChange={(e) => setIpFilter(e.target.value)}
            placeholder="Search by IP..."
            className={fieldClass}
          />
          <input
            value={pageFilter}
            onChange={(e) => setPageFilter(e.target.value)}
            placeholder="Search by page URL..."
            className={fieldClass}
          />
          <select
            value={modeFilter}
            onChange={(e) => setModeFilter(e.target.value as VisitorMode)}
            className={fieldClass}
          >
            <option value="all">All Visitors ({visitors.length})</option>
            <option value="unique">Unique IPs Only ({uniqueVisitors})</option>
            <option value="new">New Visitors ({newVisitors})</option>
            <option value="return">Returning Visitors ({returnVisitors})</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setIpFilter('')
              setPageFilter('')
              setModeFilter('all')
            }}
            className="rounded-xl border border-white/10 bg-white/5 py-2 text-xs font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
          >
            Reset Filters
          </button>
        </div>

        {/* Results Info */}
        <div className="mb-3 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold text-zinc-300">
            {filtered.length} {filtered.length === 1 ? 'event' : 'events'} shown
          </span>
          <span className="text-[11px] text-zinc-500">
            Auto-refreshing & live dynamic time
          </span>
        </div>

        {/* Mobile View */}
        <div className="space-y-2.5 md:hidden">
          {filtered.map((visitor) => (
            <GlassInset key={visitor.id} className="rounded-xl border-white/10 p-3.5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-pink-300">{visitor.ip}</span>
                <StatusBadge
                  label={visitor.type}
                  tone={visitor.type === 'New' ? 'emerald' : 'cyan'}
                />
              </div>
              <div className="mt-2 flex items-center gap-1.5 text-xs text-zinc-200">
                <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{visitor.location || 'Global Visitor'}</span>
              </div>
              <p className="mt-1 break-all font-mono text-[11px] text-zinc-400">{visitor.page}</p>
              <div className="mt-2 flex items-center justify-between text-[10px] text-zinc-400 border-t border-white/5 pt-1.5">
                <span>{visitor.referrer}</span>
                <span className="font-semibold text-amber-300">
                  {formatRelativeTime(visitor.timestamp)}
                </span>
              </div>
            </GlassInset>
          ))}
          {filtered.length === 0 && (
            <div className="rounded-xl border border-white/10 bg-black/20 p-8 text-center text-xs text-zinc-400">
              No visitor events recorded.
            </div>
          )}
        </div>

        {/* Desktop Minimalist Table */}
        <div className="hidden overflow-hidden rounded-xl border border-white/10 md:block">
          <table className="min-w-full divide-y divide-white/10 text-left text-xs font-medium text-white">
            <thead className="bg-black/40 text-zinc-400">
              <tr>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">IP Address</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Location & Country</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Visited Page</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Referrer</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Exact Time & Elapsed</th>
                <th className="px-4 py-3 font-bold uppercase tracking-wider text-[10px]">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-black/20">
              {filtered.map((visitor) => (
                <tr key={visitor.id} className="transition-colors hover:bg-white/[0.04]">
                  <td className="px-4 py-3 font-mono font-bold text-pink-300">{visitor.ip}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5 text-zinc-200">
                      <MapPin className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                      <span className="font-semibold">{visitor.location || 'Global Visitor'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-cyan-300 max-w-[200px] truncate" title={visitor.page}>
                    {visitor.page}
                  </td>
                  <td className="px-4 py-3 text-zinc-400">{visitor.referrer}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-semibold text-amber-300">
                        {formatRelativeTime(visitor.timestamp)}
                      </p>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        {formatExactDateTime(visitor.timestamp)}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge
                      label={visitor.type}
                      tone={visitor.type === 'New' ? 'emerald' : 'cyan'}
                    />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-xs text-zinc-400">
                    No visitor records found. Public page visits will track here automatically.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

function MinimalMetric({
  label,
  value,
  tone = 'pink',
  icon: Icon,
  livePulse = false,
}: Readonly<{
  label: string
  value: number
  tone?: 'pink' | 'cyan' | 'emerald' | 'violet'
  icon: React.ComponentType<{ className?: string }>
  livePulse?: boolean
}>) {
  const tones = {
    pink: 'border-pink-500/30 text-pink-400',
    cyan: 'border-cyan-500/30 text-cyan-400',
    emerald: 'border-emerald-500/30 text-emerald-400',
    violet: 'border-purple-500/30 text-purple-400',
  }[tone]

  return (
    <div className={`rounded-xl border ${tones} bg-black/40 p-4 transition-all hover:bg-black/60`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">{label}</span>
        <div className="flex items-center gap-1">
          {livePulse ? <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" /> : null}
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-2 text-2xl font-black text-white">{value.toLocaleString()}</p>
    </div>
  )
}
