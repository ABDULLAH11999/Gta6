'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { VISITOR_STORAGE_KEY } from '@/lib/constants'

function getOrCreateVisitorId() {
  if (typeof window === 'undefined') return ''

  const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY)
  if (existing) {
    return existing
  }

  const created = window.crypto?.randomUUID?.() || `vis_${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(VISITOR_STORAGE_KEY, created)
  return created
}

function resolveBrowserLocation(): string {
  if (typeof Intl === 'undefined') return 'Unknown'
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''
    if (!tz) return 'Global Visitor'

    // Format human-friendly location from timezone string (e.g. "Asia/Karachi" -> "Karachi (Asia/Karachi)")
    const parts = tz.split('/')
    if (parts.length >= 2) {
      const city = parts[parts.length - 1].replace(/_/g, ' ')
      const region = parts[0]
      return `${city}, ${region}`
    }
    return tz
  } catch {
    return 'Global Visitor'
  }
}

export function VisitorTracker() {
  const pathname = usePathname()
  const lastTrackedUrl = useRef('')

  useEffect(() => {
    const search = window.location.search.replace(/^\?/, '')
    const url = search ? `${pathname}?${search}` : pathname

    // Avoid duplicate tracking of exact same URL in single render
    if (!url || lastTrackedUrl.current === url) {
      return
    }

    lastTrackedUrl.current = url
    const visitorId = getOrCreateVisitorId()
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
    const location = resolveBrowserLocation()

    void fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-visitor-id': visitorId,
      },
      body: JSON.stringify({
        page: pathname,
        search: search ? `?${search}` : '',
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        visitorId,
        timeZone,
        location,
        clientTime: new Date().toISOString(),
      }),
      keepalive: true,
    }).catch(() => undefined)
  }, [pathname])

  return null
}
