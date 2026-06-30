import { SiteShell } from '@/components/site-shell'

export default function PrivacyPolicyPage() {
  return (
    <SiteShell
      title="Privacy Policy"
      subtitle="Clear, plain-language information about how GtaFans handles information and site activity."
    >
      <article className="mx-auto max-w-4xl space-y-6 py-2">
        <section className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-400">Data Use</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            How GtaFans handles information
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            We may store basic contact details, analytics data, visitor activity, and content you submit through forms so the site can operate and improve.
          </p>
        </section>

        <section className="grid gap-6 md:grid-cols-2">
          <div className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">How we use data</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              Data is used to run the site, manage moderation, support the admin dashboard, and keep posts, categories, and settings in sync.
            </p>
          </div>

          <div className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
            <h3 className="text-lg font-bold text-white">Removal requests</h3>
            <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
              If you want something updated or removed, reach out through the contact page and we will review it as quickly as possible.
            </p>
          </div>
        </section>
      </article>
    </SiteShell>
  )
}
