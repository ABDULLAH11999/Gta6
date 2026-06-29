import { NextResponse } from 'next/server'
import { getPosts, savePosts } from '@/lib/db'
import { buildPostRecord } from '@/lib/admin-content'

export async function GET() {
  return NextResponse.json({ posts: getPosts() })
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>
  const post = buildPostRecord(body)
  const posts = getPosts()
  await savePosts([post, ...posts])
  return NextResponse.json({ success: true, post })
}
