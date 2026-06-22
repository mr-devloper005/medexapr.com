import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const compactRaw = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || 'Open the full post for more detail.'

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 4 === 0

  return (
    <Link href={href} className={`group block rounded-[0.35rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(53,42,32,0.1)] sm:p-6 ${strong ? 'md:col-span-2' : ''}`}>
      <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">{taskLabel}</span>
      <h2 className="editorial-serif mt-4 line-clamp-3 text-2xl leading-[1.08] tracking-[-0.03em] text-[var(--slot4-dark-bg)] sm:text-[2rem]">{post.title}</h2>
      <p className={`mt-4 text-sm leading-7 text-black/65 ${strong ? 'line-clamp-4 max-w-3xl' : 'line-clamp-3'}`}>{summary}</p>
      <span className="mt-5 inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-black/55 group-hover:text-[var(--slot4-accent)]">Open result <ArrowRight className="h-4 w-4" /></span>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf2] text-black">
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
            <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.search.hero.badge}</p>
                <h1 className="editorial-serif mt-5 text-5xl leading-[0.94] tracking-[-0.05em] sm:text-7xl">{pagesContent.search.hero.title}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/75">{pagesContent.search.hero.description}</p>
              </div>
              <form action="/search" className="self-center rounded-[0.45rem] border border-white/12 bg-white/8 p-6 backdrop-blur-sm sm:p-8 lg:p-10">
                <input type="hidden" name="master" value="1" />
                <label className="flex items-center gap-3 border border-white/18 bg-white px-4 py-3 text-black">
                  <Search className="h-5 w-5 opacity-45" />
                  <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-current/35" />
                </label>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="flex items-center gap-2 border border-white/18 bg-white px-4 py-3 text-black">
                    <Filter className="h-4 w-4 opacity-45" />
                    <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-current/35" />
                  </label>
                  <select name="task" defaultValue={task} className="border border-white/18 bg-white px-4 py-3 text-sm text-black outline-none">
                    <option value="">All content types</option>
                    {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                  </select>
                </div>
                <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-[0.35rem] bg-[var(--slot4-accent-fill)] px-6 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent)]" type="submit">Search</button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[color:rgba(138,95,65,0.18)] pb-8">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/50">{results.length} results</p>
              <h2 className="editorial-serif mt-2 text-4xl leading-tight tracking-[-0.04em] text-[var(--slot4-dark-bg)]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-[0.35rem] border border-[color:rgba(138,95,65,0.24)] bg-white px-5 py-3 text-xs uppercase text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 border border-dashed border-[color:rgba(138,95,65,0.28)] bg-white p-10 text-center">
              <p className="text-2xl tracking-[-0.04em] text-[var(--slot4-dark-bg)]">No matching posts found.</p>
              <p className="mt-3 text-sm text-black/60">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
