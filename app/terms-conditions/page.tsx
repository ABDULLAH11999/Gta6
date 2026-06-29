import { FileText, ShieldAlert, Sparkles, SquarePen } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function TermsConditionsPage() {
  const terms = [
    {
      icon: Sparkles,
      title: 'Editorial content',
      text: 'Posts, summaries, and recommendations are fan-created editorial content and should not be treated as official Rockstar statements.',
    },
    {
      icon: ShieldAlert,
      title: 'Community safety',
      text: 'We may remove spam, harassment, or abusive content that interferes with the quality or safety of the site.',
    },
    {
      icon: FileText,
      title: 'Usage rights',
      text: 'By submitting content, you allow GtaFans to display it across the site and in related editorial summaries.',
    },
    {
      icon: SquarePen,
      title: 'Changes',
      text: 'These terms can be updated as the project grows, and the latest version will always live on this page.',
    },
  ]

  return (
    <SiteShell
      title="Terms & Conditions"
      subtitle="The rules for using the site, submitting content, and keeping the community experience clean and useful."
    >
      <GlassPanel className="space-y-6">
        <SectionHeading eyebrow="Use of Service" title="Community participation rules" />
        <div className="grid gap-3 md:grid-cols-2">
          {terms.map((term) => (
            <div key={term.title} className="rounded-3xl border border-sky-950/70 bg-sky-950/12 p-4">
              <term.icon className="h-5 w-5 text-fuchsia-200" />
              <p className="mt-3 text-sm font-bold text-white">{term.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{term.text}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </SiteShell>
  )
}
