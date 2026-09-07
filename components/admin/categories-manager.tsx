'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { PencilLine, Plus, Tag, Trash2 } from 'lucide-react'
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

const ACCENT_PRESETS = [
  { label: 'Neon Pink / Fuchsia', value: 'from-fuchsia-500 to-pink-500' },
  { label: 'Electric Cyan / Sky', value: 'from-cyan-500 to-blue-500' },
  { label: 'Vice Violet / Purple', value: 'from-violet-500 to-purple-500' },
  { label: 'Sunset Amber / Orange', value: 'from-amber-500 to-orange-500' },
  { label: 'Leonida Emerald / Teal', value: 'from-emerald-500 to-teal-500' },
  { label: 'Rose Gold', value: 'from-rose-500 to-pink-600' },
]

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
    accent: 'from-fuchsia-500 to-pink-500',
    order: 0,
    icon: 'tag',
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
    if (!confirm('Are you sure you want to delete this category?')) return
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
      {/* Category List */}
      <div className="rounded-[1.8rem] border border-cyan-500/20 bg-[#120c24]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">Taxonomy Structure</p>
            <h3 className="mt-1 text-xl font-black text-white">Categories ({categories.length})</h3>
          </div>
          <button
            type="button"
            onClick={() => setDraft(emptyDraft())}
            className="inline-flex items-center gap-2 rounded-full border border-cyan-500/40 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-cyan-200 transition hover:bg-cyan-500/30 hover:text-white shadow-[0_0_15px_rgba(6,182,212,0.2)]"
          >
            <Plus className="h-4 w-4 text-cyan-400" />
            New Category
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {categories.map((category) => {
            const active = category.id === draft.id
            return (
              <div
                key={category.id}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  active
                    ? 'border-cyan-500/50 bg-cyan-950/30 shadow-[0_0_20px_rgba(6,182,212,0.2)] scale-[1.01]'
                    : 'border-white/10 bg-black/40 hover:border-cyan-500/30 hover:bg-white/[0.03]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <button type="button" onClick={() => setDraft(toDraft(category))} className="text-left flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full bg-gradient-to-r ${category.accent}`} />
                      <p className="text-sm font-bold text-white">{category.name}</p>
                      <span className="font-mono text-[10px] text-zinc-500">/{category.slug}</span>
                    </div>
                    <p className="mt-1.5 text-xs text-zinc-400 leading-relaxed">{category.description}</p>
                  </button>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setDraft(toDraft(category))}
                      className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1.5 text-[10px] font-bold text-cyan-200 transition hover:bg-cyan-500/20"
                    >
                      <PencilLine className="h-3 w-3 text-cyan-400" />
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(category.id)}
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

      {/* Editor Form */}
      <div className="rounded-[1.8rem] border border-cyan-500/20 bg-[#120c24]/70 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.35)] backdrop-blur-md">
        <div className="border-b border-white/10 pb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.28em] text-cyan-400">
            {draft.id ? 'Edit Category' : 'Create Category'}
          </p>
          <h3 className="mt-1 text-xl font-black text-white">
            {draft.id ? draft.name : 'New GTA 6 Taxonomy Category'}
          </h3>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-rose-500/30 bg-rose-500/15 px-4 py-3 text-sm font-semibold text-rose-100">
            {error}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <label className="block space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Category Name</span>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="field-input"
              placeholder="e.g. Gameplay, Trailers, Weapons..."
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">URL Slug</span>
            <input
              value={draft.slug}
              onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
              className="field-input"
              placeholder="e.g. gameplay"
            />
          </label>

          <label className="block space-y-1.5">
            <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Description</span>
            <textarea
              rows={2}
              value={draft.description}
              onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              className="field-input"
              placeholder="Short description shown in category dropdowns..."
            />
          </label>

          <div>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">
              Neon Gradient Theme
            </span>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {ACCENT_PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => setDraft({ ...draft, accent: preset.value })}
                  className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-bold transition-all ${
                    draft.accent === preset.value
                      ? 'border-cyan-400 bg-cyan-950/40 text-white shadow-[0_0_10px_rgba(6,182,212,0.3)]'
                      : 'border-white/10 bg-black/30 text-zinc-400 hover:border-white/20'
                  }`}
                >
                  <span className={`h-3 w-3 rounded-full bg-gradient-to-r ${preset.value}`} />
                  <span className="truncate">{preset.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Icon Name</span>
              <input
                value={draft.icon}
                onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
                className="field-input"
                placeholder="e.g. gamepad-2, film, users"
              />
            </label>

            <label className="block space-y-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.24em] text-zinc-400">Display Order</span>
              <input
                type="number"
                value={draft.order}
                onChange={(e) => setDraft({ ...draft, order: Number(e.target.value) })}
                className="field-input"
              />
            </label>
          </div>

          <div className="flex items-center justify-between border-t border-white/10 pt-4">
            <p className="text-[11px] text-zinc-400">Updates live navigation pills immediately.</p>
            <button
              type="button"
              onClick={() => void handleSave()}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-cyan-500/50 bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-white transition hover:opacity-90 disabled:opacity-50 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {saving ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
