import { redirect } from 'next/navigation'
import { getPosts } from '@/lib/db'

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export default function LegacyPostRedirect({ params }: Readonly<{ params: { slug: string } }>) {
  redirect(`/blog/${params.slug}`)
}
