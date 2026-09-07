import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { CategoriesManager } from '@/components/admin/categories-manager'
import { getCategories, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminCategoriesPage() {
  await refreshDatabaseSnapshot()
  const categories = getCategories()

  return (
    <div className="space-y-6">
      <GlassPanel className="border-cyan-500/20 bg-gradient-to-r from-cyan-950/20 via-blue-950/10 to-transparent">
        <SectionHeading
          eyebrow="Content Taxonomy"
          title="Categories & Navigation Filter Control"
          detail="Configure category names, slugs, neon theme accents, and display order across all frontend filter chips."
        />
      </GlassPanel>

      <CategoriesManager categories={categories} />
    </div>
  )
}
