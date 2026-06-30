import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { CalendarDays, ChevronLeft, Clock3, Play, Sparkles } from 'lucide-react'
import { SiteShell } from '@/components/site-shell'
import { getCategories, getPosts } from '@/lib/db'
import type { BlogContentBlock } from '@/lib/types'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export function generateStaticParams() {
  return getPosts().map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: Readonly<{ params: { slug: string } }>): Metadata {
  const post = getPosts().find((item) => item.slug === params.slug)
  if (!post) return { title: 'Post Not Found' }

  return {
    title: `${post.seoTitle} - GTA VI HYPE`,
    description: post.seoDescription,
    keywords: post.tags,
    alternates: { canonical: post.canonicalPath ?? `/blog/${post.slug}` },
    openGraph: {
      title: post.seoTitle,
      description: post.seoDescription,
      url: post.canonicalPath ?? `/blog/${post.slug}`,
      type: 'article',
      images: [post.heroImage],
    },
  }
}

function getCategoryColors(slug: string) {
  switch (slug.toLowerCase()) {
    case 'trailers':
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
    case 'gameplay':
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
    case 'characters':
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
    case 'locations':
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
    case 'resources':
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
    default:
      return { text: 'text-white', border: 'border-white/20', bg: 'bg-white/10' }
  }
}

export default function BlogPostPage({ params }: Readonly<{ params: { slug: string } }>) {
  const post = getPosts().find((item) => item.slug === params.slug)
  if (!post) notFound()

  const categories = getCategories()
  const category = categories.find((item) => item.id === post.categoryId)
  const categorySlug = post.categorySlug || category?.slug || 'trailers'
  const colors = getCategoryColors(categorySlug)

  const relatedPosts = getPosts()
    .filter((item) => item.slug !== post.slug && item.categoryId === post.categoryId)
    .slice(0, 3)

  return (
    <SiteShell>
      <div className="mx-auto flex w-full max-w-[960px] flex-col gap-6 px-4">
        <div className="mb-4 flex items-center justify-between border-b border-gray-800 pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.text} ${colors.border} ${colors.bg}`}>
              {post.categoryName}
            </span>
            <time className="flex items-center gap-1.5 text-xs text-gray-500 sm:text-sm">
              <CalendarDays className="h-3.5 w-3.5" />
              {new Date(post.publishedAt).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </time>
          </div>

          <Link
            href="/#categories"
            className="inline-flex items-center gap-1.5 rounded-xl border border-gray-700 bg-gray-900/80 px-4 py-2 text-xs font-semibold text-gray-300 transition-all duration-200 hover:border-gray-600 hover:bg-gray-800 hover:text-white sm:text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            All News
          </Link>
        </div>

        <article className="space-y-6">
          <header className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.04] px-3 py-1 text-[10px] font-black uppercase tracking-[0.26em] text-slate-300">
              <span className={`h-2 w-2 rounded-full ${colors.bg}`} />
              {post.categoryName}
            </div>
            <h1 className="text-4xl font-black leading-tight tracking-[-0.04em] text-white sm:text-5xl lg:text-6xl">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="border-l-2 border-white/20 pl-4 text-lg leading-relaxed italic text-gray-300">
                {post.excerpt}
              </p>
            ) : null}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>
                By <strong className="text-white">{post.author}</strong>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
          </header>

          {post.heroImage ? (
            <div className="aspect-video w-full overflow-hidden rounded-3xl bg-black/20">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt || post.title}
                className="h-full w-full object-cover"
              />
            </div>
          ) : null}

          <div className="space-y-6 pt-4">
            {post.content.map((block, index) => (
              <BlogBlock key={`${post.slug}-${index}`} block={block} colors={colors} />
            ))}
          </div>

          {post.tags && post.tags.length > 0 ? (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-800 pt-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-700 bg-gray-800/40 px-3 py-1 text-xs font-semibold text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </article>

        {relatedPosts.length > 0 ? (
          <section className="mt-12 space-y-6 border-t border-gray-800 pt-10">
            <h2 className="flex items-center gap-2 text-xl font-black text-white">
              <Sparkles className="h-5 w-5 text-white" />
              Related Articles
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {relatedPosts.map((item) => {
                const itemColors = getCategoryColors(item.categorySlug || 'trailers')
                return (
                  <Link
                    key={item.slug}
                    href={`/blog/${item.slug}`}
                    className="group overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-b from-white/[0.02] to-black/[0.9] transition-all duration-300 hover:-translate-y-1 hover:border-white/20"
                  >
                    <div className="relative aspect-video w-full overflow-hidden">
                      <img
                        src={item.heroImage}
                        alt={item.heroImageAlt || item.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="space-y-2 p-4">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${itemColors.text}`}>
                        {item.categoryName}
                      </span>
                      <h3 className="line-clamp-2 font-bold leading-tight text-white transition-colors group-hover:text-white/80">
                        {item.title}
                      </h3>
                      <p className="line-clamp-2 text-xs leading-relaxed text-gray-400">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        ) : null}
      </div>
    </SiteShell>
  )
}

function BlogBlock({
  block,
  colors,
}: Readonly<{
  block: BlogContentBlock
  colors: { text: string; accentHex?: string; border: string; bg: string }
}>) {
  if (block.type === 'paragraph') {
    return <p className="mb-6 text-base leading-relaxed text-gray-300 md:text-lg">{block.text}</p>
  }

  if (block.type === 'heading') {
    const isH2 = block.level === 2
    return (
      <div className="mb-4 mt-8 space-y-3">
        <div className={`h-1.5 w-16 rounded-full ${colors.bg}`} />
        <h2 className={`font-black tracking-tight ${isH2 ? 'text-2xl text-white md:text-3xl' : 'text-xl text-slate-100 md:text-2xl'}`}>
          {block.text}
        </h2>
      </div>
    )
  }

  if (block.type === 'image') {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
        <img src={block.src} alt={block.alt} className="h-full w-full rounded-xl object-cover" />
        {block.caption ? (
          <figcaption className="mt-2 pr-2 text-right text-xs italic text-gray-500/50">
            {block.caption}
          </figcaption>
        ) : null}
      </figure>
    )
  }

  if (block.type === 'video') {
    return (
      <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.26em] text-slate-300">
          <Play className="h-4 w-4 text-white" />
          {block.title || 'Video reference'}
        </div>
        <div className="aspect-video">
          <iframe
            src={block.src}
            title={block.title || 'video'}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    )
  }

  if (block.type === 'quote') {
    return (
      <blockquote className="my-6 rounded-r-lg border-l-4 border-white/20 bg-white/[0.04] p-5 text-lg italic text-gray-200">
        <p className="leading-relaxed">&ldquo;{block.text}&rdquo;</p>
      </blockquote>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className="mb-6 list-disc space-y-2 pl-6 text-base text-gray-300 md:text-lg">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return null
}
