'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  profile: Sparkles,
  pdf: FileText,
  sbm: ArrowRight,
}

const fieldClass = 'w-full border border-[color:rgba(138,95,65,0.22)] bg-[#fffdf8] px-4 py-3 text-sm text-black outline-none transition placeholder:text-black/35 focus:border-[var(--slot4-accent)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[#fffaf2] px-4 py-12 text-[#1f1c1a] sm:px-6 lg:px-8 lg:py-16">
          <section className="mx-auto grid max-w-[1180px] overflow-hidden rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm lg:grid-cols-[0.92fr_1.08fr]">
            <div className="flex min-h-[22rem] items-center justify-center bg-[var(--slot4-dark-bg)] text-white">
              <Lock className="h-20 w-20 opacity-80" />
            </div>
            <div className="self-center p-8 sm:p-12 lg:p-16">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editorial-serif mt-5 max-w-3xl text-5xl leading-[0.96] tracking-[-0.05em] text-[var(--slot4-dark-bg)] sm:text-6xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-black/68">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-[0.35rem] bg-[var(--slot4-dark-bg)] px-6 py-3 text-sm text-white transition hover:bg-[var(--slot4-accent-fill)]">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-[0.35rem] border border-[color:rgba(138,95,65,0.22)] bg-white px-6 py-3 text-sm text-[var(--slot4-dark-bg)] transition hover:bg-[#f8f1e5]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf2] text-[#1f1c1a]">
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
              <aside>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.create.hero.badge}</p>
                <h1 className="editorial-serif mt-5 max-w-3xl text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">{pagesContent.create.hero.title}</h1>
                <p className="mt-6 max-w-xl text-base leading-8 text-white/72">{pagesContent.create.hero.description}</p>
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {enabledTasks.map((item) => {
                    const Icon = taskIcon[item.key] || FileText
                    const active = item.key === task
                    return (
                      <button key={item.key} type="button" onClick={() => setTask(item.key)} className={`border p-4 text-left transition ${active ? 'border-[var(--slot4-accent-soft)] bg-white text-[var(--slot4-dark-bg)]' : 'border-white/15 bg-white/6 text-white hover:bg-white/10'}`}>
                        <Icon className="h-5 w-5" />
                        <span className="mt-3 block text-sm">{item.label}</span>
                        <span className="mt-1 block text-xs opacity-70">{item.description}</span>
                      </button>
                    )
                  })}
                </div>
              </aside>

              <div className="self-end rounded-[0.45rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/12 pb-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-[var(--slot4-accent-soft)]">Create {activeTask?.label || 'post'}</p>
                    <h2 className="editorial-serif mt-1 text-3xl tracking-[-0.04em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="border border-white/18 bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.16em]">{session.name}</span>
                </div>
                <p className="mt-4 text-sm leading-7 text-white/70">Prepare your content with a clear title, short summary, source link, media, and the full body copy.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <form onSubmit={submit} className="rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
            <div className="grid gap-4">
              <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Post title" required />
              <div className="grid gap-4 sm:grid-cols-2">
                <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Category" />
                <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Website or source URL" />
              </div>
              <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Featured image URL" />
              <textarea className={`${fieldClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary" required />
              <textarea className={`${fieldClass} min-h-56`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Main content, details, notes, or description" required />
            </div>

            {created ? (
              <div className="mt-5 border border-emerald-200 bg-emerald-50 p-4 text-emerald-900">
                <p className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-5 w-5" /> {pagesContent.create.successTitle}</p>
                <p className="mt-1 text-sm opacity-80">{created.title}</p>
              </div>
            ) : null}

            <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-[0.35rem] bg-[var(--slot4-dark-bg)] px-6 text-sm uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent-fill)]">
              <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
            </button>
          </form>
        </section>
      </main>
    </EditableSiteShell>
  )
}
