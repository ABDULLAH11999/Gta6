import Link from 'next/link'
import { BarChart3, ChevronRight, Layers3, Newspaper, Sparkles, Tag, Users, Waypoints } from 'lucide-react'
import { GlassInset, GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getCategories, getPosts, getStoredSettings, getVisitors, getUsers, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  await refreshDatabaseSnapshot()

  const posts = getPosts()
  const categories = getCategories()
  const settings = getStoredSettings()
  const visitors = getVisitors()
  const users = getUsers()
  const publishedPosts = posts.filter((post) => post.status === 'published')
  const featuredPosts = posts.filter((post) => post.featured)

  const stats = [
    {
      label: 'Blog Posts',
      value: posts.length,
      icon: Newspaper,
      tone: 'pink',
      border: 'border-pink-500/30 hover:border-pink-500/50',
      iconBg: 'bg-pink-500/15 text-pink-400 border border-pink-500/30',
      glow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]',
      sub: `${publishedPosts.length} published`,
    },
    {
      label: 'Categories',
      value: categories.length,
      icon: Tag,
      tone: 'cyan',
      border: 'border-cyan-500/30 hover:border-cyan-500/50',
      iconBg: 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/30',
      glow: 'shadow-[0_0_20px_rgba(6,182,212,0.15)]',
      sub: 'Filter taxonomy',
    },
    {
      label: 'Featured Stories',
      value: featuredPosts.length,
      icon: Sparkles,
      tone: 'violet',
      border: 'border-purple-500/30 hover:border-purple-500/50',
      iconBg: 'bg-purple-500/15 text-purple-400 border border-purple-500/30',
      glow: 'shadow-[0_0_20px_rgba(168,85,247,0.15)]',
      sub: 'Top hero items',
    },
    {
      label: 'Total Visitors',
      value: visitors.length,
      icon: Waypoints,
      tone: 'emerald',
      border: 'border-emerald-500/30 hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
      glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]',
      sub: 'Dynamic tracker',
    },
    {
      label: 'Registered Users',
      value: users.length,
      icon: Users,
      tone: 'amber',
      border: 'border-amber-500/30 hover:border-amber-500/50',
      iconBg: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.15)]',
      sub: 'Active accounts',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Top Stat Metrics with Neon Highlights */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat) => (
          <GlassPanel
            key={stat.label}
            className={`p-5 transition-all duration-300 ${stat.border} ${stat.glow}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
                {stat.label}
              </span>
              <div className={`flex h-8 w-8 items-center justify-center rounded-xl ${stat.iconBg}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
            <p className="mt-1 text-[11px] font-semibold text-zinc-400">{stat.sub}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="space-y-4 border-fuchsia-500/20 bg-gradient-to-br from-fuchsia-950/20 via-purple-950/10 to-transparent">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-pink-500 animate-pulse" />
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-400">Site Status & SEO Control</p>
          </div>
          <h3 className="text-2xl font-black text-white">Editorial Engine & Countdown System</h3>
          <p className="text-sm leading-relaxed text-zinc-300">{settings.description}</p>
          <div className="grid gap-3 sm:grid-cols-2 pt-2">
            <SummaryCard label="Launch Date" value={settings.launchDate ? new Date(settings.launchDate).toLocaleDateString('en-US', { dateStyle: 'long' }) : 'Not set'} tone="pink" />
            <SummaryCard label="Canonical URL" value={settings.canonicalUrl} tone="cyan" />
            <SummaryCard label="Admin Email" value={settings.contactEmail ?? 'Not set'} tone="violet" />
            <SummaryCard label="Target Keywords" value={`${settings.keywords.length} Active Keywords`} tone="amber" />
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4 border-cyan-500/20 bg-gradient-to-br from-cyan-950/20 via-blue-950/10 to-transparent">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Content Breakdown</p>
            <Link href="/admin/categories" className="text-xs font-bold text-cyan-300 hover:underline">
              Manage
            </Link>
          </div>
          <div className="space-y-2.5">
            {categories.map((category) => {
              const count = posts.filter((post) => post.categoryId === category.id).length
              return (
                <GlassInset key={category.id} className="rounded-2xl border-white/10 hover:border-cyan-500/30 transition-colors">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white text-sm">{category.name}</p>
                      <p className="text-[11px] text-zinc-400">{category.description}</p>
                    </div>
                    <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-black text-cyan-200">
                      {count}
                    </span>
                  </div>
                </GlassInset>
              )
            })}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="space-y-4 border-purple-500/20">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-purple-400">Latest Editorial Stories</p>
            <Link href="/admin/posts" className="text-xs font-bold text-purple-300 hover:underline">
              View All ({posts.length})
            </Link>
          </div>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <GlassInset key={post.id} className="rounded-2xl border-white/10 hover:border-purple-500/30 transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                        {post.categoryName || 'News'}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <StatusBadge label={post.status} tone={post.status === 'published' ? 'emerald' : 'amber'} />
                    </div>
                    <Link href={`/blog/${post.slug}`} target="_blank" className="mt-1 block font-bold text-white hover:text-pink-300 transition-colors">
                      {post.title}
                    </Link>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-zinc-400">{post.excerpt}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-zinc-300">
                    {post.readTime}
                  </span>
                </div>
              </GlassInset>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4 border-amber-500/20">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-amber-400">Quick Navigation & Operations</p>
          <div className="space-y-2.5">
            <ActionLink
              href="/admin/posts"
              title="Blog Posts Manager"
              text="Create, edit, or delete articles with YouTube video embeds and SEO."
              tone="pink"
            />
            <ActionLink
              href="/admin/categories"
              title="Category Taxonomy"
              text="Control the filter chips, navigation tabs, and content categorization."
              tone="cyan"
            />
            <ActionLink
              href="/admin/visitors"
              title="Live Visitor Stream"
              text="Dynamic page traffic, IP resolution, and real-time session tracking."
              tone="emerald"
            />
            <ActionLink
              href="/admin/users"
              title="User Moderation"
              text="Review registered player accounts, toggle roles, and manage permissions."
              tone="amber"
            />
            <ActionLink
              href="/admin/settings"
              title="Site & Launch Settings"
              text="Update launch countdown, SEO meta defaults, brand headers, and mail."
              tone="violet"
            />
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  tone = 'pink',
}: Readonly<{
  label: string
  value: string
  tone?: 'pink' | 'cyan' | 'violet' | 'amber'
}>) {
  const tones = {
    pink: 'border-pink-500/20 bg-pink-950/10 text-pink-300',
    cyan: 'border-cyan-500/20 bg-cyan-950/10 text-cyan-300',
    violet: 'border-purple-500/20 bg-purple-950/10 text-purple-300',
    amber: 'border-amber-500/20 bg-amber-950/10 text-amber-300',
  }

  return (
    <GlassInset className={`rounded-2xl border ${tones[tone] || tones.pink}`}>
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">{label}</p>
      <p className="mt-1.5 truncate text-sm font-semibold text-white">{value}</p>
    </GlassInset>
  )
}

function ActionLink({
  href,
  title,
  text,
  tone = 'pink',
}: Readonly<{
  href: string
  title: string
  text: string
  tone?: 'pink' | 'cyan' | 'emerald' | 'amber' | 'violet'
}>) {
  const borderHovers = {
    pink: 'hover:border-pink-500/40 hover:bg-pink-500/5',
    cyan: 'hover:border-cyan-500/40 hover:bg-cyan-500/5',
    emerald: 'hover:border-emerald-500/40 hover:bg-emerald-500/5',
    amber: 'hover:border-amber-500/40 hover:bg-amber-500/5',
    violet: 'hover:border-purple-500/40 hover:bg-purple-500/5',
  }

  return (
    <Link
      href={href}
      className={`group flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 p-4 transition-all duration-200 ${borderHovers[tone] || borderHovers.pink}`}
    >
      <div>
        <p className="text-sm font-bold text-white group-hover:text-pink-300 transition-colors">{title}</p>
        <p className="mt-1 text-xs leading-relaxed text-zinc-400">{text}</p>
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
    </Link>
  )
}
