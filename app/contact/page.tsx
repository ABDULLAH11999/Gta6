import { Mail, MapPin, MessageCircleMore } from 'lucide-react'
import { ContactForm } from '@/components/contact-form'
import { SiteShell } from '@/components/site-shell'

export default function ContactPage() {
  return (
    <SiteShell
      title="Contact GtaFans"
      subtitle="Use this page for feedback, corrections, partnership questions, or support around the site and admin workflow."
    >
      <div className="mx-auto grid max-w-4xl gap-10 py-2 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="space-y-4">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            Contact Form
          </p>
          <h2 className="text-2xl font-black tracking-[-0.04em] text-white sm:text-3xl">
            Send a message
          </h2>
          <p className="text-sm leading-8 text-slate-300 sm:text-base">
            Send a note if you want to report an issue, suggest a new category, or discuss collaboration.
          </p>
          <div className="pt-2">
            <ContactForm />
          </div>
        </section>

        <section className="space-y-4 border-t border-sky-950/60 pt-8 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-[11px] font-black uppercase tracking-[0.34em] text-fuchsia-200/90">
            Reach Us
          </p>
          <h3 className="text-lg font-bold text-white">Contact details</h3>
          <div className="space-y-4 text-sm leading-7 text-slate-300">
            <InfoLine icon={Mail} label="Email" value="hello@gtafans.online" />
            <InfoLine icon={MapPin} label="Coverage" value="Global GTA 6 fan community" />
            <InfoLine icon={MessageCircleMore} label="Response" value="Support and editorial review" />
          </div>
        </section>
      </div>
    </SiteShell>
  )
}

function InfoLine({
  icon: Icon,
  label,
  value,
}: Readonly<{
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: string
}>) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-sky-300" />
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-slate-500">{label}</p>
        <p className="mt-1 text-white">{value}</p>
      </div>
    </div>
  )
}
