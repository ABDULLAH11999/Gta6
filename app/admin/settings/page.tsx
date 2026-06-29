import { GlassPanel } from '@/components/ui/glass'
import { SettingsManager } from '@/components/admin/settings-manager'
import { getStoredSettings, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSettingsPage() {
  await refreshDatabaseSnapshot()
  const settings = getStoredSettings()

  return (
    <div className="space-y-6">
      <GlassPanel className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Settings</p>
        <h3 className="text-2xl font-black text-white">Site-wide branding and SEO settings</h3>
        <p className="text-sm leading-7 text-slate-400">
          Control the launch countdown, metadata defaults, footer links, and mail configuration from this screen.
        </p>
      </GlassPanel>

      <SettingsManager settings={settings} />
    </div>
  )
}
