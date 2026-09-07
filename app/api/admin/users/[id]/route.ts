import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/db'

export async function PUT(request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const users = getUsers()
  const userIndex = users.findIndex((u) => u.id === params.id)
  if (userIndex === -1) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const body = (await request.json()) as Record<string, unknown>
  const targetUser = users[userIndex]

  const updatedUser = {
    ...targetUser,
    role: typeof body.role === 'string' ? (body.role as any) : targetUser.role,
    verified: typeof body.verified === 'boolean' ? body.verified : targetUser.verified,
  }

  users[userIndex] = updatedUser
  await saveUsers([...users])

  return NextResponse.json({ success: true, user: updatedUser })
}

export async function DELETE(_request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const users = getUsers().filter((u) => u.id !== params.id)
  await saveUsers(users)
  return NextResponse.json({ success: true })
}
