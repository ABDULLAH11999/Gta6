'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Clock, Mail, MessageSquare, Trash2 } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import type { ContactMessage } from '@/lib/types'

export function ContactMessagesManager({
  initialMessages,
}: Readonly<{
  initialMessages: ContactMessage[]
}>) {
  const router = useRouter()
  const [messages, setMessages] = useState<ContactMessage[]>(initialMessages)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>('all')

  async function handleUpdateStatus(id: string, newStatus: ContactMessage['status']) {
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/contact-us/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })
      if (!res.ok) throw new Error('Failed to update message status')
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: newStatus } : m)),
      )
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating status')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDeleteMessage(id: string) {
    if (!confirm('Are you sure you want to delete this contact submission?')) return
    setLoadingId(id)
    try {
      const res = await fetch(`/api/admin/contact-us/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete message')
      setMessages((prev) => prev.filter((m) => m.id !== id))
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting message')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredMessages = messages.filter((m) => {
    if (filterStatus === 'all') return true
    return m.status.toLowerCase() === filterStatus.toLowerCase()
  })

  return (
    <GlassPanel className="border-sky-500/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <SectionHeading
          eyebrow="Contact Inbox"
          title="User Support & Partnership Requests"
          detail="Review inquiries, mark messages as answered or in review, and follow up directly."
        />
        <div className="flex items-center gap-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-sky-500/50"
          >
            <option value="all">All Statuses ({messages.length})</option>
            <option value="unread">Unread</option>
            <option value="in review">In Review</option>
            <option value="answered">Answered / Resolved</option>
          </select>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {filteredMessages.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-white/10 bg-black/40 p-5 transition-all duration-200 hover:border-sky-500/30 hover:bg-white/[0.03]"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 text-sky-400">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{item.name}</p>
                  <p className="text-[11px] font-mono text-zinc-400">
                    {item.email} • <span className="text-sky-300 font-semibold">{item.topic}</span>
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge
                  label={item.status}
                  tone={item.status === 'Unread' ? 'rose' : item.status === 'In Review' ? 'amber' : 'emerald'}
                />
                <span className="text-[11px] text-zinc-500">{item.createdAt}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-white/5 bg-black/30 p-3.5 text-xs leading-relaxed text-zinc-300">
              {item.message}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-3">
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'Answered')}
                  disabled={loadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-[11px] font-bold text-emerald-200 transition hover:bg-emerald-500/20"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Mark Answered
                </button>

                <button
                  type="button"
                  onClick={() => handleUpdateStatus(item.id, 'In Review')}
                  disabled={loadingId === item.id}
                  className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-[11px] font-bold text-amber-200 transition hover:bg-amber-500/20"
                >
                  <Clock className="h-3.5 w-3.5 text-amber-400" />
                  In Review
                </button>

                <a
                  href={`mailto:${item.email}?subject=Re: ${encodeURIComponent(item.topic || 'GTA Fans Inquiry')}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/30 bg-sky-500/10 px-3.5 py-1.5 text-[11px] font-bold text-sky-200 transition hover:bg-sky-500/20"
                >
                  <Mail className="h-3.5 w-3.5 text-sky-400" />
                  Email Reply
                </a>
              </div>

              <button
                type="button"
                onClick={() => handleDeleteMessage(item.id)}
                disabled={loadingId === item.id}
                className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[11px] font-bold text-rose-200 transition hover:bg-rose-500/20"
              >
                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                Delete
              </button>
            </div>
          </div>
        ))}

        {filteredMessages.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-12 text-center text-sm text-zinc-400">
            No contact submissions in the selected category.
          </div>
        )}
      </div>
    </GlassPanel>
  )
}
