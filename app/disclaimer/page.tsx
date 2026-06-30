import { SiteShell } from '@/components/site-shell'

export default function DisclaimerPage() {
  return (
    <SiteShell
      title="Disclaimer"
      subtitle="Important notes about the scope, accuracy, and fan-made nature of GtaFans."
    >
      <article className="mx-auto max-w-4xl py-2">
        <section className="rounded-[2rem] bg-white/[0.03] p-6 sm:p-8">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-zinc-400">Disclosure</p>
          <h2 className="mt-3 text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Fan site disclaimer
          </h2>
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            GtaFans is an independent fan project. It is not affiliated with Rockstar Games or Take-Two Interactive. Brand names, game names, and referenced media belong to their respective owners.
          </p>
        </section>
      </article>
    </SiteShell>
  )
}
