'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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

  async function handleSave() {
    setSaving(true)
    setError('')

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

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save settings.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-4">
      {error ? (
        <div className="mb-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
          {error}
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Site Title">
          <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="field-input" />
        </Field>
        <Field label="Launch Date">
          <input type="datetime-local" value={draft.launchDate} onChange={(event) => setDraft({ ...draft, launchDate: event.target.value })} className="field-input" />
        </Field>
        <Field label="Description" className="md:col-span-2">
          <textarea rows={3} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="field-input" />
        </Field>
        <Field label="Brand Mark">
          <input value={draft.brandMark} onChange={(event) => setDraft({ ...draft, brandMark: event.target.value })} className="field-input" />
        </Field>
        <Field label="Brand Tagline">
          <input value={draft.brandTagline} onChange={(event) => setDraft({ ...draft, brandTagline: event.target.value })} className="field-input" />
        </Field>
        <Field label="Canonical URL">
          <input value={draft.canonicalUrl} onChange={(event) => setDraft({ ...draft, canonicalUrl: event.target.value })} className="field-input" />
        </Field>
        <Field label="Contact Email">
          <input value={draft.contactEmail} onChange={(event) => setDraft({ ...draft, contactEmail: event.target.value })} className="field-input" />
        </Field>
        <Field label="Keywords" className="md:col-span-2">
          <textarea rows={3} value={draft.keywords} onChange={(event) => setDraft({ ...draft, keywords: event.target.value })} className="field-input" />
        </Field>
        <Field label="Header Links JSON" className="md:col-span-2">
          <textarea rows={6} value={draft.headerLinksJson} onChange={(event) => setDraft({ ...draft, headerLinksJson: event.target.value })} className="field-input font-mono text-[12px]" />
        </Field>
        <Field label="Footer Links JSON" className="md:col-span-2">
          <textarea rows={6} value={draft.footerLinksJson} onChange={(event) => setDraft({ ...draft, footerLinksJson: event.target.value })} className="field-input font-mono text-[12px]" />
        </Field>
        <Field label="Social Links JSON" className="md:col-span-2">
          <textarea rows={5} value={draft.socialLinksJson} onChange={(event) => setDraft({ ...draft, socialLinksJson: event.target.value })} className="field-input font-mono text-[12px]" />
        </Field>
        <Field label="Admin Receivers" className="md:col-span-2">
          <input value={draft.adminReceivers} onChange={(event) => setDraft({ ...draft, adminReceivers: event.target.value })} className="field-input" />
        </Field>
        <Field label="SMTP Host">
          <input value={draft.smtpHost} onChange={(event) => setDraft({ ...draft, smtpHost: event.target.value })} className="field-input" />
        </Field>
        <Field label="SMTP Port">
          <input value={draft.smtpPort} onChange={(event) => setDraft({ ...draft, smtpPort: event.target.value })} className="field-input" />
        </Field>
        <Field label="SMTP Sender" className="md:col-span-2">
          <input value={draft.smtpSender} onChange={(event) => setDraft({ ...draft, smtpSender: event.target.value })} className="field-input" />
        </Field>
        <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
          <input type="checkbox" checked={draft.smtpEnabled} onChange={(event) => setDraft({ ...draft, smtpEnabled: event.target.checked })} />
          SMTP enabled
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
          <input type="checkbox" checked={draft.otpRequired} onChange={(event) => setDraft({ ...draft, otpRequired: event.target.checked })} />
          OTP required
        </label>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
        <p className="text-xs text-slate-500">Edit the countdown, SEO defaults, and contact/social settings used across the site.</p>
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-50 transition hover:bg-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save settings'}
        </button>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.24);
          padding: 0.75rem 0.9rem;
          color: white;
          outline: none;
        }
        .field-input:focus {
          border-color: rgba(236, 72, 153, 0.35);
          box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.12);
        }
      `}</style>
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
    <label className={`block space-y-2 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}
