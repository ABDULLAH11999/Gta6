import { SiteShell } from '@/components/site-shell'
import { GlassInset, GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function TermsConditionsPage() {
  return (
    <SiteShell
      title="Terms & Conditions"
      subtitle="The rules for using the site, submitting content, and keeping the community experience clean and useful."
    >
      <article className="mx-auto max-w-4xl space-y-6 py-2">
        <GlassPanel className="sm:p-8">
          <SectionHeading eyebrow="Use of Service" title="Community participation rules" />
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            Posts, summaries, and recommendations are fan-created editorial content and should not be treated as official Rockstar statements.
          </p>
        </GlassPanel>

        <section className="grid gap-6 md:grid-cols-2">
          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Community safety</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              We may remove spam, harassment, or abusive content that interferes with the quality or safety of the site.
            </p>
          </GlassInset>

          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Usage rights and changes</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              By submitting content, you allow GtaFans to display it across the site and in related editorial summaries.
            </p>
          </GlassInset>
        </section>
      </article>
    </SiteShell>
  )
}
