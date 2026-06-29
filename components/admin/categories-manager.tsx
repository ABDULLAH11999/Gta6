'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilLine, Plus, Trash2 } from 'lucide-react'
import type { BlogCategory } from '@/lib/types'

type Draft = {
  id?: string
  name: string
  slug: string
  description: string
  accent: string
  order: number
  icon: string
}

function toDraft(category: BlogCategory): Draft {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    description: category.description,
    accent: category.accent,
    order: category.order,
    icon: category.icon ?? '',
  }
}

function emptyDraft(): Draft {
  return {
    name: '',
    slug: '',
    description: '',
    accent: 'from-fuchsia-500 to-violet-500',
    order: 0,
    icon: '',
  }
}

export function CategoriesManager({ categories }: Readonly<{ categories: BlogCategory[] }>) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(() => emptyDraft())
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      const payload = { ...draft }
      const response = await fetch(draft.id ? `/api/admin/categories/${draft.id}` : '/api/admin/categories', {
        method: draft.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Could not save the category.')
      }

      router.refresh()
      if (!draft.id) {
        setDraft(emptyDraft())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save the category.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this category?')) return
    setSaving(true)
    setError('')
    try {
      const response = await fetch(`/api/admin/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) throw new Error('Could not delete the category.')
      router.refresh()
      if (draft.id === id) {
        setDraft(emptyDraft())
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete the category.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="flex items-center justify-between gap-3 border-b border-white/8 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">Categories</p>
            <h3 className="mt-1 text-xl font-black text-white">Category CRUD</h3>
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyDraft())}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
          >
            <Plus className="h-4 w-4 text-fuchsia-200" />
            New category
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="rounded-[1.5rem] border border-white/8 bg-black/20 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-500">
                    Order {category.order} • {category.slug}
                  </p>
                  <h4 className="mt-1 text-sm font-bold text-white">{category.name}</h4>
                  <p className="mt-2 text-xs leading-6 text-slate-400 line-clamp-3">{category.description}</p>
                </div>
                <div className="flex shrink-0 flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setDraft(toDraft(category))}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 transition hover:border-fuchsia-400/25 hover:text-white"
                  >
                    <PencilLine className="h-3.5 w-3.5" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => void handleDelete(category.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-rose-400/20 px-3 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-rose-200 transition hover:bg-rose-500/10"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-[1.7rem] border border-white/10 bg-white/[0.03] p-4">
        <div className="border-b border-white/8 pb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-fuchsia-200">
            {draft.id ? 'Edit category' : 'Create category'}
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            {draft.id ? draft.name || 'Category' : 'New GTA 6 category'}
          </h3>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Field label="Name">
            <input value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} className="field-input" />
          </Field>
          <Field label="Slug">
            <input value={draft.slug} onChange={(event) => setDraft({ ...draft, slug: event.target.value })} className="field-input" />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <textarea rows={4} value={draft.description} onChange={(event) => setDraft({ ...draft, description: event.target.value })} className="field-input" />
          </Field>
          <Field label="Accent">
            <input value={draft.accent} onChange={(event) => setDraft({ ...draft, accent: event.target.value })} className="field-input" />
          </Field>
          <Field label="Order">
            <input type="number" value={draft.order} onChange={(event) => setDraft({ ...draft, order: Number(event.target.value) })} className="field-input" />
          </Field>
          <Field label="Icon" className="md:col-span-2">
            <input value={draft.icon} onChange={(event) => setDraft({ ...draft, icon: event.target.value })} className="field-input" />
          </Field>
        </div>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
          <p className="text-xs text-slate-500">These categories drive the home-page filters, post forms, and URL filtering.</p>
          <button
            type="button"
            onClick={() => void handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full border border-fuchsia-400/30 bg-fuchsia-500/15 px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-fuchsia-50 transition hover:bg-fuchsia-500/25 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save category'}
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
