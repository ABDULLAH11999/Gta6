import { LiveRefresh } from '@/components/admin/live-refresh'
import { GlassInset, GlassPanel, SectionHeading, StatusBadge } from '@/components/ui/glass'
import { getVisitors, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type VisitorMode = 'all' | 'unique' | 'new' | 'return'

export default async function AdminVisitorsPage({
  searchParams,
}: Readonly<{
  searchParams?: { ip?: string; page?: string; mode?: VisitorMode; date?: string }
}>) {
  const mode = searchParams?.mode || 'all'
  const ip = searchParams?.ip?.trim().toLowerCase() || ''
  const page = searchParams?.page?.trim().toLowerCase() || ''
  const date = searchParams?.date?.trim().toLowerCase() || ''

  await refreshDatabaseSnapshot()

  const visitors = [...getVisitors()].sort((a, b) => {
    const left = new Date(b.timestamp || b.visitedAt).getTime()
    const right = new Date(a.timestamp || a.visitedAt).getTime()
    return left - right
  })

  const filtered = visitors.filter((visitor, index, list) => {
    const matchesMode =
      mode === 'all'
        ? true
        : mode === 'unique'
          ? list.findIndex((item) => item.ip === visitor.ip) === index
          : visitor.type.toLowerCase() === mode
    const matchesIp = !ip || visitor.ip.toLowerCase().includes(ip)
    const matchesPage = !page || visitor.page.toLowerCase().includes(page)
    const matchesDate = !date || `${visitor.visitedAt} ${visitor.timestamp}`.toLowerCase().includes(date)

    return matchesMode && matchesIp && matchesPage && matchesDate
  })

  const uniqueVisitors = new Set(visitors.map((visitor) => visitor.ip)).size
  const returnVisitors = visitors.filter((visitor) => visitor.type === 'Return').length

  const fieldClass =
    'w-full rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-xs font-semibold text-white outline-none transition-all placeholder:text-zinc-500 focus:border-white/20 focus:bg-black/40'

  return (
    <div className="space-y-6">
      <LiveRefresh intervalMs={10000} />

      <GlassPanel>
        <SectionHeading
          eyebrow="Visitor Tracking"
          title="Traffic quality and entry point analysis"
          detail="IP tracking, source analysis, and identifying which pages attract useful traffic."
        />
      </GlassPanel>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total events" value={visitors.length} />
        <MetricCard label="Visible rows" value={filtered.length} />
        <MetricCard label="Unique visitors" value={uniqueVisitors} />
        <MetricCard label="Returning visits" value={returnVisitors} />
      </div>

      <GlassPanel>
        <form className="mb-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5" method="get">
          <input name="ip" defaultValue={ip} placeholder="Filter by IP" className={fieldClass} />
          <input name="page" defaultValue={page} placeholder="Filter by page" className={fieldClass} />
          <input name="date" defaultValue={date} placeholder="Date range" className={fieldClass} />
          <select name="mode" defaultValue={mode} className={fieldClass}>
            <option value="all">All visitors</option>
            <option value="unique">Unique visitors</option>
            <option value="new">New visitors</option>
            <option value="return">Returning visitors</option>
          </select>
          <button className="rounded-xl border border-white/10 bg-white px-5 py-2.5 text-xs font-bold text-black transition hover:bg-zinc-100">
            Apply filters
          </button>
        </form>

        <div className="mb-4 flex items-center justify-between text-xs text-zinc-400">
          <span className="font-semibold">{filtered.length} visitors shown</span>
          <span className="font-semibold">Unique mode deduplicates by IP</span>
        </div>

        <div className="space-y-3 md:hidden">
          {filtered.map((visitor) => (
            <GlassInset key={visitor.id} className="rounded-xl">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-bold text-white">{visitor.ip}</p>
                <StatusBadge label={visitor.type} tone={visitor.type === 'New' ? 'emerald' : 'blue'} />
              </div>
              <p className="mt-2 text-xs text-zinc-400">{visitor.location}</p>
              <p className="mt-2 break-all text-xs font-semibold text-white">{visitor.page}</p>
              <p className="mt-2 text-[10px] text-zinc-500">
                {visitor.referrer} | {visitor.visitedAt}
              </p>
            </GlassInset>
          ))}
        </div>

        <div className="hidden overflow-hidden rounded-xl border border-white/10 md:block">
          <table className="min-w-full divide-y divide-white/10 text-left text-xs font-semibold text-white">
            <thead className="bg-white/[0.04] text-zinc-400">
              <tr>
                <th className="px-4 py-3.5">IP</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Page</th>
                <th className="px-4 py-3.5">Referrer</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filtered.map((visitor) => (
                <tr key={visitor.id} className="transition-colors hover:bg-white/[0.03]">
                  <td className="px-4 py-4 text-white">{visitor.ip}</td>
                  <td className="px-4 py-4 text-zinc-400">{visitor.location}</td>
                  <td className="px-4 py-4 text-zinc-400">{visitor.page}</td>
                  <td className="px-4 py-4 text-zinc-400">{visitor.referrer}</td>
                  <td className="px-4 py-4 text-zinc-400">{visitor.visitedAt}</td>
                  <td className="px-4 py-4">
                    <StatusBadge label={visitor.type} tone={visitor.type === 'New' ? 'emerald' : 'blue'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>
    </div>
  )
}

function MetricCard({ label, value }: Readonly<{ label: string; value: number }>) {
  return (
    <GlassPanel className="p-5">
      <p className="text-[10px] font-black uppercase tracking-[0.28em] text-zinc-500">{label}</p>
      <p className="mt-3 text-3xl font-black text-white">{value}</p>
    </GlassPanel>
  )
}
