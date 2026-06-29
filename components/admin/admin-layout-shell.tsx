'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  BadgeCheck,
  LayoutDashboard,
  ListTree,
  LogOut,
  Newspaper,
  Settings2,
  Shapes,
  Sparkles,
} from 'lucide-react'
import { CountdownPill } from '@/components/countdown-pill'

const adminMenu = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/posts', label: 'Blog Posts', icon: Newspaper },
  { href: '/admin/categories', label: 'Categories', icon: ListTree },
  { href: '/admin/settings', label: 'Settings', icon: Settings2 },
  { href: '/admin/media', label: 'Media', icon: Shapes },
]

export function AdminLayoutShell({
  children,
  username,
  authenticated,
}: Readonly<{
  children: React.ReactNode
  username?: string
  authenticated: boolean
}>) {
  const segment = useSelectedLayoutSegment()
  const isLoginRoute = segment === 'login'

  if (!authenticated || isLoginRoute) {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-[#05010b] text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-0 h-[34rem] w-[56rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(236,72,153,0.18)_0%,rgba(59,130,246,0.12)_30%,transparent_70%)] blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-4 px-3 py-3 lg:grid-cols-[280px_1fr] lg:px-4 lg:py-4">
        <aside className="flex flex-col rounded-[1.7rem] border border-white/10 bg-[rgba(10,8,20,0.9)] p-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-3 border-b border-white/8 pb-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-fuchsia-400/30 bg-fuchsia-500/10">
              <Sparkles className="h-5 w-5 text-fuchsia-100" />
            </div>
            <div>
              <p className="font-display text-base font-black tracking-tight text-white">GtaFans</p>
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">
                {username ?? 'Admin access'}
              </p>
            </div>
          </div>

          <nav className="mt-4 flex flex-col gap-2">
            {adminMenu.map(({ href, label, icon: Icon }) => {
              const active =
                href === '/admin'
                  ? !segment
                  : segment === href.replace('/admin/', '') || segment?.startsWith(href.replace('/admin/', ''))

              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-bold transition ${
                    active
                      ? 'border border-fuchsia-400/25 bg-fuchsia-500/12 text-white'
                      : 'border border-transparent text-slate-400 hover:border-white/8 hover:bg-white/[0.03] hover:text-white'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${active ? 'text-fuchsia-200' : 'text-slate-500'}`} />
                  {label}
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto pt-4">
            <div className="rounded-[1.4rem] border border-white/8 bg-white/[0.03] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.28em] text-slate-500">Launch</p>
              <div className="mt-3">
                <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
              </div>
            </div>
          </div>
        </aside>

        <section className="flex min-w-0 flex-col gap-4">
          <div className="rounded-[1.7rem] border border-white/10 bg-[rgba(10,8,20,0.9)] px-4 py-4 shadow-[0_24px_70px_rgba(0,0,0,0.3)] lg:px-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-fuchsia-200">AdminLTE style console</p>
                <h2 className="mt-1 font-display text-2xl font-black tracking-tight text-white">
                  GtaFans Dashboard
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Manage posts, categories, SEO, and launch settings from one place.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
                >
                  <BadgeCheck className="h-4 w-4 text-fuchsia-200" />
                  Public site
                </Link>
                <Link
                  href="/admin/login"
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
                >
                  <LogOut className="h-4 w-4 text-fuchsia-200" />
                  Sign out
                </Link>
              </div>
            </div>
          </div>

          <div className="min-w-0 animate-panel">{children}</div>
        </section>
      </div>
    </div>
  )
}
