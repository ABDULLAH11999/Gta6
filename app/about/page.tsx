import { Award, Layers3, Sparkles, Zap } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'

export default function AboutPage() {
  const pillars = [
    {
      icon: Sparkles,
      title: 'Editorial focus',
      text: 'Every post is organized for readers who want fast answers, clean structure, and search-friendly context around GTA 6 news.',
    },
    {
      icon: Layers3,
      title: 'Flexible content model',
      text: 'Posts support images, video embeds, quote blocks, lists, and SEO metadata so the site can scale without layout changes.',
    },
    {
      icon: Zap,
      title: 'Fan-first design',
      text: 'The interface borrows the neon energy of the reference site while keeping the content readable on desktop and mobile.',
    },
    {
      icon: Award,
      title: 'Admin-ready',
      text: 'Categories, launch date settings, and blog posts can all be managed from the dashboard without touching code.',
    },
  ]

  return (
    <SiteShell
      title="About GtaFans"
      subtitle="A GTA 6 fan site built for fast reading, strong SEO, and an admin workflow that makes adding new posts and categories straightforward."
    >
      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <GlassPanel className="space-y-6">
          <SectionHeading
            eyebrow="Mission"
            title="Build the best fan-run GTA 6 news hub"
            detail="GtaFans is designed as a polished editorial home for trailer breakdowns, character deep-dives, location tracking, and launch countdown updates."
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {pillars.map((item) => (
              <div key={item.title} className="rounded-3xl border border-sky-950/70 bg-sky-950/12 p-4">
                <item.icon className="h-5 w-5 text-fuchsia-200" />
                <p className="mt-3 text-sm font-bold text-white">{item.title}</p>
                <p className="mt-2 text-sm leading-7 text-slate-400">{item.text}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Principles" title="How we want the site to feel" />
          <div className="space-y-3">
            <Principle tone="violet" label="Readable" text="Long-form posts stay easy to scan with generous spacing, section blocks, and strong hierarchy." />
            <Principle tone="blue" label="Searchable" text="SEO fields, canonical URLs, and structured content keep the site ready for Google and social previews." />
            <Principle tone="rose" label="Flexible" text="The admin can keep adding posts, images, and embeds as the GTA 6 news cycle evolves." />
          </div>
        </GlassPanel>
      </div>
    </SiteShell>
  )
}

function Principle({
  tone,
  label,
  text,
}: Readonly<{
  tone: 'violet' | 'blue' | 'rose'
  label: string
  text: string
}>) {
  return (
    <div className="rounded-3xl border border-sky-950/70 bg-sky-950/12 p-4">
      <StatusBadge label={label} tone={tone} />
      <p className="mt-3 text-sm leading-7 text-slate-400">{text}</p>
    </div>
  )
}
