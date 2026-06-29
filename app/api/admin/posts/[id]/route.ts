import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/db'
import { buildPostRecord } from '@/lib/admin-content'

function findPost(id: string) {
  return getPosts().find((post) => post.id === id)
}

export async function GET(_request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const post = findPost(params.id)
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  return NextResponse.json({ post })
}

export async function PUT(request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const existing = findPost(params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 })
  }

  const body = (await request.json()) as Record<string, unknown>
  const nextPost = buildPostRecord({ ...body, slug: body.slug ?? existing.slug, title: body.title ?? existing.title }, existing)

  const posts = getPosts().map((post) => (post.id === existing.id ? nextPost : post))
  await savePosts(posts)
  return NextResponse.json({ success: true, post: nextPost })
}

export async function DELETE(_request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const posts = getPosts().filter((post) => post.id !== params.id)
  await savePosts(posts)
  return NextResponse.json({ success: true })
}
