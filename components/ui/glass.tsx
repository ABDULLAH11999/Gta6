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
      className={`rounded-[1.8rem] border border-white/10 bg-[#131313] p-5 text-white shadow-[0_20px_50px_rgba(0,0,0,0.28)] transition-all duration-300 sm:p-6 ${className}`}
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
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">{eyebrow}</p>
      <h2 className="font-display text-2xl font-black tracking-tight text-white sm:text-3xl">{title}</h2>
      {detail ? <p className="max-w-2xl text-sm leading-7 text-zinc-400">{detail}</p> : null}
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
    violet: 'border-white/10 bg-white/5 text-white',
    blue: 'border-white/10 bg-white/5 text-white',
    emerald: 'border-white/10 bg-white/5 text-white',
    rose: 'border-white/10 bg-white/5 text-white',
    amber: 'border-white/10 bg-white/5 text-white',
    yellow: 'border-white/10 bg-white/5 text-white',
  }

  return (
    <span className={`badge-light-text inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${tones[tone]}`}>
      {label}
    </span>
  )
}
