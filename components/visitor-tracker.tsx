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

  const created = window.crypto?.randomUUID?.() || `visitor_${Math.random().toString(36).slice(2, 10)}`
  window.localStorage.setItem(VISITOR_STORAGE_KEY, created)
  return created
}

export function VisitorTracker() {
  const pathname = usePathname()
  const lastTrackedUrl = useRef('')

  useEffect(() => {
    const search = window.location.search.replace(/^\?/, '')
    const url = search ? `${pathname}?${search}` : pathname

    if (!url || lastTrackedUrl.current === url) {
      if (!lastTrackedUrl.current) {
        lastTrackedUrl.current = url
        getOrCreateVisitorId()
      }
      return
    }

    lastTrackedUrl.current = url

    void fetch('/api/visitors', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-visitor-id': getOrCreateVisitorId(),
      },
      body: JSON.stringify({
        page: pathname,
        search: search ? `?${search}` : '',
        referrer: document.referrer || 'Direct',
        userAgent: navigator.userAgent,
        visitorId: getOrCreateVisitorId(),
      }),
      keepalive: true,
    }).catch(() => undefined)
  }, [pathname])

  return null
}
