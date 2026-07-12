import { SiteShell } from '@/components/site-shell'
import { GlassInset, GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function AboutPage() {
  return (
    <SiteShell
      title="About GtaFans"
      subtitle="A GTA 6 fan site built for fast reading, strong SEO, and a clean editorial layout."
    >
      <article className="mx-auto max-w-4xl space-y-6 py-2">
        <GlassPanel className="sm:p-8">
          <SectionHeading eyebrow="Mission" title="Build a focused GTA 6 news hub" />
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            GtaFans is designed as a polished editorial home for trailer breakdowns, character deep-dives, location tracking, and launch countdown updates.
          </p>
        </GlassPanel>

        <section className="grid gap-6 md:grid-cols-2">
          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-400">Reading Experience</p>
            <h3 className="mt-3 text-lg font-bold text-white">Clear hierarchy, less noise</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              Every post is organized for readers who want fast answers, clean structure, and search-friendly context around GTA 6 news.
            </p>
          </GlassInset>

          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-400">Flexible Content</p>
            <h3 className="mt-3 text-lg font-bold text-white">Built to scale cleanly</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              Posts can support images, video embeds, quotes, lists, and SEO metadata so the site can grow without layout changes.
            </p>
          </GlassInset>
        </section>
      </article>
    </SiteShell>
  )
}
