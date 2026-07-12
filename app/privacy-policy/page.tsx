import { SiteShell } from '@/components/site-shell'
import { GlassInset, GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function PrivacyPolicyPage() {
  return (
    <SiteShell
      title="Privacy Policy"
      subtitle="Clear, plain-language information about how GtaFans handles information and site activity."
    >
      <article className="mx-auto max-w-4xl space-y-6 py-2">
        <GlassPanel className="sm:p-8">
          <SectionHeading eyebrow="Data Use" title="How GtaFans handles information" />
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            We may store basic contact details, analytics data, visitor activity, and content you submit through forms so the site can operate and improve.
          </p>
        </GlassPanel>

        <section className="grid gap-6 md:grid-cols-2">
          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">How we use data</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              Data is used to run the site, manage moderation, support the admin dashboard, and keep posts, categories, and settings in sync.
            </p>
          </GlassInset>

          <GlassInset className="rounded-[1.8rem] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Removal requests</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              If you want something updated or removed, reach out through the contact page and we will review it as quickly as possible.
            </p>
          </GlassInset>
        </section>
      </article>
    </SiteShell>
  )
}
