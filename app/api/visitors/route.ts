import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getVisitors, saveVisitors } from '@/lib/db'
import type { VisitorRecord } from '@/lib/types'
import { formatRelativeTime } from '@/lib/time'

function firstHeaderValue(value: string | null | undefined) {
  if (!value) return ''
  return value.split(',')[0]?.trim() || ''
}

function resolveIp(headers: Headers) {
  return (
    firstHeaderValue(headers.get('x-client-ip')) ||
    firstHeaderValue(headers.get('x-forwarded-for')) ||
    headers.get('x-real-ip')?.trim() ||
    headers.get('cf-connecting-ip')?.trim() ||
    headers.get('x-client-ip')?.trim() ||
    ''
  )
}

function resolveVisitorId(headers: Headers, body: Record<string, unknown>) {
  return String(body.visitorId || headers.get('x-visitor-id') || '').trim()
}

function resolveLocation(headers: Headers, body: Record<string, unknown>, ip: string): string {
  // 1. Client-provided location
  if (body.location && typeof body.location === 'string' && body.location.trim() && body.location !== 'Unknown') {
    return body.location.trim()
  }

  // 2. Client-provided timezone
  if (body.timeZone && typeof body.timeZone === 'string' && body.timeZone.trim()) {
    const tz = body.timeZone.trim()
    const parts = tz.split('/')
    if (parts.length >= 2) {
      return `${parts[parts.length - 1].replace(/_/g, ' ')} (${parts[0]})`
    }
    return tz
  }

  // 3. Vercel / Cloudflare edge geo headers
  const city = headers.get('x-vercel-ip-city')?.trim()
  const country = headers.get('x-vercel-ip-country')?.trim() || headers.get('cf-ipcountry')?.trim()
  const region = headers.get('x-vercel-ip-country-region')?.trim()
  const parts = [city, region, country].filter(Boolean)
  if (parts.length) {
    return parts.join(', ')
  }

  // 4. Localhost check
  if (ip === '::1' || ip === '127.0.0.1' || ip.includes('127.0.0.1')) {
    return 'Local Network'
  }

  return 'Global Visitor'
}

export async function GET() {
  const visitors = getVisitors()
  return NextResponse.json({ visitors })
}

export async function DELETE() {
  await saveVisitors([])
  return NextResponse.json({ success: true, message: 'Visitor logs cleared successfully.' })
}

export async function POST(request: Request) {
  const headers = request.headers
  const body = await request.json().catch(() => ({} as Record<string, unknown>))

  const page = String(body.page || headers.get('x-visitor-path') || '/').trim() || '/'
  const search = String(body.search || headers.get('x-visitor-search') || '').trim()
  const referrer = String(body.referrer || headers.get('referer') || 'Direct').trim() || 'Direct'
  const userAgent = String(body.userAgent || headers.get('user-agent') || '').trim()
  const visitorId = resolveVisitorId(headers, body)
  
  // Use accurate client time if provided and valid, otherwise current server UTC
  const clientTime = body.clientTime && typeof body.clientTime === 'string' && !isNaN(Date.parse(body.clientTime))
    ? body.clientTime
    : new Date().toISOString()
  
  const timestamp = clientTime
  const ip = String(body.ip || resolveIp(headers)).trim() || (visitorId ? `visitor-${visitorId.slice(0, 8)}` : '127.0.0.1')
  const session = String(body.session || visitorId || `sess_${crypto.randomBytes(3).toString('hex')}`)
  const location = resolveLocation(headers, body, ip)

  const existing = getVisitors()
  const recentMatch = existing.find((visitor) => {
    if (visitor.session !== session) return false
    if (visitor.page !== `${page}${search}`) return false

    const elapsed = Date.now() - new Date(visitor.timestamp).getTime()
    return elapsed >= 0 && elapsed < 45000
  })

  if (recentMatch) {
    // If recent match had unknown/generic location and now we have a better one, update it
    if (location && location !== 'Global Visitor' && recentMatch.location === 'Global Visitor') {
      recentMatch.location = location
      await saveVisitors(existing)
    }

    return NextResponse.json({
      success: true,
      visitor: {
        ...recentMatch,
        visitedAt: formatRelativeTime(recentMatch.timestamp),
        userAgent,
      },
      deduped: true,
    })
  }

  const record: VisitorRecord = {
    id: crypto.randomUUID(),
    ip,
    location,
    page: `${page}${search}`,
    referrer,
    timestamp,
    visitedAt: formatRelativeTime(timestamp),
    session,
    type: existing.some((visitor) => visitor.session === session || visitor.ip === ip) ? 'Return' : 'New',
  }

  const nextVisitors = [record, ...existing].slice(0, 1000)
  await saveVisitors(nextVisitors)

  return NextResponse.json({
    success: true,
    visitor: {
      ...record,
      userAgent,
    },
  })
}
