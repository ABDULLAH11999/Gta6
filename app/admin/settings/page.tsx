import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { SettingsManager } from '@/components/admin/settings-manager'
import { getStoredSettings, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminSettingsPage() {
  await refreshDatabaseSnapshot()
  const settings = getStoredSettings()

  return (
    <div className="space-y-6">
      <GlassPanel className="border-amber-500/20 bg-gradient-to-r from-amber-950/20 via-purple-950/10 to-transparent">
        <SectionHeading
          eyebrow="Configuration & SEO"
          title="Site-Wide Branding & Launch Settings"
          detail="Control the launch countdown target, brand taglines, canonical URL, mail delivery, and SEO keywords."
        />
      </GlassPanel>

      <SettingsManager settings={settings} />
    </div>
  )
}
