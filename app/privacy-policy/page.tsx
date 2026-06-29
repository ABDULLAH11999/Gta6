import { SiteShell } from '@/components/site-shell'

export default function PrivacyPolicyPage() {
  return (
    <SiteShell
      title="Privacy Policy"
      subtitle="Clear, plain-language information about how GtaFans handles information and site activity."
    >
      <article className="mx-auto max-w-4xl space-y-10 py-2">
        <section className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            Data Use
          </p>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            How GtaFans handles information
          </h2>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            We may store basic contact details, analytics data, visitor activity, and content you submit through forms so the site can operate and improve. Cookies may be used to remember your chosen theme, keep admin sessions secure, and help us understand which content is resonating.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">How we use data</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Data is used to run the site, manage moderation, support the admin dashboard, and keep posts, categories, and settings in sync. We use that information to make the experience faster, cleaner, and easier to manage.
          </p>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8">
          <h3 className="text-lg font-bold text-white">Removal requests</h3>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            If you want something updated or removed, reach out through the contact page and we will review it as quickly as possible.
          </p>
        </section>
      </article>
    </SiteShell>
  )
}
