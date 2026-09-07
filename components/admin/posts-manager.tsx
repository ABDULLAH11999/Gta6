'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ExternalLink, PencilLine, Plus, Sparkles, Trash2, Video } from 'lucide-react'
import type { BlogCategory, BlogPostRecord } from '@/lib/types'
import { StatusBadge } from '@/components/ui/glass'

type Draft = {
  id?: string
  title: string
  slug: string
  categoryId: string
  excerpt: string
  summary: string
  contentJson: string
  tags: string
  heroImage: string
  heroImageAlt: string
  heroVideoUrl: string
  galleryImages: string
  author: string
  status: BlogPostRecord['status']
  featured: boolean
  featuredOrder: number
  publishedAt: string
  updatedAt: string
  readTime: string
  seoTitle: string
  seoDescription: string
  canonicalPath: string
  metaTitle: string
  metaDescription: string
}

function toDraft(post: BlogPostRecord, categories: BlogCategory[]): Draft {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    categoryId: post.categoryId || categories[0]?.id || '',
    excerpt: post.excerpt,
    summary: post.summary ?? post.excerpt,
    contentJson: JSON.stringify(post.content, null, 2),
    tags: post.tags.join(', '),
    heroImage: post.heroImage,
    heroImageAlt: post.heroImageAlt,
    heroVideoUrl:
      post.heroVideoUrl ??
      (post.content.find((b) => b.type === 'video') as { src?: string } | undefined)?.src ??
      '',
    galleryImages: post.galleryImages.join(', '),
    author: post.author,
    status: post.status,
    featured: post.featured,
    featuredOrder: post.featuredOrder,
    publishedAt: post.publishedAt ? post.publishedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
    updatedAt: post.updatedAt ? post.updatedAt.slice(0, 16) : new Date().toISOString().slice(0, 16),
    readTime: post.readTime,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    canonicalPath: post.canonicalPath ?? `/blog/${post.slug}`,
    metaTitle: post.metaTitle ?? post.seoTitle,
    metaDescription: post.metaDescription ?? post.seoDescription,
  }
}

function emptyDraft(categories: BlogCategory[]): Draft {
  const publishedAt = new Date().toISOString().slice(0, 16)
  return {
    title: '',
    slug: '',
    categoryId: categories[0]?.id ?? '',
    excerpt: '',
    summary: '',
    contentJson: JSON.stringify(
      [
        { type: 'paragraph', text: 'Write the opening paragraph here.' },
        { type: 'video', title: 'Official Video Title', src: 'https://www.youtube.com/embed/QdBZY2fkU-0' },
        { type: 'heading', level: 2, text: 'Key Gameplay Features' },
        {
          type: 'list',
          items: ['Feature 1: Next-gen mechanics', 'Feature 2: Dynamic physics', 'Feature 3: Open world AI'],
        },
      ],
      null,
      2,
    ),
    tags: 'GTA 6, Gameplay, Vice City, Rockstar',
    heroImage: '/blog/images/Real_Dimez_03.CcpVFPll_1vpoSg.webp',
    heroImageAlt: 'GTA 6 Gameplay Image',
    heroVideoUrl: 'https://www.youtube.com/embed/QdBZY2fkU-0',
    galleryImages: '',
    author: 'GtaFans Editorial Team',
    status: 'published',
    featured: false,
    featuredOrder: 0,
    publishedAt,
    updatedAt: publishedAt,
    readTime: '8 min read',
    seoTitle: '',
    seoDescription: '',
    canonicalPath: '/blog/',
    metaTitle: '',
    metaDescription: '',
  }
}

export function PostsManager({
  posts,
  categories,
}: Readonly<{ posts: BlogPostRecord[]; categories: BlogCategory[] }>) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(() => emptyDraft(categories))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const selectedPost = useMemo(() => posts.find((post) => post.id === draft.id) ?? null, [draft.id, posts])

  useEffect(() => {
    if (!draft.id) return
    const post = posts.find((item) => item.id === draft.id)
    if (post) setDraft(toDraft(post, categories))
  }, [categories, draft.id, posts])

  async function handleSave() {
    setSaving(true)
    setError('')

    try {
      const payload = {
        ...draft,
        categoryId: draft.categoryId || categories[0]?.id || '',
        tags: draft.tags,
        galleryImages: draft.galleryImages,
        content: draft.contentJson,
        featured: draft.featured,
        featuredOrder: draft.featuredOrder,
        publishedAt: draft.publishedAt ? new Date(draft.publishedAt).toISOString() : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const response = await fetch(draft.id ? `/api/admin/posts/${draft.id}` : '/api/admin/posts', {
        method: draft.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => ({}))) as { error?: string }
        throw new Error(data.error || 'Could not save the post.')
      }

      router.refresh()
      if (!draft.id) {
        setDraft(emptyDraft(categories))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the post.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this blog post?')) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete the post.')
      router.refresh()
      if (draft.id === id) {
        setDraft(emptyDraft(categories))
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the post.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
      {/* Posts List Column */}
      <div className="rounded-[1.8rem] border border-fuchsia-500/20 bg-[#120c24]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-400">Articles Library</p>
            <h3 className="mt-1 text-xl font-black text-white">All Posts ({posts.length})</h3>
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyDraft(categories))}
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-gradient-to-r from-pink-500/20 to-purple-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-pink-200 transition hover:bg-pink-500/30 hover:text-white shadow-[0_0_15px_rgba(236,72,153,0.2)]"
          >
            <Plus className="h-4 w-4 text-pink-400" />
            New Post
          </button>
        </div>

        <div className="mt-4 max-h-[860px] space-y-3 overflow-auto pr-1">
          {posts.map((post) => {
            const active = post.id === draft.id
            return (
              <div
                key={post.id}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  active
                    ? 'border-pink-500/50 bg-pink-950/30 shadow-[0_0_20px_rgba(236,72,153,0.2)] scale-[1.01]'
                    : 'border-white/10 bg-black/40 hover:border-pink-500/30 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setDraft(toDraft(post, categories))} className="text-left flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-400">
                        {post.categoryName || 'News'}
                      </span>
                      <span className="text-zinc-600">•</span>
                      <StatusBadge label={post.status} tone={post.status === 'published' ? 'emerald' : 'amber'} />
                      {post.featured ? <StatusBadge label="Featured" tone="pink" /> : null}
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-white leading-snug">{post.title}</h4>
                    <p className="mt-1.5 text-xs leading-relaxed text-zinc-400 line-clamp-2">{post.excerpt}</p>
                  </button>

                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(toDraft(post, categories))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-bold text-cyan-200 transition hover:bg-cyan-500/20"
                    >
                      <PencilLine className="h-3 w-3 text-cyan-400" />
                      Edit
                    </button>
                    <Link
                      href={`/blog/${post.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold text-zinc-300 transition hover:bg-white/10 hover:text-white"
                    >
                      <ExternalLink className="h-3 w-3 text-zinc-400" />
                      View
                    </Link>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post.id)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1.5 text-[10px] font-bold text-rose-200 transition hover:bg-rose-500/20"
                    >
                      <Trash2 className="h-3 w-3 text-rose-400" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Editor Form Column */}
      <div className="rounded-[1.8rem] border border-fuchsia-500/20 bg-[#120c24]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-pink-400">
              {draft.id ? 'Edit Mode' : 'Creation Mode'}
            </p>
            <h3 className="mt-1 text-xl font-black text-white truncate max-w-[380px]">
              {selectedPost ? selectedPost.title : 'New GTA 6 Blog Post'}
            </h3>
          </div>
          {draft.id ? (
            <Link
              href={`/blog/${draft.slug}`}
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-400 hover:underline"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Preview Article
            </Link>
          ) : null}
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Title" className="md:col-span-2">
            <input
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              className="field-input"
              placeholder="e.g. GTA 6 Official Gameplay Reveal..."
            />
          </Field>

          <Field label="URL Slug">
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="field-input"
              placeholder="e.g. gta-6-official-gameplay"
            />
          </Field>

          <Field label="Category">
            <select
              value={draft.categoryId}
              onChange={(e) => setDraft({ ...draft, categoryId: e.target.value })}
              className="field-input"
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-zinc-900 text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Author">
            <input
              value={draft.author}
              onChange={(e) => setDraft({ ...draft, author: e.target.value })}
              className="field-input"
            />
          </Field>

          <Field label="Read Time">
            <input
              value={draft.readTime}
              onChange={(e) => setDraft({ ...draft, readTime: e.target.value })}
              className="field-input"
              placeholder="e.g. 10 min read"
            />
          </Field>

          <Field label="Hero Image URL" className="md:col-span-2">
            <input
              value={draft.heroImage}
              onChange={(e) => setDraft({ ...draft, heroImage: e.target.value })}
              className="field-input"
              placeholder="e.g. /blog/images/... or https://..."
            />
          </Field>

          <Field label="Hero Alt Text" className="md:col-span-2">
            <input
              value={draft.heroImageAlt}
              onChange={(e) => setDraft({ ...draft, heroImageAlt: e.target.value })}
              className="field-input"
              placeholder="e.g. GTA 6 Vice City Gameplay screenshot"
            />
          </Field>

          <Field label="Hero / Embed Video URL (YouTube)" className="md:col-span-2">
            <div className="relative">
              <input
                value={draft.heroVideoUrl}
                onChange={(e) => setDraft({ ...draft, heroVideoUrl: e.target.value })}
                className="field-input pr-10"
                placeholder="e.g. https://youtu.be/tJbzMqJGH4k or https://www.youtube.com/watch?v=tJbzMqJGH4k"
              />
              <Video className="absolute right-3.5 top-3.5 h-4 w-4 text-pink-400" />
            </div>
          </Field>

          <Field label="Excerpt / Hook" className="md:col-span-2">
            <textarea
              rows={2}
              value={draft.excerpt}
              onChange={(e) => setDraft({ ...draft, excerpt: e.target.value })}
              className="field-input"
              placeholder="Brief summary displayed on cards..."
            />
          </Field>

          <Field label="Tags (Comma Separated)" className="md:col-span-2">
            <input
              value={draft.tags}
              onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
              className="field-input"
              placeholder="GTA 6, Gameplay, Vice City, RAGE 9"
            />
          </Field>

          <Field label="SEO Title" className="md:col-span-2">
            <input
              value={draft.seoTitle}
              onChange={(e) => setDraft({ ...draft, seoTitle: e.target.value })}
              className="field-input"
              placeholder="Optimized title tag for Google search..."
            />
          </Field>

          <Field label="SEO Description" className="md:col-span-2">
            <textarea
              rows={2}
              value={draft.seoDescription}
              onChange={(e) => setDraft({ ...draft, seoDescription: e.target.value })}
              className="field-input"
              placeholder="Meta description for search engine results..."
            />
          </Field>

          <Field label="Content JSON (Paragraphs, Headings, Video, Lists)" className="md:col-span-2">
            <textarea
              rows={12}
              value={draft.contentJson}
              onChange={(e) => setDraft({ ...draft, contentJson: e.target.value })}
              className="field-input font-mono text-xs leading-relaxed"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <Field label="Publication Status">
              <select
                value={draft.status}
                onChange={(e) => setDraft({ ...draft, status: e.target.value as BlogPostRecord['status'] })}
                className="field-input"
              >
                <option value="published" className="bg-zinc-900 text-white">Published</option>
                <option value="draft" className="bg-zinc-900 text-white">Draft</option>
                <option value="archived" className="bg-zinc-900 text-white">Archived</option>
              </select>
            </Field>

            <Field label="Featured Order">
              <input
                type="number"
                value={draft.featuredOrder}
                onChange={(e) => setDraft({ ...draft, featuredOrder: Number(e.target.value) })}
                className="field-input"
              />
            </Field>
          </div>

          <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs font-bold text-zinc-300 cursor-pointer hover:border-pink-500/30">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
              className="h-4 w-4 rounded border-pink-500/40 text-pink-500 accent-pink-500"
            />
            <Sparkles className="h-4 w-4 text-pink-400" />
            Feature this story on Homepage hero
          </label>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <p className="text-[11px] text-zinc-400">
            Posts persist immediately to JSON and connected PostgreSQL database.
          </p>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-pink-500/50 bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 shadow-[0_0_20px_rgba(236,72,153,0.3)]"
          >
            {saving ? 'Saving...' : 'Save Article'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.4);
          padding: 0.75rem 1rem;
          font-size: 0.825rem;
          color: white;
          outline: none;
          transition: all 0.2s ease;
        }
        .field-input:focus {
          border-color: rgba(236, 72, 153, 0.6);
          box-shadow: 0 0 15px rgba(236, 72, 153, 0.25);
          background: rgba(0, 0, 0, 0.6);
        }
      `}</style>
    </div>
  )
}

function Field({
  label,
  children,
  className = '',
}: Readonly<{
  label: string
  children: React.ReactNode
  className?: string
}>) {
  return (
    <label className={`block space-y-1.5 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">{label}</span>
      {children}
    </label>
  )
}
