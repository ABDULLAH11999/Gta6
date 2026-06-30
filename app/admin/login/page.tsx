import Link from 'next/link'
import { Shield } from 'lucide-react'
import { AdminLoginForm } from '@/components/admin/admin-login-form'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'

export default function AdminLoginPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-[520px] flex-col justify-center px-4 py-10 sm:px-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#111111]">
            <Shield className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="font-display text-lg font-black tracking-tight text-white">GtaFans</p>
            <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Admin login</p>
          </div>
        </div>

        <GlassPanel className="bg-[#111111]">
          <SectionHeading
            eyebrow="Protected Access"
            title="Admin sign in"
            detail="Use your admin username or email and the admin password for this site."
          />
          <AdminLoginForm />
          <div className="mt-5 text-center text-[11px] text-zinc-400">
            <Link href="/" className="font-semibold text-white hover:underline">
              Return to public site
            </Link>
          </div>
        </GlassPanel>
      </div>
    </main>
  )
}
