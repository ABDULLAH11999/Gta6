import { TriangleAlert } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function DisclaimerPage() {
  return (
    <SiteShell
      title="Disclaimer"
      subtitle="Important notes about the scope, accuracy, and fan-made nature of GtaFans."
    >
      <GlassPanel className="space-y-6">
        <SectionHeading eyebrow="Disclosure" title="Fan site disclaimer" />
        <div className="rounded-3xl border border-amber-400/20 bg-amber-500/8 p-5">
          <TriangleAlert className="h-5 w-5 text-amber-200" />
          <p className="mt-3 text-sm leading-7 text-slate-300">
            GtaFans is an independent fan project. It is not affiliated with Rockstar Games or Take-Two Interactive. Brand names, game names, and referenced media belong to their respective owners.
          </p>
        </div>
      </GlassPanel>
    </SiteShell>
  )
}
