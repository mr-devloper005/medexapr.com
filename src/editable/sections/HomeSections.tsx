import Link from 'next/link'
import { ArrowRight, Search } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { editableDesignContract as dc } from '@/editable/layouts/design-contract'
import { CompactIndexCard, EditorialFeatureCard, getEditableCategory, getEditableExcerpt, getEditablePostImage, postHref, RailPostCard } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
  visualPosts?: SitePost[]
  visualRoute?: string
}

function taskLabel(task: TaskKey) {
  return SITE_CONFIG.tasks.find((item) => item.key === task)?.label || task
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const lead = posts[0]
  const highlights = posts.slice(1, 4)

  return (
    <section className="bg-transparent text-black">
      <div className={`${dc.shell.section} pb-10 pt-4 sm:pb-14 sm:pt-6 lg:pb-20`}>
        <div className="grid gap-10">
          <div className="flex flex-col items-center px-2 pt-8 text-center sm:pt-14">
            <h1 className={`${dc.type.heroTitle} max-w-4xl text-balance text-black`}>
              Distribute your news everywhere
            </h1>
            <p className="mt-7 max-w-3xl text-xl leading-9 text-black/82 sm:text-[2rem] sm:leading-[1.45]">
              Reach publishers, partners, and media contacts through a polished distribution platform built for visibility.
            </p>
            <div className="mt-10 space-y-1 text-lg leading-9 text-black/72">
              <p>Boost your business</p>
              <p>Improve brand recognition</p>
              <p>Gain exposure with your target market</p>
            </div>
            <div className="mt-12 flex flex-wrap justify-center gap-6">
              <Link href="/contact" className="min-w-[230px] rounded-[0.35rem] bg-[rgba(167,127,96,0.55)] px-8 py-4 text-center text-xl font-semibold transition hover:bg-[rgba(167,127,96,0.72)]">Submit Press Release</Link>
            </div>
          </div>

          {lead ? (
            <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
              <div className="overflow-hidden rounded-[0.35rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-[0_16px_40px_rgba(45,49,87,0.08)]">
                <EditorialFeatureCard post={lead} href={postHref(primaryTask, lead, primaryRoute)} label="Featured release" />
              </div>
              <div className="grid gap-5">
                {highlights.map((post, index) => (
                  <Link
                    key={post.id}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group min-h-[152px] rounded-[0.35rem] border border-[color:rgba(138,95,65,0.16)] bg-white p-5 transition hover:bg-[var(--slot4-accent-soft)]/40"
                  >
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--slot4-accent)]">0{index + 1} {getEditableCategory(post)}</p>
                      <h2 className="editorial-serif mt-3 line-clamp-3 text-2xl leading-tight tracking-[-0.03em] text-black">{post.title}</h2>
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-black/70">{getEditableExcerpt(post, 88)}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  )
}

function hasPosterImage(post?: SitePost) {
  const image = getEditablePostImage(post)
  return Boolean(image) && !image.includes('/placeholder.svg')
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts, visualPosts = [], visualRoute }: HomeSectionProps) {
  const main = visualPosts.find(hasPosterImage) || posts.find(hasPosterImage) || posts[1] || posts[0]
  const sideLead = visualPosts.find((post) => post.id !== main?.id && hasPosterImage(post)) || posts.find((post) => post.id !== main?.id && hasPosterImage(post)) || posts[2] || posts[1]
  const sideCopy = posts[3] || posts[2]
  if (!main) return null
  const mainRoute = visualPosts.some((post) => post.id === main.id) ? (visualRoute || primaryRoute) : primaryRoute
  const sideLeadRoute = visualPosts.some((post) => post.id === sideLead?.id) ? (visualRoute || primaryRoute) : primaryRoute

  return (
    <section className="bg-[#fffaf2]">
      <div className={`${dc.shell.section} grid gap-16 py-16 lg:grid-cols-[1fr_.88fr] lg:py-24`}>
        <div>
          <h2 className="editorial-serif max-w-md text-5xl leading-[1.04] tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-6xl">
            Press release distribution
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
            Distribute announcements through a refined publishing flow designed to keep messaging clear, searchable, and ready for public discovery.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
            From launch updates to brand news, the archive stays organized so readers can browse recent coverage and find useful context quickly.
          </p>
          <Link href={main ? postHref(primaryTask, main, primaryRoute) : primaryRoute} className="mt-10 inline-flex rounded-[0.35rem] border border-[var(--slot4-dark-bg)] px-8 py-4 text-lg text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">
            Learn about press release distribution
          </Link>
        </div>

        <div className="self-center">
          <Link href={postHref(primaryTask, main, mainRoute)} className="block overflow-hidden rounded-[0.35rem] bg-white shadow-[0_16px_40px_rgba(45,49,87,0.12)]">
            <img src={getEditablePostImage(main)} alt={main.title} className="aspect-[6/4] w-full object-cover" />
          </Link>
        </div>
      </div>

      <div className={`${dc.shell.section} grid gap-16 py-6 pb-20 lg:grid-cols-[.88fr_1fr] lg:py-8 lg:pb-24`}>
        <div className="self-center">
          <Link href={sideLead ? postHref(primaryTask, sideLead, sideLeadRoute) : primaryRoute} className="block overflow-hidden rounded-[0.35rem] bg-white shadow-[0_16px_40px_rgba(45,49,87,0.12)]">
            <img src={getEditablePostImage(sideLead)} alt={sideLead?.title || 'Business profile'} className="aspect-[6/4] w-full object-cover" />
          </Link>
        </div>
        <div>
          <h2 className="editorial-serif max-w-md text-5xl leading-[1.04] tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-6xl">
            Post your business profile
          </h2>
          <p className="mt-8 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
            Create a company profile with descriptions, media, and useful details so your business stays visible alongside current stories and releases.
          </p>
          <p className="mt-6 max-w-xl text-lg leading-9 text-[var(--slot4-muted-text)]">
            Profiles and related posts work together to help visitors move from awareness to action without leaving the site experience.
          </p>
          <Link href={sideCopy ? postHref(primaryTask, sideCopy, primaryRoute) : '/profile'} className="mt-10 inline-flex rounded-[0.35rem] border border-[var(--slot4-dark-bg)] px-8 py-4 text-lg text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">
            Learn about business profiles
          </Link>
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const quotes = posts.slice(4, 7)
  if (!quotes.length) return null

  return (
    <section className="bg-[#f5f3f0]">
      <div className="mx-auto max-w-[980px] px-4 py-14 text-center sm:px-6 lg:py-20">
        <h2 className="editorial-serif text-4xl leading-tight tracking-[-0.03em] text-[var(--slot4-dark-bg)] sm:text-6xl">
          Over 250,000 companies, both big and small,
          <br />
          have trusted {SITE_CONFIG.name} to help grow their business
        </h2>
      </div>

      <div className={`${dc.shell.section} border-t border-[color:rgba(138,95,65,0.16)] py-16 text-center lg:py-24`}>
        <h2 className="editorial-serif text-5xl tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-6xl">Client success stories</h2>
        <div className="mx-auto mt-16 grid max-w-[760px] gap-16">
          {quotes.map((post, index) => (
            <div key={post.id || `${post.slug}-${index}`} className="space-y-5">
              <p className="text-2xl leading-[1.65] text-[var(--slot4-dark-bg)]">&quot;{getEditableExcerpt(post, 220)}&quot;</p>
              <p className="text-sm font-semibold text-[var(--slot4-muted-text)]">{post.title}</p>
              <div className="mx-auto h-9 w-16 rounded-full border-2 border-[#2a80c9] text-[#2a80c9]" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const collected = timeSections.flatMap((section) => section.posts)
  const source = collected.length ? collected : posts
  const listPosts = source.slice(0, 5)
  const categoryPosts = source.slice(5, 15)

  return (
    <section className="bg-[#fffaf2]">
      <div className={`${dc.shell.section} py-16 lg:py-24`}>
        <div className="grid gap-12 border-t border-[color:rgba(138,95,65,0.18)] pt-14 lg:grid-cols-[1.45fr_.9fr]">
          <div>
            <h2 className="editorial-serif text-5xl tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-6xl">Recent Press Releases</h2>
            <div className="mt-8 grid gap-0">
              {listPosts.map((post, index) => (
                <Link key={post.id || `${post.slug}-${index}`} href={postHref(primaryTask, post, primaryRoute)} className="group grid gap-4 border-b border-[color:rgba(138,95,65,0.18)] py-5">
                  <div className="min-w-0">
                    <h3 className={`leading-[1.24] tracking-[-0.02em] text-[var(--slot4-dark-bg)] ${index === 0 ? 'text-3xl font-semibold' : 'text-[1.8rem] font-medium'}`}>{post.title}</h3>
                    <p className={`mt-3 max-w-xl text-sm leading-7 text-[var(--slot4-muted-text)] ${index === 0 ? '' : 'line-clamp-2'}`}>{getEditableExcerpt(post, index === 0 ? 110 : 120)}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link href={primaryRoute} className="mt-8 inline-flex rounded-[0.35rem] bg-[var(--slot4-dark-bg)] px-8 py-4 text-lg text-white transition hover:bg-[var(--slot4-accent-fill)]">
              View all recent press releases
            </Link>
          </div>

          <aside className="space-y-10">
            <div>
              <h2 className="editorial-serif text-5xl tracking-[-0.04em] text-[var(--slot4-dark-bg)]">For Journalists</h2>
              <p className="mt-8 text-lg leading-9 text-[var(--slot4-muted-text)]">
                Stay on top of current releases, industry updates, and category-specific stories through a cleaner reading queue.
              </p>
              <p className="mt-6 text-lg leading-9 text-[var(--slot4-muted-text)]">
                Browse by topic, scan headlines quickly, and move into full stories when a release matches your coverage focus.
              </p>
              <Link href="/contact" className="mt-8 inline-flex rounded-[0.35rem] border border-[var(--slot4-dark-bg)] px-8 py-4 text-lg text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">
                Get news alerts
              </Link>
            </div>

            <div>
              <h2 className="editorial-serif text-5xl tracking-[-0.04em] text-[var(--slot4-dark-bg)]">News by Category</h2>
              <div className="mt-7 grid grid-cols-2 gap-x-8 gap-y-4 text-lg text-[var(--slot4-dark-bg)]">
                {Array.from(new Set(categoryPosts.map((post) => getEditableCategory(post)))).slice(0, 12).map((category) => (
                  <Link key={category} href={`/search?category=${encodeURIComponent(category.toLowerCase().replace(/\s+/g, '-'))}`} className="transition hover:text-[var(--slot4-accent)]">
                    {category}
                  </Link>
                ))}
              </div>
              <Link href="/search" className="mt-8 inline-flex rounded-[0.35rem] border border-[var(--slot4-dark-bg)] px-8 py-4 text-lg text-[var(--slot4-dark-bg)] transition hover:bg-[var(--slot4-dark-bg)] hover:text-white">
                View all news categories
              </Link>
            </div>
          </aside>
        </div>

        <div className="mt-20 grid gap-8 rounded-[0.5rem] border border-[color:rgba(138,95,65,0.18)] bg-[#f8f1e5] p-6 lg:grid-cols-[1fr_auto] lg:items-center lg:p-9">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-accent)]">Search the archive</p>
            <h3 className="editorial-serif mt-3 text-4xl tracking-[-0.03em] text-[var(--slot4-dark-bg)]">Find releases, profiles, and public updates in one place.</h3>
            <p className="mt-3 text-base leading-7 text-[var(--slot4-muted-text)]">Explore every {taskLabel(primaryTask).toLowerCase()} with quick search and category filters.</p>
          </div>
          <form action="/search" className="flex max-w-full border border-[var(--slot4-dark-bg)] bg-white lg:min-w-[420px]">
            <Search className="ml-4 mt-4 h-4 w-4 text-[var(--slot4-dark-bg)]" />
            <input name="q" placeholder="Search stories" className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none" />
            <button className="bg-[var(--slot4-dark-bg)] px-5 text-xs uppercase tracking-[.14em] text-white">Search</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-transparent pb-0 text-black">
      <div className={`${dc.shell.section} py-14`}>
        <div className="grid gap-4 rounded-[0.45rem] border border-[color:rgba(138,95,65,0.14)] bg-[rgba(255,255,255,0.3)] p-8 backdrop-blur-sm lg:grid-cols-[1.1fr_.9fr] lg:p-10">
          <div>
            <p className="text-[10px] uppercase tracking-[0.24em] text-[var(--slot4-accent-soft)]">Stay informed</p>
            <h2 className="editorial-serif mt-4 max-w-xl text-4xl leading-[1.04] tracking-[-0.04em] text-black sm:text-5xl">The stories shaping what comes next.</h2>
          </div>
          <div className="flex flex-col justify-center">
            <p className="max-w-xl text-lg leading-8 text-black/74">Fresh releases, market updates, directory visibility, and useful public information in one premium editorial experience.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact" className={dc.button.accent}>Send a tip</Link>
              <Link href="/signup" className="rounded-[0.35rem] border border-black/25 px-7 py-3.5 text-xs uppercase tracking-[.12em] text-black transition hover:bg-black hover:text-white">Join the readership</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
