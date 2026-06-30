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
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-white/10 bg-[#111111] lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3 border-b border-white/10 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-black">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-base font-black tracking-tight text-white">GtaFans</p>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">
              {username ?? 'Admin access'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-5">
          {adminMenu.map(({ href, label, icon: Icon }) => {
            const active =
              href === '/admin'
                ? !segment
                : segment === href.replace('/admin/', '') || segment?.startsWith(href.replace('/admin/', ''))

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-bold transition ${
                  active
                    ? 'border-white/15 bg-white text-black'
                    : 'border-transparent text-zinc-400 hover:border-white/10 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-black' : 'text-zinc-500'}`} />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-4 border-t border-white/10 p-4">
          <div className="rounded-[1.4rem] border border-white/10 bg-black p-4">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">Launch</p>
            <div className="mt-3">
              <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0a0a0a]/95 backdrop-blur">
          <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Admin console</p>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">GtaFans Dashboard</h2>
              <p className="mt-1 max-w-2xl text-sm text-zinc-400">
                Manage posts, categories, SEO, and launch settings from one place.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden sm:block">
                <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
              </div>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white px-4 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:bg-zinc-100"
              >
                <BadgeCheck className="h-4 w-4 text-black" />
                Public site
              </Link>
              <Link
                href="/admin/login"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#141414] px-4 py-2.5 text-xs font-black uppercase tracking-[0.22em] text-white transition hover:bg-[#1c1c1c]"
              >
                <LogOut className="h-4 w-4 text-white" />
                Sign out
              </Link>
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-5 lg:px-8 lg:py-8">
          <div className="animate-panel">{children}</div>
        </main>
      </div>
    </div>
  )
}
