import { getCategories, getPosts } from '@/lib/db'
import { ClientHome } from '@/components/client-home'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Home() {
  const categories = getCategories().slice().sort((a, b) => a.order - b.order)
  const posts = getPosts().filter((post) => post.status === 'published')

  return <ClientHome initialPosts={posts} initialCategories={categories} />
}
