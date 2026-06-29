'use client'

import { useEffect, useState } from 'react'

function formatDaysRemaining(targetIso?: string) {
  const target = new Date(targetIso ?? '2026-11-19T00:00:00.000Z').getTime()
  const diff = target - Date.now()
  if (diff <= 0) return 'GTA VI • Now live'

  const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
  return `GTA VI • Nov 19 2026 • ${days} days`
}

export function CountdownPill({ launchDate }: Readonly<{ launchDate?: string }>) {
  const [label, setLabel] = useState(() => formatDaysRemaining(launchDate))

  useEffect(() => {
    const update = () => setLabel(formatDaysRemaining(launchDate))
    update()
    const timer = window.setInterval(update, 60_000)
    return () => window.clearInterval(timer)
  }, [launchDate])

  return (
    <div className="inline-flex max-w-full items-center justify-center rounded-full border border-fuchsia-400/35 bg-[linear-gradient(90deg,rgba(61,13,68,0.9),rgba(17,47,71,0.9))] px-4 py-2 text-[11px] font-black uppercase tracking-[0.16em] text-rose-100 shadow-[0_0_30px_rgba(236,72,153,0.12)] backdrop-blur-md sm:px-5 sm:py-2.5 sm:text-xs">
      <span className="truncate">{label}</span>
    </div>
  )
}
