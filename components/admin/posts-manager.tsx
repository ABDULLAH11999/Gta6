'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilLine, Plus, Trash2 } from 'lucide-react'
import type { BlogCategory, BlogPostRecord } from '@/lib/types'

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
    heroVideoUrl: post.heroVideoUrl ?? '',
    galleryImages: post.galleryImages.join(', '),
    author: post.author,
    status: post.status,
    featured: post.featured,
    featuredOrder: post.featuredOrder,
    publishedAt: post.publishedAt.slice(0, 16),
    updatedAt: post.updatedAt.slice(0, 16),
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
        { type: 'heading', level: 2, text: 'New section' },
        { type: 'paragraph', text: 'Write the post body here.' },
      ],
      null,
      2,
    ),
    tags: '',
    heroImage: '',
    heroImageAlt: '',
    heroVideoUrl: '',
    galleryImages: '',
    author: 'Ammo',
    status: 'draft',
    featured: false,
    featuredOrder: 0,
    publishedAt,
    updatedAt: publishedAt,
    readTime: '5 min read',
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
    if (!confirm('Delete this post?')) return
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
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Posts</p>
            <h3 className="mt-1 text-xl font-black text-white">Blog Post CRUD</h3>
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyDraft(categories))}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
          >
            <Plus className="h-4 w-4 text-fuchsia-200" />
            New post
          </button>
        </div>

        <div className="mt-4 max-h-[820px] space-y-3 overflow-auto pr-1">
          {posts.map((post) => {
            const active = post.id === draft.id
            return (
              <div
                key={post.id}
                className={`rounded-[1.5rem] border p-4 transition ${
                  active ? 'border-fuchsia-400/25 bg-fuchsia-500/10' : 'border-white/8 bg-black/20'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setDraft(toDraft(post, categories))} className="text-left">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                      {post.categoryName ?? 'News'} • {post.status}
                    </p>
                    <h4 className="mt-1 text-sm font-bold text-white">{post.title}</h4>
                    <p className="mt-2 text-xs leading-6 text-slate-400 line-clamp-3">{post.excerpt}</p>
                  </button>
                  <div className="flex shrink-0 flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(toDraft(post, categories))}
                      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
                    >
                      <PencilLine className="h-3.5 w-3.5" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(post.id)}
                      className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-200 transition hover:bg-rose-500/10"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="border-b border-white/8 pb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">
            {draft.id ? 'Edit post' : 'Create post'}
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            {selectedPost ? selectedPost.title : 'New GTA 6 blog post'}
          </h3>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Title">
            <input value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} className="field-input" />
          </Field>
          <Field label="Slug">
            <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} className="field-input" />
          </Field>
          <Field label="Category">
            <select value={draft.categoryId} onChange={(event) => setDraft({ ...draft, categoryId: event.target.value })} className="field-input">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Author">
            <input value={draft.author} onChange={(event) => setDraft({ ...draft, author: event.target.value })} className="field-input" />
          </Field>
          <Field label="Published">
            <input type="datetime-local" value={draft.publishedAt} onChange={(event) => setDraft({ ...draft, publishedAt: event.target.value })} className="field-input" />
          </Field>
          <Field label="Read Time">
            <input value={draft.readTime} onChange={(event) => setDraft({ ...draft, readTime: event.target.value })} className="field-input" />
          </Field>
          <Field label="Hero Image URL" className="md:col-span-2">
            <input value={draft.heroImage} onChange={(event) => setDraft({ ...draft, heroImage: event.target.value })} className="field-input" />
          </Field>
          <Field label="Hero Alt" className="md:col-span-2">
            <input value={draft.heroImageAlt} onChange={(event) => setDraft({ ...draft, heroImageAlt: event.target.value })} className="field-input" />
          </Field>
          <Field label="Video URL" className="md:col-span-2">
            <input value={draft.heroVideoUrl} onChange={(event) => setDraft({ ...draft, heroVideoUrl: event.target.value })} className="field-input" />
          </Field>
          <Field label="Excerpt" className="md:col-span-2">
            <textarea rows={3} value={draft.excerpt} onChange={(event) => setDraft({ ...draft, excerpt: event.target.value })} className="field-input" />
          </Field>
          <Field label="Summary" className="md:col-span-2">
            <textarea rows={3} value={draft.summary} onChange={(event) => setDraft({ ...draft, summary: event.target.value })} className="field-input" />
          </Field>
          <Field label="Tags" className="md:col-span-2">
            <input value={draft.tags} onChange={(event) => setDraft({ ...draft, tags: event.target.value })} className="field-input" placeholder="trailer, lucia, vice city" />
          </Field>
          <Field label="Gallery Images" className="md:col-span-2">
            <textarea rows={2} value={draft.galleryImages} onChange={(event) => setDraft({ ...draft, galleryImages: event.target.value })} className="field-input" placeholder="Comma-separated image URLs" />
          </Field>
          <Field label="SEO Title" className="md:col-span-2">
            <input value={draft.seoTitle} onChange={(event) => setDraft({ ...draft, seoTitle: event.target.value })} className="field-input" />
          </Field>
          <Field label="SEO Description" className="md:col-span-2">
            <textarea rows={3} value={draft.seoDescription} onChange={(event) => setDraft({ ...draft, seoDescription: event.target.value })} className="field-input" />
          </Field>
          <Field label="Canonical Path" className="md:col-span-2">
            <input value={draft.canonicalPath} onChange={(event) => setDraft({ ...draft, canonicalPath: event.target.value })} className="field-input" />
          </Field>
          <Field label="Content JSON" className="md:col-span-2">
            <textarea rows={14} value={draft.contentJson} onChange={(event) => setDraft({ ...draft, contentJson: event.target.value })} className="field-input font-mono text-[12px]" />
          </Field>
          <div className="grid grid-cols-2 gap-4 md:col-span-2">
            <Field label="Status">
              <select value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as BlogPostRecord['status'] })} className="field-input">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </Field>
            <Field label="Featured Order">
              <input type="number" value={draft.featuredOrder} onChange={(event) => setDraft({ ...draft, featuredOrder: Number(event.target.value) })} className="field-input" />
            </Field>
          </div>
          <label className="md:col-span-2 flex items-center gap-3 rounded-2xl border border-white/8 bg-black/20 px-4 py-3 text-sm text-slate-300">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => setDraft({ ...draft, featured: event.target.checked })}
              className="h-4 w-4 rounded border-white/10 bg-transparent"
            />
            Featured post
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/8 pt-4">
          <p className="text-xs text-slate-500">
            SEO fields, canonical path, images, and content JSON all persist to local JSON and Neon Postgres.
          </p>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-50 transition hover:bg-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save post'}
          </button>
        </div>
      </div>

      <style jsx global>{`
        .field-input {
          width: 100%;
          border-radius: 1rem;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(0, 0, 0, 0.24);
          padding: 0.75rem 0.9rem;
          color: white;
          outline: none;
        }
        .field-input:focus {
          border-color: rgba(236, 72, 153, 0.35);
          box-shadow: 0 0 0 1px rgba(236, 72, 153, 0.12);
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
    <label className={`block space-y-2 ${className}`}>
      <span className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">{label}</span>
      {children}
    </label>
  )
}
