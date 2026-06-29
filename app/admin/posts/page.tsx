import { GlassPanel } from '@/components/ui/glass'
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
      <GlassPanel className="space-y-3">
        <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Blog Posts</p>
        <h3 className="text-2xl font-black text-white">SEO-first post management</h3>
        <p className="text-sm leading-7 text-slate-400">
          Manage titles, slugs, categories, hero media, content JSON, and SEO metadata from one editor.
        </p>
      </GlassPanel>

      <PostsManager posts={posts} categories={categories} />
    </div>
  )
}
