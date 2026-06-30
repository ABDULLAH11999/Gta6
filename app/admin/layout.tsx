import { getCurrentAdmin } from '@/lib/admin-auth'
import { AdminLayoutShell } from '@/components/admin/admin-layout-shell'

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const admin = getCurrentAdmin()

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-white/20">
      <AdminLayoutShell authenticated={Boolean(admin)} username={admin?.username ?? undefined}>
        {children}
      </AdminLayoutShell>
    </main>
  )
}
