import type { ReactNode } from 'react'

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(' ')
}

export function GlassPanel({
  children,
  className = '',
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <section
      className={cx(
        'rounded-[1.8rem] border border-white/10 bg-[#120c24]/70 p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md transition-all duration-300 sm:p-6 hover:border-white/15',
        className,
      )}
    >
      {children}
    </section>
  )
}

export function GlassInset({
  children,
  className = '',
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <div
      className={cx(
        'rounded-[1.4rem] border border-white/10 bg-black/40 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] backdrop-blur-sm transition-all duration-200',
        className,
      )}
    >
      {children}
    </div>
  )
}

export function SectionHeading({
  eyebrow,
  title,
  detail,
}: Readonly<{
  eyebrow: string
  title: string
  detail?: string
}>) {
  return (
    <div className="space-y-1.5">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-400">{eyebrow}</p>
      <h2 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      {detail ? <p className="max-w-2xl text-sm leading-7 text-zinc-300">{detail}</p> : null}
    </div>
  )
}

export function StatusBadge({
  label,
  tone = 'violet',
}: Readonly<{
  label: string
  tone?: 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'yellow' | 'pink' | 'cyan'
}>) {
  const tones: Record<string, string> = {
    violet: 'border-purple-500/30 bg-purple-500/15 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]',
    blue: 'border-sky-500/30 bg-sky-500/15 text-sky-200 shadow-[0_0_10px_rgba(56,189,248,0.2)]',
    emerald: 'border-emerald-500/30 bg-emerald-500/15 text-emerald-200 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
    rose: 'border-rose-500/30 bg-rose-500/15 text-rose-200 shadow-[0_0_10px_rgba(244,63,94,0.2)]',
    amber: 'border-amber-500/30 bg-amber-500/15 text-amber-200 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
    yellow: 'border-yellow-500/30 bg-yellow-500/15 text-yellow-200 shadow-[0_0_10px_rgba(234,179,8,0.2)]',
    pink: 'border-pink-500/30 bg-pink-500/15 text-pink-200 shadow-[0_0_10px_rgba(236,72,153,0.2)]',
    cyan: 'border-cyan-500/30 bg-cyan-500/15 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]',
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tones[tone] || tones.violet}`}>
      {label}
    </span>
  )
}
