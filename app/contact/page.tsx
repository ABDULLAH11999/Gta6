import { Mail, MapPin, MessageCircleMore } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact GtaFans"
      subtitle="Use this page for feedback, corrections, partnership questions, or support around the site and admin workflow."
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel>
          <SectionHeading eyebrow="Contact Form" title="Send a message" detail="Send a note if you want to report an issue, suggest a new category, or discuss collaboration." />
          <div className="mt-6">
            <ContactForm />
          </div>
        </GlassPanel>

        <div className="space-y-6">
          <GlassPanel>
            <SectionHeading eyebrow="Reach Us" title="Contact details" />
            <div className="mt-6 space-y-3 text-sm text-slate-300">
              <InfoRow icon={Mail} label="Email" value="hello@gtafans.online" />
              <InfoRow icon={MapPin} label="Coverage" value="Global GTA 6 fan community" />
              <InfoRow icon={MessageCircleMore} label="Response" value="Support and editorial review" />
            </div>
          </GlassPanel>
        </div>
      </div>
    </SiteShell>
  )
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}>) {
  return (
    <div className="flex items-center gap-3 rounded-3xl border border-sky-950/70 bg-sky-950/12 p-4">
      <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-fuchsia-500/10 text-fuchsia-100">
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-white">{value}</p>
      </div>
    </div>
  )
}
