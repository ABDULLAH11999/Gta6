import { GamesEditor } from '@/components/admin/games-editor'
import { GameSlotManager } from '@/components/admin/game-slot-manager'
import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { getStoredSettings, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminGamesPage() {
  await refreshDatabaseSnapshot()
  const settings = getStoredSettings()

  return (
    <div className="space-y-6">
      <GlassPanel className="border-fuchsia-500/20 bg-gradient-to-r from-fuchsia-950/20 via-purple-950/10 to-transparent">
        <SectionHeading
          eyebrow="Coverage Areas"
          title="Game Tags & Issue Report Publishing"
          detail="Manage topic classifications, and publish live breakdown alerts with SEO-ready titles and keywords."
        />
      </GlassPanel>

      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel className="border-cyan-500/20">
          <h3 className="mb-4 border-b border-white/10 pb-3 font-display text-lg font-bold text-cyan-300">Topic & Game Tags</h3>
          <GamesEditor initialTags={settings.games} />
        </GlassPanel>

        <GlassPanel className="border-purple-500/20">
          <h3 className="mb-4 border-b border-white/10 pb-3 font-display text-lg font-bold text-purple-300">Live Report Publisher</h3>
          <GameSlotManager availableGames={settings.games} />
        </GlassPanel>
      </div>
    </div>
  )
}
