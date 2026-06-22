'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

const primaryLinks = [
  { label: '', href: '/listing' },
  { label: '', href: '/mediaDistribution' },
]

const utilityLinks = [
  { label: 'Join Now', href: '/signup' },
  { label: 'Sign In', href: '/login' },
]


export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <header className="sticky top-0 z-50 border-b border-[color:rgba(138,95,65,0.18)] bg-[var(--slot4-accent-soft)] text-black shadow-[0_18px_40px_rgba(19,21,35,0.08)]">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-[92px] items-center justify-between gap-4">
          <div className="flex items-center gap-3 lg:gap-7">
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/20 text-black lg:hidden"
              aria-label="Toggle navigation"
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>

            <Link href="/" className="flex items-center gap-4">
              <span>
                <img src="/favicon.png" width={70} height={80} alt={SITE_CONFIG.name} />
              </span>
              <span className="editorial-brand text-[2rem] font-bold leading-none tracking-[-0.07em] text-black sm:text-[2.3rem]">
                {SITE_CONFIG.name}
              </span>
            </Link>
            {!session ? (
              <div className="hidden items-center gap-7 text-[1.05rem] font-medium lg:flex">
                {utilityLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="transition hover:text-[var(--slot4-accent)]">
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          <div className="hidden items-center gap-9 lg:flex">
            {primaryLinks.map((item) => (
              <Link key={item.href} href={item.href} className="text-[1.05rem] font-medium transition hover:text-[var(--slot4-accent)]">
                {item.label}
              </Link>
            ))}
            <form action="/search" className="flex items-center gap-2 text-black/75">
              <button type="submit" aria-label="Search" className="transition hover:text-black">
                <Search className="h-4 w-4" />
              </button>
              <input
                name="q"
                type="search"
                placeholder="Search"
                className="w-24 border-b border-black/20 bg-transparent py-1 text-sm outline-none placeholder:text-black/45 focus:w-36"
              />
            </form>
            <Link
              href={session ? '/create' : '/signup'}
              className="rounded-[0.35rem] border border-black/40 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
            >
              {session ? 'Submit Release' : 'Create Account'}
            </Link>
            {session ? (
              <button
                type="button"
                onClick={logout}
                className="rounded-[0.35rem] border border-black/40 px-6 py-3 text-sm font-medium transition hover:bg-black hover:text-white"
              >
                Sign Out
              </button>
            ) : null}
            </div>
        </div>
      </div>

      {open ? (
        <div className="border-t border-black/10 bg-[var(--slot4-accent-soft)] lg:hidden">
          <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6">
            <form action="/search" className="mb-4 flex items-center border border-black/15 bg-white/50">
              <Search className="ml-3 h-4 w-4 text-black/55" />
              <input
                name="q"
                type="search"
                placeholder="Search the archive"
                className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-black/45"
              />
            </form>
            <div className="grid gap-2">
              {[...primaryLinks, ...(session ? [{ label: 'Publish', href: '/create' }] : utilityLinks), { label: 'Contact', href: '/contact' }].map((item) => (
                <Link
                  key={`${item.label}-${item.href}`}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="border border-black/15 bg-white/50 px-4 py-3 text-sm font-medium"
                >
                  {item.label}
                </Link>
              ))}
              {session ? (
                <button type="button" onClick={logout} className="border border-black/15 bg-white/50 px-4 py-3 text-left text-sm font-medium">
                  Sign Out
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  )
}
