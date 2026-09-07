import { NextResponse } from 'next/server'
import { getContactMessages, saveContactMessages } from '@/lib/db'

export async function GET() {
  return NextResponse.json({ messages: getContactMessages() })
}
