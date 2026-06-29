import crypto from 'crypto'
import { getCategories } from '@/lib/db'
import type { BlogCategory, BlogContentBlock, BlogPostRecord } from '@/lib/types'

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function normalizeList(input: unknown) {
  if (Array.isArray(input)) {
    return input.map((item) => String(item).trim()).filter(Boolean)
  }

  if (typeof input === 'string') {
    return input
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
  }

  return []
}

export function parseBlocks(input: unknown): BlogContentBlock[] {
  if (Array.isArray(input)) {
    return input as BlogContentBlock[]
  }

  if (typeof input === 'string' && input.trim()) {
    try {
      const parsed = JSON.parse(input)
      return Array.isArray(parsed) ? (parsed as BlogContentBlock[]) : []
    } catch {
      return []
    }
  }

  return []
}

export function buildCategoryRecord(
  body: Record<string, unknown>,
  existing?: BlogCategory,
): BlogCategory {
  const name = String(body.name ?? existing?.name ?? '').trim()
  return {
    id: existing?.id ?? crypto.randomUUID(),
    slug: String(body.slug ?? existing?.slug ?? slugify(name)).trim() || slugify(name),
    name,
    description: String(body.description ?? existing?.description ?? '').trim(),
    accent: String(body.accent ?? existing?.accent ?? 'from-fuchsia-500 to-violet-500').trim(),
    order: Number(body.order ?? existing?.order ?? 0),
    icon: String(body.icon ?? existing?.icon ?? '').trim() || undefined,
  }
}

export function buildPostRecord(
  body: Record<string, unknown>,
  existing?: BlogPostRecord,
): BlogPostRecord {
  const categories = getCategories()
  const categoryId = String(body.categoryId ?? existing?.categoryId ?? categories[0]?.id ?? '')
  const category = categories.find((item) => item.id === categoryId)
  const title = String(body.title ?? existing?.title ?? '').trim()
  const slug = String(body.slug ?? existing?.slug ?? slugify(title)).trim() || slugify(title)
  const publishedAt = String(body.publishedAt ?? existing?.publishedAt ?? new Date().toISOString())
  const updatedAt = String(body.updatedAt ?? new Date().toISOString())
  const status = String(body.status ?? existing?.status ?? 'draft') as BlogPostRecord['status']
  const heroImage = String(body.heroImage ?? existing?.heroImage ?? '').trim()
  const galleryImages = normalizeList(body.galleryImages)
  const tags = normalizeList(body.tags)
  const content = parseBlocks(body.content)
  const seoTitle = String(body.seoTitle ?? existing?.seoTitle ?? title).trim() || title
  const seoDescription = String(body.seoDescription ?? existing?.seoDescription ?? body.excerpt ?? existing?.excerpt ?? '').trim()

  return {
    id: existing?.id ?? crypto.randomUUID(),
    slug,
    categoryId,
    categorySlug: category?.slug ?? existing?.categorySlug ?? '',
    categoryName: category?.name ?? existing?.categoryName ?? '',
    title,
    excerpt: String(body.excerpt ?? existing?.excerpt ?? '').trim(),
    summary: String(body.summary ?? existing?.summary ?? body.excerpt ?? existing?.excerpt ?? '').trim(),
    content,
    tags,
    heroImage,
    heroImageAlt: String(body.heroImageAlt ?? existing?.heroImageAlt ?? (title || 'Post image')),
    heroVideoUrl: String(body.heroVideoUrl ?? existing?.heroVideoUrl ?? '').trim() || undefined,
    galleryImages,
    author: String(body.author ?? existing?.author ?? 'Ammo').trim() || 'Ammo',
    status,
    featured: Boolean(body.featured ?? existing?.featured ?? false),
    featuredOrder: Number(body.featuredOrder ?? existing?.featuredOrder ?? 0),
    publishedAt,
    updatedAt,
    readTime: String(body.readTime ?? existing?.readTime ?? '5 min read').trim() || '5 min read',
    seoTitle,
    seoDescription,
    canonicalPath: String(body.canonicalPath ?? existing?.canonicalPath ?? `/blog/${slug}`).trim() || `/blog/${slug}`,
    metaTitle: String(body.metaTitle ?? existing?.metaTitle ?? seoTitle).trim() || seoTitle,
    metaDescription: String(body.metaDescription ?? existing?.metaDescription ?? seoDescription).trim(),
    videoLinks: body.videoLinks && Array.isArray(body.videoLinks)
      ? body.videoLinks.map((item) => String(item).trim()).filter(Boolean)
      : existing?.videoLinks ?? (body.heroVideoUrl ? [String(body.heroVideoUrl)] : []),
    imageLinks: heroImage ? [heroImage, ...galleryImages] : galleryImages,
    sourceLinks: Array.isArray(body.sourceLinks)
      ? body.sourceLinks.map((item) => String(item).trim()).filter(Boolean)
      : existing?.sourceLinks ?? [],
    games: [category?.name ?? existing?.categoryName ?? 'All News'],
    slotTime: new Date(publishedAt).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
  }
}
