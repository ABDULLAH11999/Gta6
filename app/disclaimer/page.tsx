import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function DisclaimerPage() {
  return (
    <SiteShell
      title="Disclaimer"
      subtitle="Important notes about the scope, accuracy, and fan-made nature of GtaFans."
    >
      <article className="mx-auto max-w-4xl py-2">
        <GlassPanel className="sm:p-8">
          <SectionHeading eyebrow="Disclosure" title="Fan site disclaimer" />
          <p className="mt-4 text-sm leading-8 text-slate-300 sm:text-base">
            GtaFans is an independent fan project. It is not affiliated with Rockstar Games or Take-Two Interactive. Brand names, game names, and referenced media belong to their respective owners.
          </p>
        </GlassPanel>
      </article>
    </SiteShell>
  )
}
