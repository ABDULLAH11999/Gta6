'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle2, Eye, Shield, Trash2, UserX, Users } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import type { AuthUser } from '@/lib/types'

export function UsersManager({ initialUsers }: Readonly<{ initialUsers: AuthUser[] }>) {
  const router = useRouter()
  const [users, setUsers] = useState<AuthUser[]>(initialUsers)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<string>('all')

  async function handleToggleVerify(userId: string, currentVerified: boolean) {
    setLoadingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ verified: !currentVerified }),
      })
      if (!res.ok) throw new Error('Failed to update user status')
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, verified: !currentVerified } : u)),
      )
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error updating user')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleChangeRole(userId: string, newRole: string) {
    setLoadingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })
      if (!res.ok) throw new Error('Failed to change user role')
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole as any } : u)),
      )
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error changing role')
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDeleteUser(userId: string) {
    if (!confirm('Are you sure you want to delete this user account?')) return
    setLoadingId(userId)
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete user')
      setUsers((prev) => prev.filter((u) => u.id !== userId))
      router.refresh()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error deleting user')
    } finally {
      setLoadingId(null)
    }
  }

  const filteredUsers = users.filter((u) => {
    if (filterRole === 'all') return true
    return u.role.toLowerCase() === filterRole.toLowerCase()
  })

  return (
    <GlassPanel className="border-amber-500/20">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-white/10 pb-5">
        <SectionHeading
          eyebrow="User Administration"
          title="Manage Registered Accounts & Roles"
          detail="Active accounts, permission escalation, status toggle, and player moderation."
        />
        <div className="flex items-center gap-2">
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="rounded-xl border border-white/10 bg-black/40 px-3.5 py-2 text-xs font-semibold text-white outline-none focus:border-amber-500/50"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="admin">Admins</option>
            <option value="moderator">Moderators</option>
            <option value="user">Users</option>
          </select>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <table className="min-w-full divide-y divide-white/10 text-left text-xs font-medium text-white">
          <thead className="bg-black/40 text-zinc-400">
            <tr>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">User Account</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Role</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Registered Date</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px]">Verification</th>
              <th className="px-5 py-4 font-bold uppercase tracking-wider text-[10px] text-right">Moderation Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 bg-black/20">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition-colors hover:bg-white/[0.04]">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-500/30 bg-amber-500/10 font-bold text-amber-300">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div>
                      <p className="font-bold text-white text-sm">{user.name}</p>
                      <p className="text-[11px] text-zinc-400 font-mono">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.id, e.target.value)}
                    disabled={loadingId === user.id}
                    className="rounded-lg border border-white/10 bg-black/50 px-2.5 py-1 text-xs font-bold text-amber-300 outline-none focus:border-amber-400"
                  >
                    <option value="User">User</option>
                    <option value="Moderator">Moderator</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
                <td className="px-5 py-4 text-zinc-400">
                  {new Date(user.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </td>
                <td className="px-5 py-4">
                  <StatusBadge
                    label={user.verified ? 'Verified Active' : 'Pending OTP'}
                    tone={user.verified ? 'emerald' : 'amber'}
                  />
                </td>
                <td className="px-5 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleVerify(user.id, user.verified)}
                      disabled={loadingId === user.id}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold transition ${
                        user.verified
                          ? 'border-amber-500/30 bg-amber-500/10 text-amber-200 hover:bg-amber-500/20'
                          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20'
                      }`}
                    >
                      {user.verified ? (
                        <>
                          <UserX className="h-3 w-3 text-amber-400" />
                          Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          Activate
                        </>
                      )}
                    </button>

                    <Link
                      href={`/admin/users/${user.id}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-bold text-cyan-200 transition hover:bg-cyan-500/20"
                    >
                      <Eye className="h-3 w-3 text-cyan-400" />
                      Detail
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleDeleteUser(user.id)}
                      disabled={loadingId === user.id}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[10px] font-bold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3 w-3 text-rose-400" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-sm text-zinc-400">
                  No registered users found in the current category.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  )
}
