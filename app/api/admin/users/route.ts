import { NextResponse } from 'next/server'
import { getUsers, saveUsers } from '@/lib/db'

export async function GET() {
  return NextResponse.json({ users: getUsers() })
}
