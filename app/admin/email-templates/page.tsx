import { Mail, Sparkles } from 'lucide-react'
import { GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'

function EmailPreview({
  title,
  description,
  tone = 'pink',
}: Readonly<{
  title: string
  description: string
  tone?: 'pink' | 'cyan' | 'violet'
}>) {
  const accentText = {
    pink: 'text-pink-400',
    cyan: 'text-cyan-400',
    violet: 'text-purple-400',
  }[tone]

  const btnGrad = {
    pink: 'from-pink-500/30 to-purple-500/30 hover:from-pink-500/40 hover:to-purple-500/40 border-pink-500/40',
    cyan: 'from-cyan-500/30 to-blue-500/30 hover:from-cyan-500/40 hover:to-blue-500/40 border-cyan-500/40',
    violet: 'from-purple-500/30 to-indigo-500/30 hover:from-purple-500/40 hover:to-indigo-500/40 border-purple-500/40',
  }[tone]

  return (
    <div className="mt-3 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="rounded-xl border border-white/10 bg-[#140d28]/80 p-5 shadow-lg">
        <div className="flex items-center gap-1.5">
          <Sparkles className={`h-3.5 w-3.5 ${accentText}`} />
          <p className={`text-[10px] font-black uppercase tracking-wider ${accentText}`}>GTAFANS MAIL</p>
        </div>
        <h3 className="mt-2.5 font-display text-base font-bold text-white leading-snug">{title}</h3>
        <p className="mt-3 text-xs leading-relaxed text-zinc-300">{description}</p>
        <div className={`mt-5 rounded-xl border bg-gradient-to-r ${btnGrad} py-2.5 text-center text-xs font-bold text-white transition-all`}>
          Open GtaFans Portal
        </div>
      </div>
    </div>
  )
}

export default function AdminEmailTemplatesPage() {
  return (
    <div className="space-y-6">
      <GlassPanel className="border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/20 via-purple-950/10 to-transparent">
        <SectionHeading
          eyebrow="Transactional Mail Engine"
          title="Responsive Email Template Previews"
          detail="Live preview of automated notifications, user account verification, and contact follow-up emails."
        />
      </GlassPanel>

      <GlassPanel className="border-white/10">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <StatusBadge label="Welcome Onboarding" tone="cyan" />
            <EmailPreview
              title="Welcome to GtaFans — Your Account is Ready"
              description="Your account is active. Start tracking trailer breakdowns, bookmarking gameplay articles, and discussing GTA 6 updates."
              tone="cyan"
            />
          </div>
          <div>
            <StatusBadge label="Admin Registration Alert" tone="pink" />
            <EmailPreview
              title="New Player Registration Received"
              description="A new account has registered on the platform. Review the profile, permissions, and moderation history in the admin console."
              tone="pink"
            />
          </div>
          <div>
            <StatusBadge label="Contact Response" tone="violet" />
            <EmailPreview
              title="We Received Your Inquiry"
              description="Thank you for reaching out to the GtaFans editorial team. Your inquiry has been received and assigned to support."
              tone="violet"
            />
          </div>
        </div>
      </GlassPanel>
    </div>
  )
}
