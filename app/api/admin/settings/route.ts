import { NextResponse } from 'next/server'
import { getStoredSettings, saveStoredSettings } from '@/lib/db'

function splitList(value: unknown, fallback: string[] = []) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return fallback
}

export async function GET() {
  return NextResponse.json({ settings: getStoredSettings() })
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>
  const current = getStoredSettings()
  const nextSettings = {
    ...current,
    title: String(body.title ?? current.title),
    description: String(body.description ?? current.description),
    canonicalUrl: String(body.canonicalUrl ?? current.canonicalUrl),
    ogImage: String(body.ogImage ?? current.ogImage),
    favicon: String(body.favicon ?? current.favicon),
    launchDate: String(body.launchDate ?? current.launchDate ?? ''),
    brandMark: String(body.brandMark ?? current.brandMark ?? ''),
    brandTagline: String(body.brandTagline ?? current.brandTagline ?? ''),
    contactEmail: String(body.contactEmail ?? current.contactEmail ?? ''),
    keywords: splitList(body.keywords, current.keywords),
    headerLinks: Array.isArray(body.headerLinks) ? body.headerLinks : current.headerLinks,
    footerLinks: Array.isArray(body.footerLinks) ? body.footerLinks : current.footerLinks,
    socialLinks: Array.isArray(body.socialLinks) ? body.socialLinks : current.socialLinks,
    adminReceivers: splitList(body.adminReceivers, current.adminReceivers),
    smtpEnabled: body.smtpEnabled == null ? current.smtpEnabled : Boolean(body.smtpEnabled),
    otpRequired: body.otpRequired == null ? current.otpRequired : Boolean(body.otpRequired),
    smtpHost: String(body.smtpHost ?? current.smtpHost),
    smtpPort: String(body.smtpPort ?? current.smtpPort),
    smtpSender: String(body.smtpSender ?? current.smtpSender),
  }

  await saveStoredSettings(nextSettings)
  return NextResponse.json({ success: true, settings: nextSettings })
}
