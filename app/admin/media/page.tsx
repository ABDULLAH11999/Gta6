import { ImageIcon, Link2, Video } from 'lucide-react'
import { GlassPanel } from '@/components/ui/glass'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <GlassPanel className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Media</p>
        <h3 className="text-2xl font-black text-white">Image and video references</h3>
        <p className="text-sm leading-7 text-slate-400">
          Use the post editor to store hero images, gallery links, and video embeds for each article.
        </p>
      </GlassPanel>

      <div className="grid gap-4 md:grid-cols-3">
        <MediaCard icon={ImageIcon} title="Hero images" text="Remote or local image URLs for the card and detail hero." />
        <MediaCard icon={Video} title="Video embeds" text="YouTube, Vimeo, or trailer URLs stored with each post." />
        <MediaCard icon={Link2} title="Source links" text="Reference URLs that support the editorial content." />
      </div>
    </div>
  )
}

function MediaCard({
  icon: Icon,
  title,
  text,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  title: string
  text: string
}>) {
  return (
    <GlassPanel className="space-y-3">
      <Icon className="h-5 w-5 text-fuchsia-200" />
      <p className="font-bold text-white">{title}</p>
      <p className="text-sm leading-7 text-slate-400">{text}</p>
    </GlassPanel>
  )
}
