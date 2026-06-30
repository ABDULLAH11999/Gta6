import { SiteShell } from '@/components/site-shell'

export default function TermsConditionsPage() {
  return (
    <SiteShell
      title="Terms & Conditions"
      subtitle="The rules for using the site, submitting content, and keeping the community experience clean and useful."
    >
      <article className="mx-auto max-w-4xl space-y-6 py-2">
        <section className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-400">Use of Service</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Community participation rules
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            Posts, summaries, and recommendations are fan-created editorial content and should not be treated as official Rockstar statements.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Community safety</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              We may remove spam, harassment, or abusive content that interferes with the quality or safety of the site.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Usage rights and changes</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              By submitting content, you allow GtaFans to display it across the site and in related editorial summaries.
            </p>
          </div>
        </section>
      </article>
    </SiteShell>
  )
}
