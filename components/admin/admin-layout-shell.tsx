'use client'

import Link from 'next/link'
import { useSelectedLayoutSegment } from 'next/navigation'
import {
  BadgeCheck,
  Contact,
  LayoutDashboard,
  ListTree,
  Newspaper,
  Settings2,
  Shapes,
  Sparkles,
  Users,
  Waypoints,
} from 'lucide-react'
import { AdminSignoutButton } from '@/components/admin/admin-signout-button'
import { CountdownPill } from '@/components/countdown-pill'

const adminMenu = [
  {
    href: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    activeGradient: 'from-pink-500 to-rose-500',
    iconColor: 'text-pink-400',
    glowColor: 'shadow-[0_0_15px_rgba(236,72,153,0.35)]',
  },
  {
    href: '/admin/posts',
    label: 'Blog Posts',
    icon: Newspaper,
    activeGradient: 'from-purple-500 to-indigo-500',
    iconColor: 'text-purple-400',
    glowColor: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
  },
  {
    href: '/admin/categories',
    label: 'Categories',
    icon: ListTree,
    activeGradient: 'from-cyan-500 to-blue-500',
    iconColor: 'text-cyan-400',
    glowColor: 'shadow-[0_0_15px_rgba(6,182,212,0.35)]',
  },
  {
    href: '/admin/visitors',
    label: 'Visitors',
    icon: Waypoints,
    activeGradient: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-400',
    glowColor: 'shadow-[0_0_15px_rgba(16,185,129,0.35)]',
  },
  {
    href: '/admin/users',
    label: 'Users',
    icon: Users,
    activeGradient: 'from-amber-500 to-orange-500',
    iconColor: 'text-amber-400',
    glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.35)]',
  },
  {
    href: '/admin/contact-us',
    label: 'Contact',
    icon: Contact,
    activeGradient: 'from-sky-500 to-cyan-500',
    iconColor: 'text-sky-400',
    glowColor: 'shadow-[0_0_15px_rgba(14,165,233,0.35)]',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings2,
    activeGradient: 'from-yellow-400 to-amber-500',
    iconColor: 'text-yellow-400',
    glowColor: 'shadow-[0_0_15px_rgba(234,179,8,0.35)]',
  },
  {
    href: '/admin/media',
    label: 'Media',
    icon: Shapes,
    activeGradient: 'from-fuchsia-500 to-pink-500',
    iconColor: 'text-fuchsia-400',
    glowColor: 'shadow-[0_0_15px_rgba(217,70,239,0.35)]',
  },
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
    <div className="min-h-screen bg-[#080512] text-white">
      {/* Sidebar background */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 border-r border-fuchsia-500/15 bg-[#100922]/90 backdrop-blur-xl lg:flex lg:flex-col">
        <div className="flex h-20 items-center gap-3.5 border-b border-fuchsia-500/15 px-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/20 via-purple-500/20 to-cyan-500/20 shadow-[0_0_15px_rgba(255,46,166,0.3)]">
            <Sparkles className="h-5 w-5 text-pink-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 font-display text-lg font-black tracking-tight text-white">
              <span>GTA</span>
              <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                FANS
              </span>
            </div>
            <p className="text-[9px] font-black uppercase tracking-[0.26em] text-pink-300/80">
              {username ?? 'Administrator'}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {adminMenu.map(({ href, label, icon: Icon, activeGradient, iconColor, glowColor }) => {
            const active =
              href === '/admin'
                ? !segment
                : segment === href.replace('/admin/', '') || segment?.startsWith(href.replace('/admin/', ''))

            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold transition-all duration-200 ${
                  active
                    ? `bg-gradient-to-r ${activeGradient} text-white font-extrabold ${glowColor} scale-[1.02]`
                    : 'text-zinc-300 hover:bg-white/[0.06] hover:text-white border border-transparent hover:border-white/10'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-white' : iconColor}`} />
                <span>{label}</span>
                {active ? <span className="ml-auto h-2 w-2 rounded-full bg-white animate-pulse" /> : null}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-4 border-t border-fuchsia-500/15 p-4">
          <div className="rounded-[1.4rem] border border-pink-500/20 bg-gradient-to-b from-pink-950/20 to-black/40 p-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-pink-300">Countdown</p>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div className="mt-2.5">
              <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
            </div>
          </div>
        </div>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-20 border-b border-fuchsia-500/15 bg-[#080512]/90 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4 px-4 py-4 lg:px-8">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-pink-500 animate-ping" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-400">Admin Control Center</p>
              </div>
              <h2 className="mt-1 text-2xl font-black tracking-tight text-white">
                GTA 6 Fans <span className="bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">Management</span>
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Mobile quick navigation */}
              <div className="flex items-center gap-1.5 rounded-full border border-pink-500/20 bg-black/40 p-1 lg:hidden">
                {adminMenu.slice(0, 4).map(({ href, label, icon: Icon, activeGradient }) => {
                  const active =
                    href === '/admin'
                      ? !segment
                      : segment === href.replace('/admin/', '') ||
                        segment?.startsWith(href.replace('/admin/', ''))

                  return (
                    <Link
                      key={href}
                      href={href}
                      className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                        active
                          ? `bg-gradient-to-r ${activeGradient} text-white shadow-[0_0_10px_rgba(236,72,153,0.4)]`
                          : 'text-zinc-400 hover:bg-white/10 hover:text-white'
                      }`}
                      aria-label={label}
                      title={label}
                    >
                      <Icon className="h-4 w-4" />
                    </Link>
                  )
                })}
              </div>

              <div className="hidden sm:block">
                <CountdownPill launchDate="2026-11-19T00:00:00.000Z" />
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] text-pink-200 transition hover:bg-pink-500/30 hover:text-white shadow-[0_0_15px_rgba(236,72,153,0.25)]"
              >
                <BadgeCheck className="h-4 w-4 text-pink-400" />
                Public Site
              </Link>
              <AdminSignoutButton />
            </div>
          </div>
        </header>

        <main className="min-w-0 px-4 py-6 lg:px-8 lg:py-8">
          <div className="animate-panel">{children}</div>
        </main>
      </div>
    </div>
  )
}
