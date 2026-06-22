import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Image as ImageIcon, MapPin, Megaphone, Search, Newspaper, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => post.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
const asText = (value: unknown) => typeof value === 'string' ? value.trim() : ''
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => {
  const raw = post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
  return raw || 'Open the full post to explore the details.'
}
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  mediaDistribution: { icon: Newspaper, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Publication-ready cards make recent releases easy to scan and open.', badge: 'News' },
  article: { icon: FileText, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Editorial cards prioritize headlines, images, and clear summaries.', badge: 'Read' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Business cards highlight identity, services, location, and contact cues.', badge: 'Business' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offer cards keep pricing, availability, and next actions easy to spot.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Visual-first browsing with image-led cards and compact captions.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources remain clean, compact, and fast to scan.', badge: 'Bookmark' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Document cards surface context, type, and download intent.', badge: 'PDF' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profile cards keep people and companies recognizable at a glance.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = {
    '--archive-bg': '#fffaf2',
    '--archive-text': '#2d3157',
    '--archive-surface': '#fffdf8',
    '--archive-accent': '#8A5F41',
  } as CSSProperties
  const dynamicCategories = Array.from(new Map([
    ...CATEGORY_OPTIONS,
    ...posts.map((post) => {
      const raw = getCategory(post, '')
      return raw ? { name: raw, slug: normalizeCategory(raw) } : null
    }).filter((item): item is { name: string; slug: string } => Boolean(item)),
  ].map((item) => [item.slug, item])).values())
  const categoryLabel = category === 'all' ? 'All categories' : dynamicCategories.find((item) => item.slug === category)?.name || category

  if (task === 'mediaDistribution' || task === 'article') {
    return (
      <EditorialArchive
        posts={posts}
        pagination={pagination}
        category={category}
        categoryLabel={categoryLabel}
        categories={dynamicCategories}
        basePath={basePath}
        label={label}
      />
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="border-b border-[color:rgba(138,95,65,0.14)] bg-[#f8f1e5]">
          <div className="mx-auto grid max-w-[1180px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[color:rgba(138,95,65,0.22)] bg-white px-4 py-2 text-xs uppercase tracking-[0.24em] text-[var(--archive-accent)]"><Icon className="h-4 w-4" /> {label}</div>
              <h1 className="editorial-serif mt-5 max-w-4xl text-5xl leading-[0.98] tracking-[-0.05em] text-[var(--archive-text)] sm:text-6xl">{voice?.headline || `Browse ${label}`}</h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-[color:rgba(31,28,26,0.68)]">{voice?.description || SITE_CONFIG.description}</p>
              <div className="mt-6 rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-4 text-sm leading-7 text-[color:rgba(31,28,26,0.68)]">{deck.promise}</div>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={basePath} className="rounded-[0.35rem] bg-[var(--archive-text)] px-5 py-3 text-sm font-semibold text-white">Browse all</Link>
                <Link href="/search" className="rounded-[0.35rem] border border-[color:rgba(138,95,65,0.3)] px-5 py-3 text-sm font-semibold">Search posts</Link>
              </div>
            </div>

            <form action={basePath} className="self-end rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[color:rgba(31,28,26,0.56)]"><Filter className="h-4 w-4" /> Filter</div>
              <select name="category" defaultValue={category} className="mt-4 h-12 w-full border border-[color:rgba(138,95,65,0.25)] bg-white px-4 text-sm outline-none">
                <option value="all">All categories</option>
                {dynamicCategories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full bg-[var(--archive-text)] text-sm font-semibold text-white">Apply</button>
              <p className="mt-3 text-xs text-[color:rgba(31,28,26,0.56)]">Showing: {categoryLabel}</p>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 pb-16 pt-10 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[0.45rem] border border-dashed border-[color:rgba(138,95,65,0.26)] bg-white p-10 text-center">
              <Search className="mx-auto h-8 w-8 opacity-45" />
              <h2 className="editorial-serif mt-4 text-3xl">No posts found</h2>
              <p className="mt-2 text-sm text-[color:rgba(31,28,26,0.65)]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-0">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[color:rgba(138,95,65,0.3)] bg-white px-5 py-3 text-xs uppercase">Previous</Link> : null}
            <span className="border-y border-[color:rgba(138,95,65,0.3)] bg-[var(--archive-text)] px-5 py-3 text-xs uppercase text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[color:rgba(138,95,65,0.3)] bg-white px-5 py-3 text-xs uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function EditorialArchive({
  posts,
  pagination,
  category,
  categoryLabel,
  categories,
  basePath,
  label,
}: {
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  categoryLabel: string
  categories: { name: string; slug: string }[]
  basePath: string
  label: string
}) {
  const page = pagination.page || 1
  const lead = posts[0]
  const secondary = posts.slice(1, 5)
  const remaining = posts.slice(5)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#fffaf2] text-[#1f1c1a]">
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[1180px] px-4 py-14 text-center sm:px-6 lg:px-8 lg:py-18">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">The newsroom</p>
            <h1 className="editorial-serif mt-6 text-5xl leading-[1.02] tracking-[-0.045em] sm:text-7xl">
              {category === 'all' ? `${label} archive` : categoryLabel}
            </h1>
            <p className="mx-auto mt-6 max-w-3xl text-lg leading-9 text-white/72">
              Timely reporting, business updates, and publication-ready stories organized for fast discovery.
            </p>
          </div>
        </section>

        <section className="border-b border-[color:rgba(138,95,65,0.16)] bg-white">
          <div className="mx-auto flex max-w-[1180px] gap-7 overflow-x-auto px-4 py-4 text-xs uppercase tracking-[0.16em] text-[var(--slot4-dark-bg)] sm:px-6 lg:px-8">
            <Link href={basePath} className={category === 'all' ? 'text-[var(--slot4-accent)]' : 'hover:text-[var(--slot4-accent)]'}>Latest</Link>
            {categories.slice(0, 10).map((item) => (
              <Link key={item.slug} href={pageHref(basePath, item.slug, 1)} className={category === item.slug ? 'whitespace-nowrap text-[var(--slot4-accent)]' : 'whitespace-nowrap hover:text-[var(--slot4-accent)]'}>
                {item.name}
              </Link>
            ))}
          </div>
        </section>

        {lead ? (
          <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <Link href={`${basePath}/${lead.slug}`} className="group overflow-hidden rounded-[0.4rem] bg-[var(--slot4-dark-bg)] text-white">
                <div className="relative min-h-[34rem]">
                  <img src={getImage(lead)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.025]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[rgba(18,20,39,0.95)] via-[rgba(18,20,39,0.2)] to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 sm:p-9">
                    <span className="bg-[var(--slot4-accent-fill)] px-3 py-2 text-[10px] uppercase tracking-[0.2em]">{getCategory(lead, label)}</span>
                    <h2 className="editorial-serif mt-5 max-w-4xl text-4xl leading-[1] tracking-[-0.04em] sm:text-6xl">{lead.title}</h2>
                    <p className="mt-5 max-w-2xl line-clamp-3 text-sm leading-7 text-white/78">{getSummary(lead)}</p>
                  </div>
                </div>
              </Link>

              <div className="overflow-hidden rounded-[0.4rem] border border-[color:rgba(138,95,65,0.18)] bg-white">
                <div className="border-b border-[color:rgba(138,95,65,0.18)] bg-[#f8f1e5] p-6">
                  <p className="text-xs uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Top stories</p>
                  <p className="editorial-serif mt-3 text-3xl leading-tight text-[var(--slot4-dark-bg)]">What the newsroom is watching now.</p>
                </div>
                {secondary.map((post, index) => (
                  <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group grid grid-cols-[6.25rem_1fr] border-b border-[color:rgba(138,95,65,0.18)] bg-white last:border-b-0">
                    <img src={getImage(post)} alt="" className="h-full min-h-32 w-full object-cover transition duration-500 group-hover:scale-105" />
                    <div className="p-5">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--slot4-accent)]">0{index + 1}</p>
                      <h3 className="editorial-serif mt-3 text-xl leading-tight text-[var(--slot4-dark-bg)]">{post.title}</h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="mx-auto max-w-[1180px] px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5 border-b border-[color:rgba(138,95,65,0.18)] pb-4">
            <h2 className="editorial-serif text-4xl tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-5xl">More from the desk</h2>
            <form action={basePath} className="flex border border-[color:rgba(138,95,65,0.3)] bg-white">
              <select name="category" defaultValue={category} className="h-11 min-w-44 bg-transparent px-3 text-xs uppercase outline-none">
                <option value="all">All categories</option>
                {categories.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="h-11 bg-[var(--slot4-dark-bg)] px-5 text-xs uppercase tracking-[0.14em] text-white">Filter</button>
            </form>
          </div>

          {remaining.length ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {remaining.map((post, index) => (
                <Link key={post.id || post.slug} href={`${basePath}/${post.slug}`} className="group overflow-hidden rounded-[0.35rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
                  <div className="aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
                    <img src={getImage(post)} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between gap-4 text-[10px] uppercase tracking-[0.18em] text-[var(--slot4-accent)]">
                      <span>{getCategory(post, label)}</span><span>{String(index + 5).padStart(2, '0')}</span>
                    </div>
                    <h3 className="editorial-serif mt-4 text-2xl leading-[1.08] text-[var(--slot4-dark-bg)]">{post.title}</h3>
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-[color:rgba(31,28,26,0.62)]">{getSummary(post)}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : !lead ? (
            <div className="border border-dashed border-[color:rgba(138,95,65,0.3)] bg-white p-12 text-center">
              <Search className="mx-auto h-8 w-8" />
              <h2 className="editorial-serif mt-4 text-3xl">No stories found</h2>
              <p className="mt-2 text-sm text-[color:rgba(31,28,26,0.62)]">Try another category or publish a new newsroom story.</p>
            </div>
          ) : null}

          <div className="mt-10 flex items-center justify-center gap-0">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="border border-[color:rgba(138,95,65,0.3)] bg-white px-5 py-3 text-xs uppercase">Previous</Link> : null}
            <span className="border-y border-[color:rgba(138,95,65,0.3)] bg-[var(--slot4-dark-bg)] px-5 py-3 text-xs uppercase text-white">Page {page} / {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="border border-[color:rgba(138,95,65,0.3)] bg-white px-5 py-3 text-xs uppercase">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[0.35rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
      <div className="relative aspect-[4/3] overflow-hidden bg-black/5">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        <span className="absolute left-4 top-4 bg-white px-3 py-1 text-[10px] uppercase tracking-[0.2em]">{category}</span>
      </div>
      <div className="p-5">
        <p className="text-[10px] uppercase tracking-[0.22em] text-[var(--archive-accent)]">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="editorial-serif mt-2 text-xl leading-tight text-[var(--archive-text)]">{post.title}</h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-[color:rgba(31,28,26,0.65)]">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[0.35rem] bg-[var(--archive-bg)] ring-1 ring-[color:rgba(138,95,65,0.18)]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="bg-[var(--archive-text)] px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 border border-[color:rgba(138,95,65,0.18)] px-3 py-1 text-[10px] uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[color:rgba(31,28,26,0.65)]">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs text-[color:rgba(31,28,26,0.72)] sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[var(--archive-text)] p-5 text-white">
          <span className="bg-white/15 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 text-3xl font-semibold leading-[1] tracking-[-0.05em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm text-white/75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-[0.35rem] object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-6 text-[color:rgba(31,28,26,0.65)]">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 bg-[var(--archive-bg)] px-3 py-1 text-[10px] uppercase tracking-[0.16em]"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 text-xl font-semibold leading-tight tracking-[-0.03em]">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-[var(--archive-text)] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="border border-current/20 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 opacity-70">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
      <div className="flex items-start justify-between gap-4">
        <div className="bg-[var(--archive-text)] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="bg-[var(--archive-bg)] px-3 py-1 text-[10px] uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 text-2xl font-semibold leading-tight tracking-[-0.04em]">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-6 text-[color:rgba(31,28,26,0.65)]">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  return (
    <Link href={href} className="group rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-6 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(53,42,32,0.12)]">
      <div className="mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-full bg-[var(--archive-bg)] ring-1 ring-[color:rgba(138,95,65,0.18)]">
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
      </div>
      <h2 className="mt-5 text-xl font-semibold leading-tight tracking-[-0.03em]">{post.title}</h2>
      {role ? <p className="mt-2 text-xs uppercase tracking-[0.16em] text-[var(--archive-accent)]">{role}</p> : null}
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-[color:rgba(31,28,26,0.65)]">{getSummary(post)}</p>
    </Link>
  )
}
