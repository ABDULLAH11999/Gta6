import { SiteShell } from '@/components/site-shell'

export default function TermsConditionsPage() {
  return (
    <SiteShell
      title="Terms & Conditions"
      subtitle="The rules for using the site, submitting content, and keeping the community experience clean and useful."
    >
      <article className="mx-auto max-w-4xl space-y-10 py-2">
        <section className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            Use of Service
          </p>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Community participation rules
          </h2>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Posts, summaries, and recommendations are fan-created editorial content and should not be treated as official Rockstar statements. By using the site, you agree to keep interactions respectful and useful for other readers.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">Community safety</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            We may remove spam, harassment, or abusive content that interferes with the quality or safety of the site.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">Usage rights and changes</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            By submitting content, you allow GtaFans to display it across the site and in related editorial summaries. These terms can be updated as the project grows, and the latest version will always live on this page.
          </p>
        </section>
      </article>
    </SiteShell>
  )
}
