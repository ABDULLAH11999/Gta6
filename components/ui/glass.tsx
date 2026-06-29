import type { ReactNode } from 'react'

export function GlassPanel({
  children,
  className = '',
}: Readonly<{
  children: ReactNode
  className?: string
}>) {
  return (
    <section
      className={`rounded-[1.8rem] border border-sky-950/80 bg-[rgba(10,8,20,0.82)] p-5 text-white shadow-[0_22px_60px_rgba(0,0,0,0.32)] transition-all duration-300 hover:border-sky-700/40 sm:p-6 ${className}`}
    >
      {children}
    </section>
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
      <p className="text-[10px] uppercase font-black tracking-[0.28em] text-fuchsia-200">{eyebrow}</p>
      <h2 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      {detail ? <p className="max-w-2xl text-sm leading-7 text-slate-400">{detail}</p> : null}
    </div>
  )
}

export function StatusBadge({
  label,
  tone = 'violet',
}: Readonly<{
  label: string
  tone?: 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'yellow'
}>) {
  const tones = {
    violet:
      'border-violet-400/30 bg-violet-500/12 text-violet-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
    blue:
      'border-sky-400/30 bg-sky-500/12 text-sky-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
    emerald:
      'border-emerald-400/30 bg-emerald-500/12 text-emerald-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
    rose:
      'border-rose-400/30 bg-rose-500/12 text-rose-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
    amber:
      'border-amber-400/30 bg-amber-500/12 text-amber-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
    yellow:
      'border-yellow-400/30 bg-yellow-500/12 text-yellow-100 shadow-[0_0_0_1px_rgba(0,0,0,0.08)]',
  }

  return (
    <span className={`badge-light-text inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${tones[tone]}`}>
      {label}
    </span>
  )
}
