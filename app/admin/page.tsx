import { BarChart3, Layers3, Newspaper, Sparkles, Tag } from 'lucide-react'
import { GlassPanel } from '@/components/ui/glass'
import { getCategories, getPosts, getStoredSettings, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminDashboardPage() {
  await refreshDatabaseSnapshot()

  const posts = getPosts()
  const categories = getCategories()
  const settings = getStoredSettings()
  const publishedPosts = posts.filter((post) => post.status === 'published')
  const featuredPosts = posts.filter((post) => post.featured)

  const stats = [
    { label: 'Posts', value: posts.length, icon: Newspaper },
    { label: 'Published', value: publishedPosts.length, icon: Sparkles },
    { label: 'Categories', value: categories.length, icon: Tag },
    { label: 'Featured', value: featuredPosts.length, icon: BarChart3 },
  ]

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <GlassPanel key={stat.label} className="border-white/10 bg-[#141414] p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-[10px] font-black uppercase tracking-[0.28em]">{stat.label}</span>
              <stat.icon className="h-4.5 w-4.5 text-white" />
            </div>
            <p className="mt-3 text-3xl font-black text-white">{stat.value}</p>
          </GlassPanel>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="space-y-4 border-white/10 bg-[#141414]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Site Snapshot</p>
          <h3 className="text-2xl font-black text-white">Launch countdown and editorial control</h3>
          <p className="text-sm leading-7 text-zinc-400">{settings.description}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryCard label="Launch Date" value={settings.launchDate ?? 'Not set'} />
            <SummaryCard label="Canonical" value={settings.canonicalUrl} />
            <SummaryCard label="Admin email" value={settings.contactEmail ?? 'Not set'} />
            <SummaryCard label="SEO keywords" value={settings.keywords.length.toString()} />
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4 border-white/10 bg-[#141414]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Content Mix</p>
          <div className="space-y-3">
            {categories.map((category) => {
              const count = posts.filter((post) => post.categoryId === category.id).length
              return (
                <div key={category.id} className="rounded-3xl border border-white/10 bg-black p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-white">{category.name}</p>
                      <p className="text-xs text-zinc-400">{category.description}</p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                      {count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </GlassPanel>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="space-y-4 border-white/10 bg-[#141414]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Recent Posts</p>
          <div className="space-y-3">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="rounded-3xl border border-white/10 bg-black p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-zinc-500">
                      {post.categoryName} • {post.status}
                    </p>
                    <p className="mt-1 font-bold text-white">{post.title}</p>
                    <p className="mt-2 line-clamp-2 text-sm leading-7 text-zinc-400">{post.excerpt}</p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                    {post.readTime}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4 border-white/10 bg-[#141414]">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-400">Quick Actions</p>
          <div className="space-y-3">
            <ActionLink href="/admin/posts" title="Blog Posts" text="Create, edit, or delete blog content." />
            <ActionLink href="/admin/categories" title="Categories" text="Control the filter chips and taxonomy." />
            <ActionLink href="/admin/settings" title="Settings" text="Update launch date, brand, and SEO settings." />
            <ActionLink href="/" title="Public Site" text="Preview the GTA 6 fan front page." />
          </div>
        </GlassPanel>
      </div>
    </div>
  )
}

function SummaryCard({ label, value }: Readonly<{ label: string; value: string }>) {
  return (
    <div className="rounded-3xl border border-white/10 bg-black p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-500">{label}</p>
      <p className="mt-2 line-clamp-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function ActionLink({
  href,
  title,
  text,
}: Readonly<{
  href: string
  title: string
  text: string
}>) {
  return (
    <a href={href} className="block rounded-3xl border border-white/10 bg-black p-4 transition hover:border-white/20 hover:bg-white/5">
      <p className="text-sm font-bold text-white">{title}</p>
      <p className="mt-2 text-sm leading-7 text-zinc-400">{text}</p>
    </a>
  )
}
