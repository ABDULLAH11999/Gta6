import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getCategories, getPosts, savePosts } from '@/lib/db'
import { issues } from '@/lib/site-data'
import type { BlogContentBlock, BlogPostRecord } from '@/lib/types'

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

type ReportTemplate = {
  title: string
  summary: string
  content: string[]
  keywords: string[]
}

function buildFallbackReport(games: string[], publishNow: boolean, normalizedTime: string): ReportTemplate {
  const primaryGame = games[0] || 'Game'
  const key = slugify(primaryGame)

  const templates: Record<string, ReportTemplate> = {
    'tekken-8': {
      title: 'Tekken 8 infinite loading after ranked rematch',
      summary:
        'Players report the rematch screen freezing at 100% after online matches. Restarting the client or clearing cache temporarily gets around the hang.',
      content: [
        publishNow
          ? 'This bug report was published immediately after multiple live player reports for Tekken 8.'
          : `This bug report is queued for ${normalizedTime} PKT after repeated player reports for Tekken 8.`,
        'Players describe the game locking on the rematch loading screen after ranked matches, especially when re-entering a lobby without closing the client.',
        'Current workarounds include restarting the game between matches, clearing the local cache, and avoiding back-to-back rematches until the next patch lands.',
      ],
      keywords: ['Tekken 8 loading bug', 'Tekken 8 rematch freeze', 'Tekken 8 ranked match bug'],
    },
  }

  if (templates[key]) {
    return templates[key]
  }

  return {
    title: `${primaryGame} bug report: post-match loading freeze`,
    summary:
      `Players are reporting a loading freeze after recent matches in ${primaryGame}. Restarting the client and rejoining fresh sessions currently helps some players recover.`,
    content: [
      publishNow
        ? `This bug report was published immediately for ${primaryGame} after new live reports came in.`
        : `This bug report is queued for ${normalizedTime} PKT after repeated live reports for ${primaryGame}.`,
      `Players say ${primaryGame} is hanging on the post-match loading screen, usually after a rematch or quick lobby transition.`,
      'Until a proper patch lands, the safest workaround is to restart between sessions and avoid rapid back-to-back queueing.',
    ],
    keywords: [
      `${primaryGame} bug report`,
      `${primaryGame} loading freeze`,
      `${primaryGame} post match bug`,
    ],
  }
}

function buildScheduledPublishAt(normalizedTime: string) {
  const match = normalizedTime.match(/^(\d{1,2}):(\d{2})\s*PKT$/i)
  if (!match) {
    return new Date().toISOString()
  }

  const hour = Number(match[1])
  const minute = Number(match[2])
  const now = new Date()
  const pktNow = new Date(now.getTime() + 5 * 60 * 60 * 1000)
  const scheduledUtc =
    Date.UTC(pktNow.getUTCFullYear(), pktNow.getUTCMonth(), pktNow.getUTCDate(), hour, minute, 0, 0) -
    5 * 60 * 60 * 1000

  return new Date(scheduledUtc > now.getTime() ? scheduledUtc : scheduledUtc + 24 * 60 * 60 * 1000).toISOString()
}

export async function POST(request: Request) {
  const { time, games, title, postNow } = await request.json()
  const selectedGames = Array.isArray(games) ? games.map((item) => String(item).trim()).filter(Boolean) : []
  const publishNow = Boolean(postNow)
  const normalizedTime = String(time || '').trim()
  if (!selectedGames.length || (!publishNow && !normalizedTime)) {
    return NextResponse.json({ error: 'Please choose games and a time, or enable post now.' }, { status: 400 })
  }

  const matchedIssues = issues.filter((issue) => selectedGames.includes(issue.game))
  const issueTitles = matchedIssues.map((issue) => issue.title).slice(0, 3)
  const fallbackReport = buildFallbackReport(selectedGames, publishNow, normalizedTime)
  const summary = matchedIssues[0]?.summary || fallbackReport.summary
  const slotTime = publishNow ? 'Published now' : normalizedTime
  const publishedAt = publishNow ? new Date().toISOString() : buildScheduledPublishAt(normalizedTime)
  const postTitle = String(title || matchedIssues[0]?.title || fallbackReport.title)
  const content = matchedIssues.length
    ? [
        publishNow
          ? `This bug report was published immediately for ${selectedGames.join(', ')}.`
          : `This bug report is scheduled for ${normalizedTime} PKT and targets ${selectedGames.join(', ')}.`,
        `AI suggestions reviewed ${issueTitles.join('; ')} and merged the most relevant player fixes into one readable report.`,
        'This report is written for players who want the bug summary, current workaround, and the latest status in one place.',
      ]
    : fallbackReport.content

  const categories = getCategories()
  const primaryCategory = categories.find((category) =>
    selectedGames.some((game) => category.name.toLowerCase() === game.toLowerCase()),
  ) ?? categories[0]

  const contentBlocks: BlogContentBlock[] = content.map((paragraph) => ({
    type: 'paragraph',
    text: paragraph,
  }))

  const record: BlogPostRecord = {
    id: crypto.randomUUID(),
    slug: slugify(postTitle || `${selectedGames.join('-')}-${slotTime.replace(':', '-')}`),
    categoryId: primaryCategory?.id ?? 'cat-resources',
    categorySlug: primaryCategory?.slug ?? 'resources',
    categoryName: primaryCategory?.name ?? 'Resources',
    title: postTitle,
    excerpt: summary,
    summary,
    content: contentBlocks,
    tags: Array.from(
      new Set([
        ...selectedGames.flatMap((game) => [game, `${game} bug report`, `${game} loading bug`]),
        ...matchedIssues.flatMap((issue) => issue.keywords),
        ...fallbackReport.keywords,
      ]),
    ),
    heroImage: '/og-image.jpg',
    heroImageAlt: postTitle,
    heroVideoUrl: '',
    galleryImages: [],
    author: 'Ammo',
    status: publishNow ? 'published' : 'draft',
    featured: false,
    featuredOrder: 0,
    publishedAt,
    updatedAt: new Date().toISOString(),
    readTime: '5 min read',
    seoTitle: postTitle,
    seoDescription: summary,
    canonicalPath: `/blog/${slugify(postTitle || `${selectedGames.join('-')}-${slotTime.replace(':', '-')}`)}`,
    metaTitle: postTitle,
    metaDescription: summary,
    videoLinks: [],
    imageLinks: ['/og-image.jpg'],
    sourceLinks: [],
    games: selectedGames,
    slotTime,
  }

  const posts = getPosts()
  await savePosts([record, ...posts])

  return NextResponse.json({ success: true, post: record })
}
