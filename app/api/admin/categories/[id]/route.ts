import { NextResponse } from 'next/server'
import { getCategories, saveCategories } from '@/lib/db'
import { buildCategoryRecord } from '@/lib/admin-content'

function findCategory(id: string) {
  return getCategories().find((category) => category.id === id)
}

export async function PUT(request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const existing = findCategory(params.id)
  if (!existing) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 })
  }

  const body = (await request.json()) as Record<string, unknown>
  const nextCategory = buildCategoryRecord(body, existing)

  const categories = getCategories().map((category) => (category.id === existing.id ? nextCategory : category))
  await saveCategories(categories)
  return NextResponse.json({ success: true, category: nextCategory })
}

export async function DELETE(_request: Request, { params }: Readonly<{ params: { id: string } }>) {
  const categories = getCategories().filter((category) => category.id !== params.id)
  await saveCategories(categories)
  return NextResponse.json({ success: true })
}
