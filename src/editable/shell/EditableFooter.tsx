'use client'

import Link from 'next/link'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="mt-0 bg-[var(--slot4-dark-bg)] text-white">
      <div className="mx-auto max-w-[1180px] px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-5 border-b border-white/12 pb-10">
          <Link href="/contact" className="rounded-[0.35rem] bg-[var(--slot4-accent-fill)] px-8 py-4 text-sm font-semibold transition hover:bg-[var(--slot4-accent)]">Submit Press Release</Link>
          </div>

        <div className="grid gap-10 py-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-base font-semibold">{SITE_CONFIG.name}</h3>
            <p className="mt-4 max-w-xs text-sm leading-7 text-white/65">
              {globalContent.footer?.description || 'Media distribution, business visibility, and timely public-facing updates in one refined publication space.'}
            </p>
          </div>

          <div>
            <h3 className="text-base font-semibold">Press Release Distribution</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              <Link href="/signup" className="transition hover:text-white">Submit Press Release</Link>
              <Link href="/search" className="transition hover:text-white">Distribution Archive</Link>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Account</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              {session ? (
                <>
                  <Link href="/create" className="transition hover:text-white">Open Publisher Desk</Link>
                  <button type="button" onClick={logout} className="text-left transition hover:text-white">Sign Out</button>
                </>
              ) : (
                <>
                  <Link href="/signup" className="transition hover:text-white">Create Free Account</Link>
                   </>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold">Resources</h3>
            <div className="mt-4 grid gap-3 text-sm text-white/72">
              <Link href="/contact" className="transition hover:text-white">Contact</Link>
              <Link href="/about" className="transition hover:text-white">About</Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-white/12 pt-8 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {SITE_CONFIG.name}. Media distribution and public information.</p>
              
        </div>
      </div>
    </footer>
  )
}
