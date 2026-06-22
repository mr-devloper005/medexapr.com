import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf2] text-[#1f1c1a]">
        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid min-h-[calc(100vh-16rem)] overflow-hidden rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white shadow-sm lg:grid-cols-[1.02fr_0.98fr]">
            <div className="flex flex-col justify-center bg-[var(--slot4-dark-bg)] p-8 text-white sm:p-12 lg:p-16">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.auth.login.badge}</p>
              <h1 className="editorial-serif mt-5 max-w-xl text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl">{pagesContent.auth.login.title}</h1>
              <p className="mt-6 max-w-lg text-base leading-8 text-white/72">{pagesContent.auth.login.description}</p>
            </div>
            <div className="flex flex-col justify-center p-7 sm:p-12 lg:p-16">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Member access</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-tight tracking-[-0.04em] text-[var(--slot4-dark-bg)]">{pagesContent.auth.login.formTitle}</h2>
              <EditableLocalLoginForm />
              <p className="mt-6 border-t border-[color:rgba(138,95,65,0.18)] pt-5 text-sm text-black/65">New here? <Link href="/signup" className="font-semibold text-[var(--slot4-accent)] underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
