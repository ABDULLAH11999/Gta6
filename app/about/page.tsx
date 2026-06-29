import { SiteShell } from '@/components/site-shell'

export default function AboutPage() {
  return (
    <SiteShell
      title="About GtaFans"
      subtitle="A GTA 6 fan site built for fast reading, strong SEO, and a clean editorial layout."
    >
      <article className="mx-auto max-w-4xl space-y-10 py-2">
        <section className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            Mission
          </p>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Build a focused GTA 6 news hub
          </h2>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            GtaFans is designed as a polished editorial home for trailer breakdowns, character deep-dives, location tracking, and launch countdown updates.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">What the site is built for</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Every post is organized for readers who want fast answers, clean structure, and search-friendly context around GTA 6 news. The interface stays readable on desktop and mobile without the extra chrome that makes pages feel busy.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">How it stays flexible</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Posts can support images, video embeds, quotes, lists, and SEO metadata so the site can scale without layout changes. Categories and launch date settings can be managed from the dashboard without touching code.
          </p>
        </section>
      </article>
    </SiteShell>
  )
}
