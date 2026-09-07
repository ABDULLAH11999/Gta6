import { ImageIcon, Link2, Play, Sparkles, Video } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getPosts, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminMediaPage() {
  await refreshDatabaseSnapshot()
  const posts = getPosts()

  const allImages = Array.from(
    new Set(
      posts.flatMap((p) => [p.heroImage, ...(p.galleryImages || []), ...(p.imageLinks || [])]).filter(Boolean),
    ),
  )

  const allVideos = Array.from(
    new Set(
      posts.flatMap((p) => [p.heroVideoUrl, ...(p.videoLinks || [])]).filter(Boolean),
    ),
  )

  return (
    <div className="space-y-6">
      <GlassPanel className="border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/20 via-purple-950/10 to-transparent">
        <SectionHeading
          eyebrow="Media Library"
          title="Assets, Video Embeds & Content Media"
          detail="All hero graphics, trailer embeds, and gallery photos referenced across GTA 6 articles."
        />
      </GlassPanel>

      <div className="grid gap-4 sm:grid-cols-3">
        <MediaStatCard
          icon={ImageIcon}
          title="Images & Artwork"
          count={allImages.length}
          text="Hero graphics, maps, and character portraits."
          tone="pink"
        />
        <MediaStatCard
          icon={Video}
          title="Video Embeds"
          count={allVideos.length}
          text="Official YouTube trailers and gameplay reveals."
          tone="cyan"
        />
        <MediaStatCard
          icon={Sparkles}
          title="Media Stories"
          count={posts.length}
          text="Articles with dedicated media attachments."
          tone="violet"
        />
      </div>

      {/* Videos Section */}
      <GlassPanel className="border-cyan-500/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Video Embeds</p>
            <h3 className="mt-1 text-xl font-black text-white">Active Video Stream Assets</h3>
          </div>
          <span className="rounded-full border border-cyan-500/30 bg-cyan-500/15 px-3 py-1 text-xs font-bold text-cyan-200">
            {allVideos.length} Embeds
          </span>
        </div>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          {allVideos.map((videoUrl) => (
            <div
              key={videoUrl}
              className="overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-4 transition hover:border-cyan-500/40"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                <iframe
                  src={videoUrl}
                  title="GTA 6 Video Asset"
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              <p className="mt-3 truncate font-mono text-xs text-zinc-400">{videoUrl}</p>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Images Section */}
      <GlassPanel className="border-fuchsia-500/20">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-400">Image Assets</p>
            <h3 className="mt-1 text-xl font-black text-white">Article Hero & Gallery Library</h3>
          </div>
          <span className="rounded-full border border-pink-500/30 bg-pink-500/15 px-3 py-1 text-xs font-bold text-pink-200">
            {allImages.length} Images
          </span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {allImages.map((src) => (
            <div
              key={src}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-3 transition hover:border-pink-500/40"
            >
              <div className="aspect-video w-full overflow-hidden rounded-xl bg-black/50">
                <img
                  src={src}
                  alt="GTA 6 Media"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <p className="mt-2 truncate font-mono text-[11px] text-zinc-400">{src}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  )
}

function MediaStatCard({
  icon: Icon,
  title,
  count,
  text,
  tone = 'pink',
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  title: string
  count: number
  text: string
  tone?: 'pink' | 'cyan' | 'violet'
}>) {
  const tones = {
    pink: 'border-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.15)]',
    cyan: 'border-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.15)]',
    violet: 'border-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.15)]',
  }

  return (
    <GlassPanel className={`space-y-2 border ${tones[tone]}`}>
      <div className="flex items-center justify-between">
        <Icon className="h-5 w-5" />
        <span className="text-2xl font-black text-white">{count}</span>
      </div>
      <p className="font-bold text-white text-sm">{title}</p>
      <p className="text-xs text-zinc-400">{text}</p>
    </GlassPanel>
  )
}
