import { NextResponse } from 'next/server'
import { getCategories, saveCategories } from '@/lib/db'
import { buildCategoryRecord } from '@/lib/admin-content'

export async function GET() {
  return NextResponse.json({ categories: getCategories() })
}

export async function POST(request: Request) {
  const body = (await request.json()) as Record<string, unknown>
  const category = buildCategoryRecord(body)
  const categories = getCategories()
  await saveCategories([category, ...categories])
  return NextResponse.json({ success: true, category })
}
