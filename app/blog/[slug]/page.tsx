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
      return {
        text: 'text-neon-pink',
        border: 'border-neon-pink/40',
        bg: 'bg-neon-pink/10',
        accentHex: '#ff007f',
      }
    case 'gameplay':
      return {
        text: 'text-neon-orange',
        border: 'border-neon-orange/40',
        bg: 'bg-neon-orange/10',
        accentHex: '#ffd45d',
      }
    case 'characters':
      return {
        text: 'text-neon-cyan',
        border: 'border-neon-cyan/40',
        bg: 'bg-neon-cyan/10',
        accentHex: '#00f0ff',
      }
    case 'locations':
      return {
        text: 'text-miami-blue',
        border: 'border-miami-blue/40',
        bg: 'bg-miami-blue/10',
        accentHex: '#00d4ff',
      }
    case 'resources':
      return {
        text: 'text-miami-purple',
        border: 'border-miami-purple/40',
        bg: 'bg-miami-purple/10',
        accentHex: '#8a6bff',
      }
    default:
      return {
        text: 'text-white',
        border: 'border-white/30',
        bg: 'bg-white/10',
        accentHex: '#ffffff',
      }
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
        {/* Breadcrumb Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-6 mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${colors.text} ${colors.border} ${colors.bg}`}>
              {post.categoryName}
            </span>
            <time className="text-gray-500 text-xs sm:text-sm flex items-center gap-1.5">
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
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-800/80 hover:bg-gray-700 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-200"
          >
            <ChevronLeft className="h-4 w-4" />
            All News
          </Link>
        </div>

        {/* Article Title & Hero Section */}
        <article className="space-y-6">
          <header className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-[-0.03em] leading-tight text-white">
              <span className="bg-neon-gradient bg-clip-text text-transparent">{post.title}</span>
            </h1>
            {post.excerpt && (
              <p className="text-lg leading-relaxed text-gray-300 border-l-2 border-neon-cyan/40 pl-4 italic">
                {post.excerpt}
              </p>
            )}
            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>By <strong className="text-white">{post.author}</strong></span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Clock3 className="h-3.5 w-3.5" />
                {post.readTime}
              </span>
            </div>
          </header>

          {/* Hero Image */}
          {post.heroImage && (
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-black/20 aspect-video w-full">
              <img
                src={post.heroImage}
                alt={post.heroImageAlt || post.title}
                className="h-full w-full object-cover"
              />
            </div>
          )}

          {/* Blog Content Blocks */}
          <div className="prose prose-invert prose-lg max-w-none space-y-6 pt-6">
            {post.content.map((block, index) => (
              <BlogBlock key={`${post.slug}-${index}`} block={block} colors={colors} />
            ))}
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 border-t border-gray-800 pt-6 mt-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-700 bg-gray-800/40 px-3 py-1 text-xs font-semibold text-gray-300"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </article>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-gray-800 pt-10 mt-12 space-y-6">
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-neon-pink" />
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
                    <div className="p-4 space-y-2">
                      <span className={`text-[9px] font-bold uppercase tracking-wider ${itemColors.text}`}>
                        {item.categoryName}
                      </span>
                      <h3 className="font-bold text-white line-clamp-2 leading-tight group-hover:text-neon-pink transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                        {item.excerpt}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        )}
      </div>
    </SiteShell>
  )
}

function BlogBlock({
  block,
  colors,
}: Readonly<{
  block: BlogContentBlock
  colors: { text: string; accentHex: string }
}>) {
  if (block.type === 'paragraph') {
    return <p className="text-base md:text-lg leading-relaxed text-gray-300 mb-6">{block.text}</p>
  }

  if (block.type === 'heading') {
    const isH2 = block.level === 2
    return (
      <h2
        className={`font-black tracking-tight mt-8 mb-4 ${
          isH2 ? 'text-2xl md:text-3xl ' + colors.text : 'text-xl md:text-2xl text-neon-pink'
        }`}
      >
        {block.text}
      </h2>
    )
  }

  if (block.type === 'image') {
    return (
      <figure className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-2">
        <img src={block.src} alt={block.alt} className="h-full w-full object-cover rounded-xl" />
        {block.caption && (
          <figcaption className="text-xs text-gray-500/50 text-right mt-2 pr-2 italic">
            {block.caption}
          </figcaption>
        )}
      </figure>
    )
  }

  if (block.type === 'video') {
    return (
      <div className="my-6 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-[11px] font-black uppercase tracking-[0.26em] text-slate-300">
          <Play className="h-4 w-4 text-neon-pink" />
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
      <blockquote className="border-l-4 border-neon-pink bg-gray-900/50 p-5 rounded-r-lg my-6 text-gray-200 text-lg italic">
        <p className="leading-relaxed">&ldquo;{block.text}&rdquo;</p>
      </blockquote>
    )
  }

  if (block.type === 'list') {
    return (
      <ul className="list-disc pl-6 space-y-2 mb-6 text-gray-300 text-base md:text-lg">
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )
  }

  return null
}
