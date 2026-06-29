import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getCurrentUser } from '@/lib/auth'
import { getIssueComments, saveIssueComments } from '@/lib/db'

export async function POST(
  request: Request,
  { params }: Readonly<{ params: { slug: string } }>,
) {
  const user = getCurrentUser()
  const body = await request.json().catch(() => ({}))
  const normalizedMessage = String(body?.message || '').trim()
  const normalizedAuthor = String(body?.author || user?.name || '').trim()
  const accountType = String(body?.accountType || 'google').toLowerCase()

  if (!normalizedMessage) {
    return NextResponse.json({ error: 'Comment message is required.' }, { status: 400 })
  }

  if (!normalizedAuthor) {
    return NextResponse.json({ error: 'A display name is required.' }, { status: 400 })
  }

  const comments = getIssueComments()
  const current = comments[params.slug] || []
  comments[params.slug] = [
    ...current,
    {
      id: crypto.randomUUID(),
      author: normalizedAuthor,
      role: user
        ? user.role === 'admin'
          ? 'Admin'
          : user.role === 'moderator'
            ? 'Moderator'
            : 'Player'
        : accountType === 'google'
          ? 'Google'
          : 'Guest',
      message: normalizedMessage,
      createdAt: 'Just now',
    },
  ]

  await saveIssueComments(comments)
  return NextResponse.json({ success: true })
}
