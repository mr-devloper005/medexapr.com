'use client'

import { FileText, Mail, Megaphone } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

const desks = [
  { icon: FileText, title: 'Editorial desk', body: 'Send story ideas, corrections, source material, and publication questions.' },
  { icon: Megaphone, title: 'Media partnerships', body: 'Discuss distribution, syndication, newsroom collaborations, and campaigns.' },
  { icon: Mail, title: 'General support', body: 'Reach out for publishing, account, or site support.' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#fffaf2] text-[#1f1c1a]">
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[1180px] px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--slot4-accent-soft)]">{pagesContent.contact.eyebrow}</p>
            <h1 className="editorial-serif mt-4 max-w-5xl text-5xl leading-[0.96] tracking-[-0.05em] sm:text-7xl lg:text-[5.1rem]">{pagesContent.contact.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-9 text-white/76">{pagesContent.contact.description}</p>
          </div>
        </section>

        <section className="mx-auto max-w-[1180px] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="grid gap-4">
              {desks.map((desk, index) => (
                <div key={desk.title} className="rounded-[0.45rem] bg-[var(--slot4-dark-bg)] p-6 text-white shadow-sm sm:p-7">
                  <div className="flex items-center justify-between">
                    <desk.icon className="h-5 w-5 text-[var(--slot4-accent-soft)]" />
                    <span className="text-[11px] uppercase tracking-[0.22em] text-white/45">0{index + 1}</span>
                  </div>
                  <h2 className="editorial-serif mt-6 text-3xl leading-tight tracking-[-0.03em]">{desk.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-white/68">{desk.body}</p>
                </div>
              ))}
            </aside>

            <div className="rounded-[0.45rem] border border-[color:rgba(138,95,65,0.18)] bg-white p-6 shadow-sm sm:p-10 lg:p-12">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Send a message</p>
              <h2 className="editorial-serif mt-3 text-4xl leading-tight tracking-[-0.04em] text-[var(--slot4-dark-bg)]">{pagesContent.contact.formTitle}</h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-black/65">Tell us what you are trying to publish, fix, or launch and we will route it through the right lane.</p>
              <EditableContactLeadForm />
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
