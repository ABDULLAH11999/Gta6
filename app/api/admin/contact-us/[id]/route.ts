import { NextResponse } from 'next/server'
import { getContactMessages, saveContactMessages } from '@/lib/db'
import type { ContactMessage } from '@/lib/types'

export async function PUT(request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const messages = getContactMessages()
  const msgIndex = messages.findIndex((m) => m.id === params.id)
  if (msgIndex === -1) {
    return NextResponse.json({ error: 'Message not found' }, { status: 404 })
  }

  const body = (await request.json()) as Record<string, unknown>
  const targetMsg = messages[msgIndex]

  const updatedMsg: ContactMessage = {
    ...targetMsg,
    status: (body.status as ContactMessage['status']) || targetMsg.status,
  }

  messages[msgIndex] = updatedMsg
  await saveContactMessages([...messages])

  return NextResponse.json({ success: true, message: updatedMsg })
}

export async function DELETE(_request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const messages = getContactMessages().filter((m) => m.id !== params.id)
  await saveContactMessages(messages)
  return NextResponse.json({ success: true })
}
