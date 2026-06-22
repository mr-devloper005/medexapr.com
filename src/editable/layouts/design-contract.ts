import type { CSSProperties } from 'react'

export const editableRootStyle = {
  '--slot4-page-bg': '#f7f0e4',
  '--slot4-page-text': '#1f1c1a',
  '--slot4-panel-bg': '#efe3d0',
  '--slot4-surface-bg': '#fffaf2',
  '--slot4-muted-text': '#65584b',
  '--slot4-soft-muted-text': '#8d7f70',
  '--slot4-accent': '#8A5F41',
  '--slot4-accent-fill': '#A77F60',
  '--slot4-accent-soft': '#F3E4C9',
  '--slot4-dark-bg': '#2d3157',
  '--slot4-dark-text': '#fdf8ef',
  '--slot4-media-bg': '#e2d4bf',
  '--slot4-cream': '#F3E4C9',
  '--slot4-warm': '#fffdf8',
  '--slot4-lavender': '#CCD67F',
  '--slot4-gray': '#ebe1d3',
  '--slot4-olive': '#CCD67F',
  '--slot4-body-gradient': 'linear-gradient(180deg, #2d3157 0%, #2d3157 34rem, #fffaf2 34rem, #f7f0e4 100%)',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[color:rgba(138,95,65,0.24)]',
  darkBorder: 'border-white/18',
  shadow: 'shadow-[0_16px_40px_rgba(53,42,32,0.08)]',
  shadowStrong: 'shadow-[0_26px_90px_rgba(31,28,26,0.18)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(18,20,36,0.08),rgba(18,20,36,0.88))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[1180px] px-4 sm:px-6 lg:px-8',
    sectionY: 'py-12 sm:py-16 lg:py-20',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start',
    rail: 'grid gap-4 md:grid-cols-2 xl:grid-cols-4',
    minRailCard: 'min-w-0',
  },
  type: {
    eyebrow: 'text-[11px] font-bold uppercase tracking-[0.24em]',
    heroTitle: 'text-4xl font-light leading-[1.04] tracking-[-0.04em] sm:text-6xl lg:text-[5.15rem]',
    sectionTitle: 'text-3xl font-light leading-none tracking-[-0.04em] sm:text-5xl',
    body: 'text-base leading-8',
  },
  surface: {
    card: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    soft: `border ${editablePalette.border} ${editablePalette.surfaceBg}`,
    dark: `${editablePalette.darkBg} ${editablePalette.darkText}`,
  },
  button: {
    primary: 'inline-flex items-center justify-center gap-2 rounded-[0.35rem] bg-[var(--slot4-dark-bg)] px-7 py-3.5 text-xs font-semibold text-white transition duration-300 hover:bg-[var(--slot4-accent-fill)]',
    secondary: 'inline-flex items-center justify-center gap-2 rounded-[0.35rem] border border-[color:rgba(255,255,255,0.45)] bg-transparent px-7 py-3.5 text-xs font-semibold text-current transition duration-300 hover:bg-white hover:text-[var(--slot4-dark-bg)]',
    accent: 'inline-flex items-center justify-center gap-2 rounded-[0.35rem] bg-[var(--slot4-accent-fill)] px-7 py-3.5 text-xs font-semibold text-white transition duration-300 hover:bg-[var(--slot4-accent)]',
  },
  media: {
    frame: `relative overflow-hidden ${editablePalette.mediaBg}`,
    ratio: 'aspect-[4/3]',
  },
  motion: {
    lift: 'transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(53,42,32,0.16)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'All visible layout decisions belong inside src/editable; keep data, SEO, API, and route logic untouched.',
  'Use a luxury-classic publication system with a deep masthead, cream reading surfaces, and warm brown accents.',
  'Keep dynamic post fetching intact and never replace backend posts with mock arrays.',
  'Use postHref() for all post links so route aliases and task-specific detail pages remain functional.',
  'Prioritize readable desktop and mobile layouts with broad story columns and a focused long-form article measure.',
  'Branding must remain dynamic from SITE_CONFIG; never hardcode a reference publication name or logo.',
] as const
