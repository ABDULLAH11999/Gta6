import { ShieldCheck, Cookie, Eye, MailQuestion } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function PrivacyPolicyPage() {
  const sections = [
    {
      icon: Eye,
      title: 'What we collect',
      text: 'We may store basic contact details, analytics data, visitor activity, and content you submit through forms so the site can operate and improve.',
    },
    {
      icon: Cookie,
      title: 'Cookies and preferences',
      text: 'Cookies may be used to remember your chosen theme, keep admin sessions secure, and help us understand which content is resonating.',
    },
    {
      icon: ShieldCheck,
      title: 'How we use data',
      text: 'Data is used to run the site, manage moderation, support the admin dashboard, and keep posts, categories, and settings in sync.',
    },
    {
      icon: MailQuestion,
      title: 'Contact and removal requests',
      text: 'If you want something updated or removed, reach out through the contact page and we will review it as quickly as possible.',
    },
  ]

  return (
    <SiteShell
      title="Privacy Policy"
      subtitle="Clear, plain-language information about the data practices used to run GtaFans and its admin dashboard."
    >
      <GlassPanel className="space-y-6">
        <SectionHeading eyebrow="Data Use" title="How GtaFans handles information" />
        <div className="grid gap-3 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="rounded-3xl border border-white/8 bg-white/[0.03] p-4">
              <section.icon className="h-5 w-5 text-fuchsia-200" />
              <p className="mt-3 text-sm font-bold text-white">{section.title}</p>
              <p className="mt-2 text-sm leading-7 text-slate-400">{section.text}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </SiteShell>
  )
}
