import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Mail, Shield, UserCheck, UserX } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getUsers, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminUserDetailPage({ params }: Readonly<{ params: { id: string } }>) {
  await refreshDatabaseSnapshot()
  const users = getUsers()
  const user = users.find((item) => item.id === params.id)

  if (!user) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-pink-300 transition-colors"
      >
        <ChevronLeft className="h-4 w-4" />
        Back to Users
      </Link>

      <GlassPanel className="border-amber-500/20">
        <SectionHeading eyebrow="User Profile" title={user.name} detail={user.email} />
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusBadge label={user.role} tone="blue" />
          <StatusBadge label={user.verified ? 'Verified Active' : 'Pending OTP'} tone={user.verified ? 'emerald' : 'amber'} />
          <StatusBadge label={`Joined ${new Date(user.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}`} tone="violet" />
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-white/10 pt-6">
          <a
            href={`mailto:${user.email}?subject=Message from GtaFans Admin`}
            className="inline-flex items-center gap-2 rounded-full border border-sky-500/30 bg-sky-500/10 px-4 py-2 text-xs font-bold text-sky-200 transition hover:bg-sky-500/20"
          >
            <Mail className="h-3.5 w-3.5 text-sky-400" />
            Send Email
          </a>
        </div>
      </GlassPanel>

      <GlassPanel className="border-white/10">
        <SectionHeading
          eyebrow="Account Details"
          title="Security & Verification Status"
          detail="Account creation timestamps, session logs, and profile attributes."
        />

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Account ID</p>
            <p className="mt-1 font-mono text-xs text-white">{user.id}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Email Address</p>
            <p className="mt-1 font-mono text-xs text-white">{user.email}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Current Role</p>
            <p className="mt-1 text-xs font-bold text-amber-300">{user.role}</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Status</p>
            <p className="mt-1 text-xs font-bold text-emerald-300">{user.verified ? 'Active' : 'Unverified'}</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
