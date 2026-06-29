'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight, CalendarDays, Clock3, ExternalLink, Gamepad2, Sparkles, Users, MapPin, BookOpen } from 'lucide-react'
import type { BlogCategory, BlogPostRecord } from '@/lib/types'

function categoryMeta(slug: string) {
  switch (slug.toLowerCase()) {
    case 'trailers':
      return { chip: 'border-fuchsia-400/30 bg-fuchsia-500/10 text-fuchsia-100', icon: Sparkles }
    case 'gameplay':
      return { chip: 'border-amber-400/30 bg-amber-500/10 text-amber-100', icon: Gamepad2 }
    case 'characters':
      return { chip: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-100', icon: Users }
    case 'locations':
      return { chip: 'border-sky-400/30 bg-sky-500/10 text-sky-100', icon: MapPin }
    case 'resources':
      return { chip: 'border-violet-400/30 bg-violet-500/10 text-violet-100', icon: BookOpen }
    default:
      return { chip: 'border-white/15 bg-white/5 text-slate-200', icon: Sparkles }
  }
}

export function ClientHome({
  initialPosts,
  initialCategories,
}: Readonly<{
  initialPosts: BlogPostRecord[]
  initialCategories: BlogCategory[]
}>) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get('category')?.trim() || 'all'

  const visiblePosts = initialPosts.filter((post) => {
    if (activeCategory === 'all') return true
    return (
      post.categorySlug?.toLowerCase() === activeCategory.toLowerCase() ||
      post.categoryName?.toLowerCase() === activeCategory.toLowerCase()
    )
  })

  const selectedLabel =
    activeCategory === 'all'
      ? 'All News'
      : initialCategories.find((item) => item.slug === activeCategory)?.name ?? activeCategory

  return (
    <div className="relative mx-auto flex w-full max-w-[1440px] flex-col px-4 pb-12 pt-4 sm:px-6 lg:px-8">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,rgba(10,8,24,0.96),rgba(10,12,38,0.98))] px-5 py-8 shadow-[0_24px_90px_rgba(0,0,0,0.22)] sm:px-8 sm:py-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,0,153,0.14),transparent_30%),radial-gradient(circle_at_center,rgba(123,92,255,0.22),transparent_56%)]" />
        <div className="relative flex items-center justify-between gap-3">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="rounded-full border border-white/15 bg-white/[0.04] px-2 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/90">
              G
            </span>
            <span className="font-display text-sm font-black tracking-[0.22em] text-white sm:text-base">
              GTA
              <span className="bg-gradient-to-b from-[#8d7cff] via-[#ff2ea6] to-[#ff8b5e] bg-clip-text text-transparent">
                FANS
              </span>
            </span>
          </Link>

          <div className="rounded-full border border-fuchsia-400/35 bg-[linear-gradient(90deg,rgba(61,13,68,0.9),rgba(17,47,71,0.9))] px-4 py-2 text-[10px] font-black uppercase tracking-[0.16em] text-rose-100 sm:text-[11px]">
            GTA VI • Nov 19 2026 • 146 days
          </div>
        </div>

        <div className="relative mx-auto mt-8 flex max-w-[1100px] flex-col items-center text-center sm:mt-10">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            GTAFANS
          </p>
          <h1 className="mt-5 text-[clamp(3.25rem,10vw,7.5rem)] font-black tracking-[-0.08em] text-white">
            <span className="bg-gradient-to-r from-[#7f71ff] via-[#ff2ea6] to-[#ff7f61] bg-clip-text text-transparent">
              GTA 6
            </span>{' '}
            NEWS
          </h1>
          <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-300 sm:text-xl sm:leading-9">
            GTA 6 trailer breakdowns, gameplay analysis, character deep-dives, location guides, resources, community insights, and everything Vice City.
          </p>

          <div className="mt-8 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.24em] text-slate-300">
            <span>100%</span>
          </div>
          <div className="mt-4 h-1.5 w-[360px] max-w-full rounded-full bg-[linear-gradient(90deg,#ff2ea6,#8c6bff,#39d3ff)]" />
        </div>
      </section>

      <div className="mt-7 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        <FilterChip active={activeCategory === 'all'} onClick={() => router.push('/', { scroll: false })}>
          All News
        </FilterChip>
        {initialCategories.map((category) => {
          const slug = category.slug.toLowerCase()
          return (
            <FilterChip
              key={category.id}
              active={activeCategory.toLowerCase() === slug}
              onClick={() => router.push(`/?category=${encodeURIComponent(category.slug)}`, { scroll: false })}
            >
              {category.name}
            </FilterChip>
          )
        })}
      </div>

      <div className="mx-auto mt-8 flex w-full max-w-[620px] flex-col items-center px-4 text-center sm:px-6">
        <div className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.32em] text-fuchsia-200">
          <Sparkles className="h-4 w-4" />
          {visiblePosts.length} articles live
        </div>
        <div className="mt-5 h-1.5 w-[380px] max-w-full rounded-full bg-[linear-gradient(90deg,#ffd45d,#ff2ea6,#8a6bff,#4f8aff)]" />
      </div>

      <section className="mt-7">
        <div className="flex items-center gap-4 px-1 sm:px-2">
          <div className="h-14 w-1 rounded-full bg-cyan-400 sm:h-16" />
          <h2 className="text-2xl font-black tracking-[-0.05em] text-white sm:text-4xl">
            {selectedLabel}
          </h2>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visiblePosts.map((post) => {
            const meta = categoryMeta(post.categorySlug ?? post.categoryName ?? '')
            const Icon = meta.icon

            return (
              <article
                key={post.id}
                className="group overflow-hidden rounded-[1.8rem] border border-white/10 bg-[linear-gradient(180deg,rgba(14,10,31,0.96),rgba(10,9,26,0.96))] shadow-[0_22px_70px_rgba(0,0,0,0.26)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative">
                  <div className="absolute left-4 top-4 z-10 flex gap-2">
                    <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] ${meta.chip}`}>
                      {post.categoryName}
                    </span>
                    {post.featured ? (
                      <span className="rounded-full border border-rose-400/30 bg-rose-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-rose-100">
                        Featured
                      </span>
                    ) : null}
                  </div>
                  <div className="absolute right-4 top-4 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-[#182035]/90 text-[#ffb03c] shadow-[0_16px_32px_rgba(0,0,0,0.35)] sm:h-14 sm:w-14">
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <img
                    src={post.heroImage}
                    alt={post.heroImageAlt}
                    className="h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:h-[238px]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(8,7,20,0.88))]" />
                </div>

                <div className="p-5 sm:p-6">
                  <div className="flex flex-wrap items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">
                    <span className="inline-flex items-center gap-1">
                      <CalendarDays className="h-3.5 w-3.5 text-fuchsia-300" />
                      {new Date(post.publishedAt).toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    <span>•</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5 text-sky-300" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`} className="mt-3 block">
                    <h3 className="text-[1.45rem] font-black leading-tight text-white transition group-hover:text-fuchsia-100">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-400">
                    {post.excerpt}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                      By {post.author}
                    </span>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-200 transition hover:text-white"
                    >
                      Read more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </section>

      <footer className="mt-16 border-t border-white/10 pt-10">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
          <div className="space-y-5">
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
              {['All News', ...initialCategories.map((cat) => cat.name)].map((label) => (
                <button
                  key={label}
                  onClick={() =>
                    router.push(label === 'All News' ? '/' : `/?category=${encodeURIComponent(label)}`, { scroll: false })
                  }
                  className="text-left transition hover:text-white"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-white">Legal</p>
            <div className="mt-5 flex flex-col gap-4 text-slate-400">
              {[
                ['Privacy Policy', '/privacy-policy'],
                ['Terms of Service', '/terms-conditions'],
                ['Disclaimer', '/disclaimer'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="transition hover:text-white">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-7 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} GtaFans. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            Made with <span className="text-fuchsia-400">♥</span> for GTA fans worldwide
          </p>
        </div>
      </footer>
    </div>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: Readonly<{
  active?: boolean
  onClick: () => void
  children: React.ReactNode
}>) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-5 py-3 text-sm font-semibold transition ${
        active
          ? 'border-white/60 bg-white/10 text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)]'
          : 'border-white/12 bg-transparent text-slate-400 hover:border-white/30 hover:text-white'
      }`}
    >
      {children}
    </button>
  )
}

function FooterButton({ label, href }: Readonly<{ label: string; href: string }>) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-lg font-bold text-white transition hover:border-fuchsia-400/25 hover:bg-white/[0.05]"
    >
      <span>{label}</span>
      <ExternalLink className="h-5 w-5 text-slate-300" />
    </a>
  )
}
