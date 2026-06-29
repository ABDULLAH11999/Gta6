import { GlassPanel } from '@/components/ui/glass'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { getCategories, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCategoriesPage() {
  await refreshDatabaseSnapshot()
  const categories = getCategories()

  return (
    <div className="space-y-6">
      <GlassPanel className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Categories</p>
        <h3 className="text-2xl font-black text-white">Taxonomy and filter control</h3>
        <p className="text-sm leading-7 text-slate-400">
          Keep the homepage chips, category pages, and post assignment structure in sync from one place.
        </p>
      </GlassPanel>

      <CategoriesManager categories={categories} />
    </div>
  )
}
