'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Globe, Key, Mail, Sparkles, Sliders } from 'lucide-react'
import type { SiteSettings } from '@/lib/types'

type Draft = {
  title: string
  description: string
  canonicalUrl: string
  ogImage: string
  favicon: string
  launchDate: string
  brandMark: string
  brandTagline: string
  contactEmail: string
  keywords: string
  headerLinksJson: string
  footerLinksJson: string
  socialLinksJson: string
  adminReceivers: string
  smtpEnabled: boolean
  otpRequired: boolean
  smtpHost: string
  smtpPort: string
  smtpSender: string
}

function toDraft(settings: SiteSettings): Draft {
  return {
    title: settings.title,
    description: settings.description,
    canonicalUrl: settings.canonicalUrl,
    ogImage: settings.ogImage,
    favicon: settings.favicon,
    launchDate: settings.launchDate ?? '',
    brandMark: settings.brandMark ?? '',
    brandTagline: settings.brandTagline ?? '',
    contactEmail: settings.contactEmail ?? '',
    keywords: settings.keywords.join(', '),
    headerLinksJson: JSON.stringify(settings.headerLinks ?? [], null, 2),
    footerLinksJson: JSON.stringify(settings.footerLinks ?? [], null, 2),
    socialLinksJson: JSON.stringify(settings.socialLinks ?? [], null, 2),
    adminReceivers: settings.adminReceivers.join(', '),
    smtpEnabled: settings.smtpEnabled,
    otpRequired: settings.otpRequired,
    smtpHost: settings.smtpHost,
    smtpPort: settings.smtpPort,
    smtpSender: settings.smtpSender,
  }
}

export function SettingsManager({ settings }: Readonly<{ settings: SiteSettings }>) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(() => toDraft(settings))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          keywords: draft.keywords,
          headerLinks: JSON.parse(draft.headerLinksJson || '[]'),
          footerLinks: JSON.parse(draft.footerLinksJson || '[]'),
          socialLinks: JSON.parse(draft.socialLinksJson || '[]'),
          adminReceivers: draft.adminReceivers,
        }),
      })

      if (!response.ok) {
        throw new Error('Could not save settings.')
      }

      setSuccess('Settings updated successfully!')
      router.refresh()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-100">
          {error}
        </div>
      ) : null}

      {success ? (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-4 py-3 text-sm font-semibold text-emerald-100">
          {success}
        </div>
      ) : null}

      {/* Section 1: General & Launch */}
      <div className="rounded-[1.8rem] border border-amber-500/20 bg-[#120c24]/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <Sliders className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">General & Launch Countdown</h3>
            <p className="text-xs text-zinc-400">Site titles, countdown target, and branding identity</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Site Title">
            <input value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} className="field-input" />
          </Field>
          <Field label="Brand Mark">
            <input value={draft.brandMark} onChange={(e) => setDraft({ ...draft, brandMark: e.target.value })} className="field-input" />
          </Field>
          <Field label="Brand Tagline" className="md:col-span-2">
            <input value={draft.brandTagline} onChange={(e) => setDraft({ ...draft, brandTagline: e.target.value })} className="field-input" />
          </Field>
          <Field label="Launch Countdown Date" className="md:col-span-2">
            <input
              type="datetime-local"
              value={draft.launchDate ? draft.launchDate.slice(0, 16) : ''}
              onChange={(e) => setDraft({ ...draft, launchDate: e.target.value ? new Date(e.target.value).toISOString() : '' })}
              className="field-input"
            />
          </Field>
          <Field label="Site Description" className="md:col-span-2">
            <textarea rows={2} value={draft.description} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="field-input" />
          </Field>
        </div>
      </div>

      {/* Section 2: SEO & URLs */}
      <div className="rounded-[1.8rem] border border-cyan-500/20 bg-[#120c24]/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">SEO & Social Graph</h3>
            <p className="text-xs text-zinc-400">Canonical paths, keywords, and OpenGraph defaults</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Canonical Domain URL">
            <input value={draft.canonicalUrl} onChange={(e) => setDraft({ ...draft, canonicalUrl: e.target.value })} className="field-input" />
          </Field>
          <Field label="Default OG Image">
            <input value={draft.ogImage} onChange={(e) => setDraft({ ...draft, ogImage: e.target.value })} className="field-input" />
          </Field>
          <Field label="Keywords (Comma separated)" className="md:col-span-2">
            <textarea rows={2} value={draft.keywords} onChange={(e) => setDraft({ ...draft, keywords: e.target.value })} className="field-input" />
          </Field>
        </div>
      </div>

      {/* Section 3: Navigation Links JSON */}
      <div className="rounded-[1.8rem] border border-purple-500/20 bg-[#120c24]/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15 text-purple-400 border border-purple-500/30">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Header & Footer Navigation JSON</h3>
            <p className="text-xs text-zinc-400">JSON arrays defining links and social icons</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <Field label="Header Links JSON">
            <textarea rows={6} value={draft.headerLinksJson} onChange={(e) => setDraft({ ...draft, headerLinksJson: e.target.value })} className="field-input font-mono text-xs" />
          </Field>
          <Field label="Footer Links JSON">
            <textarea rows={6} value={draft.footerLinksJson} onChange={(e) => setDraft({ ...draft, footerLinksJson: e.target.value })} className="field-input font-mono text-xs" />
          </Field>
          <Field label="Social Links JSON">
            <textarea rows={6} value={draft.socialLinksJson} onChange={(e) => setDraft({ ...draft, socialLinksJson: e.target.value })} className="field-input font-mono text-xs" />
          </Field>
        </div>
      </div>

      {/* Section 4: Mail & Notifications */}
      <div className="rounded-[1.8rem] border border-pink-500/20 bg-[#120c24]/70 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-pink-500/15 text-pink-400 border border-pink-500/30">
            <Mail className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white">Email & Security Settings</h3>
            <p className="text-xs text-zinc-400">Contact inbox receiver, SMTP dispatch, and OTP enforcement</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Contact Email">
            <input value={draft.contactEmail} onChange={(e) => setDraft({ ...draft, contactEmail: e.target.value })} className="field-input" />
          </Field>
          <Field label="Admin Receivers">
            <input value={draft.adminReceivers} onChange={(e) => setDraft({ ...draft, adminReceivers: e.target.value })} className="field-input" />
          </Field>
          <Field label="SMTP Host">
            <input value={draft.smtpHost} onChange={(e) => setDraft({ ...draft, smtpHost: e.target.value })} className="field-input" />
          </Field>
          <Field label="SMTP Sender">
            <input value={draft.smtpSender} onChange={(e) => setDraft({ ...draft, smtpSender: e.target.value })} className="field-input" />
          </Field>

          <div className="flex items-center gap-4 md:col-span-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.smtpEnabled}
                onChange={(e) => setDraft({ ...draft, smtpEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-pink-500"
              />
              SMTP Mail Delivery Enabled
            </label>
            <label className="flex items-center gap-2 text-xs font-bold text-zinc-300 cursor-pointer">
              <input
                type="checkbox"
                checked={draft.otpRequired}
                onChange={(e) => setDraft({ ...draft, otpRequired: e.target.checked })}
                className="h-4 w-4 rounded accent-pink-500"
              />
              OTP Verification Required
            </label>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end border-t border-white/10 pt-4">
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/50 bg-gradient-to-r from-pink-500 to-purple-600 px-7 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {saving ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: Readonly<{
  label: string
  children: React.ReactNode
  className?: string
}>) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">{label}</span>
      {children}
    </label>
  )
}
