import { LiveRefresh } from '@/components/admin/live-refresh'
import { VisitorsManager } from '@/components/admin/visitors-manager'
import { getVisitors, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminVisitorsPage() {
  await refreshDatabaseSnapshot()
  const visitors = getVisitors()

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={8000} />
      <VisitorsManager initialVisitors={visitors} />
    </div>
  )
}
