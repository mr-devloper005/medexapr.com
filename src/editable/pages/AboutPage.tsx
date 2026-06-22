import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf2] text-[#1f1c1a]">
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.about.badge}</p>
            <h1 className="editorial-serif mt-5 max-w-5xl text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl lg:text-[5.4rem]">
              A clearer, more refined way to present public stories and business visibility.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-white/75">{pagesContent.about.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            <article className="rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-7 shadow-sm sm:p-10 lg:p-12">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--slot4-accent)]">About {SITE_CONFIG.name}</p>
              <h2 className="editorial-serif mt-4 text-4xl leading-tight tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-5xl">
                {pagesContent.about.title}
              </h2>
              <div className="article-content mt-8 space-y-6">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
            </article>

            <aside className="grid gap-4">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className="rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-[#f8f1e5] p-6 shadow-sm sm:p-7">
                  <p className="text-[11px] uppercase tracking-[0.24em] text-[var(--slot4-accent)]">0{index + 1}</p>
                  <h2 className="editorial-serif mt-3 text-3xl leading-tight tracking-[-0.03em] text-[var(--slot4-dark-bg)]">{value.title}</h2>
                  <p className="mt-4 text-sm leading-7 text-black/68">{value.description}</p>
                </div>
              ))}
            </aside>
          </div>
        </section>

        <section className="border-y border-[color:rgba(138,95,65,0.14)] bg-[#f8f1e5]">
          <div className="mx-auto flex max-w-[1180px] flex-col gap-6 px-4 py-12 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <h2 className="editorial-serif max-w-3xl text-4xl leading-[1.02] tracking-[-0.04em] text-[var(--slot4-dark-bg)] sm:text-5xl">
              Read the stories shaping the conversation.
            </h2>
            <Link href="/search" className="inline-flex w-fit rounded-[0.35rem] bg-[var(--slot4-dark-bg)] px-6 py-4 text-xs uppercase tracking-[0.18em] text-white transition hover:bg-[var(--slot4-accent-fill)]">
              Explore the archive
            </Link>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
