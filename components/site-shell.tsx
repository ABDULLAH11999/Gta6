import Link from 'next/link'
import { CountdownPill } from '@/components/countdown-pill'
import { getStoredSettings } from '@/lib/db'
import { getCategoryFilters } from '@/lib/site-data'

function BrandWordmark() {
  return (
    <div className="inline-flex items-center gap-2">
      <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
        G
      </span>
      <span className="font-display text-[16px] font-black tracking-[0.14em] text-white sm:text-[18px]">
        GTA
        <span className="bg-gradient-to-b from-[#8d7cff] via-[#ff2ea6] to-[#ff8b5e] bg-clip-text text-transparent">
          FANS
        </span>
      </span>
    </div>
  )
}

export async function SiteShell({
  children,
  title,
  subtitle,
}: Readonly<{
  children: React.ReactNode
  title?: React.ReactNode
  subtitle?: string
}>) {
  const settings = getStoredSettings()
  const footerLinks = settings.footerLinks ?? []
  const footerCategories = getCategoryFilters(settings.games)

  return (
    <main className="relative min-h-screen overflow-x-hidden text-white selection:bg-fuchsia-500/30">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-10rem] h-[40rem] w-[76rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(160,74,255,0.2)_0%,rgba(39,49,125,0.12)_36%,transparent_72%)] blur-3xl" />
        <div className="absolute left-[-8rem] top-36 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute right-[-10rem] top-48 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-[-12rem] left-1/2 h-[32rem] w-[72rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(74,131,255,0.16)_0%,transparent_65%)] blur-3xl" />
      </div>

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-12 pt-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-3 py-1">
          <Link href="/" className="inline-flex items-center gap-2">
            <BrandWordmark />
          </Link>
          <CountdownPill launchDate={settings.launchDate} />
        </div>

        {title ? (
          <section className="relative mt-4 overflow-hidden rounded-[2rem] border border-sky-950/80 bg-[linear-gradient(180deg,rgba(10,8,24,0.96),rgba(10,12,38,0.98))] px-5 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,153,0.14),transparent_30%),radial-gradient(circle_at_center,rgba(123,92,255,0.22),transparent_56%)]" />
            <div className="relative mx-auto flex max-w-[1020px] flex-col items-center text-center">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
                {settings.brandMark ?? 'GTAFANS'}
              </p>
              <h1 className="mt-5 max-w-5xl text-[clamp(3rem,8vw,6rem)] font-black tracking-[-0.08em] text-white">
                {title}
              </h1>
              {subtitle ? (
                <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-xl sm:leading-8">
                  {subtitle}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        <section className="relative min-h-[420px]">{children}</section>

        <footer className="mt-16 border-t border-sky-950/70 pt-10">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
            <div className="space-y-5">
              <BrandWordmark />
              <p className="max-w-xl text-sm leading-7 text-slate-400">
                Your ultimate source for the latest GTA 6 news, updates, and insights about Vice City&apos;s return.
              </p>
              <p className="max-w-xl text-sm leading-7 text-slate-500">
                This site is not affiliated with Rockstar Games or Take-Two Interactive. All trademarks and copyrighted materials belong to their respective owners.
              </p>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Wishlist Now</p>
              <div className="mt-5 space-y-3">
                <FooterButton label="PlayStation 5" href="https://www.playstation.com/en-au/games/grand-theft-auto-vi/" />
                <FooterButton label="Xbox Series X|S" href="https://www.xbox.com/en-US/games/store/grand-theft-auto-vi/9nl3wwnzlzzn" />
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Categories</p>
              <div className="mt-5 flex flex-col gap-4 text-slate-400">
                {footerCategories.map((label) => (
                  <Link
                    key={label}
                    href={label === 'All News' ? '/' : `/?category=${encodeURIComponent(label)}`}
                    className="transition hover:text-white"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Legal</p>
              <div className="mt-5 flex flex-col gap-4 text-slate-400">
                {footerLinks.map((link) => (
                  <Link key={link.href} href={link.href} className="transition hover:text-white">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-sky-950/70 pt-7 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
            <p>(c) {new Date().getFullYear()} GtaFans. All rights reserved.</p>
            <p className="inline-flex items-center gap-2">
              Made with <span className="text-fuchsia-400">love</span> for GTA fans worldwide
            </p>
          </div>
        </footer>
      </div>
    </main>
  )
}

function FooterButton({ label, href }: Readonly<{ label: string; href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-sky-950/70 bg-white/[0.03] px-5 py-4 text-lg font-bold text-white transition hover:border-sky-700/40 hover:bg-white/[0.05]"
    >
      <span>{label}</span>
      <span className="text-slate-300">-&gt;</span>
    </a>
  )
}
