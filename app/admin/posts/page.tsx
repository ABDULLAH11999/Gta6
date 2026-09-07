import { GlassPanel, SectionHeading } from '@/components/ui/glass'
import { PostsManager } from '@/components/admin/posts-manager'
import { getCategories, getPosts, refreshDatabaseSnapshot } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminPostsPage() {
  await refreshDatabaseSnapshot()
  const posts = getPosts()
  const categories = getCategories()

  return (
    <div className="space-y-6">
      <GlassPanel className="border-pink-500/20 bg-gradient-to-r from-pink-950/20 via-purple-950/10 to-transparent">
        <SectionHeading
          eyebrow="Editorial & Content Engine"
          title="SEO-First Blog Post Management"
          detail="Manage article titles, URL slugs, YouTube video embeds, hero graphics, JSON content blocks, and search meta tags."
        />
      </GlassPanel>

      <PostsManager posts={posts} categories={categories} />
    </div>
  )
}
