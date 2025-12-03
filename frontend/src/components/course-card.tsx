// neo-lms/frontend/src/components/course-card.tsx
'use client'

import { ArrowUpRightIcon, UserGroupIcon } from '@heroicons/react/20/solid'
import { clsx } from 'clsx'
import { Button } from './button'
import { Link } from './link'

type Accent = 'teal' | 'blue' | 'emerald' | 'amber'

type CourseCardProps = {
  title: string
  description: string
  status: string
  students: number
  href: string
  accent?: Accent
}

const accentStyles: Record<Accent, { cover: string; dot: string }> = {
  teal: {
    cover: 'from-pardis-primary-500 via-pardis-secondary-500 to-pardis-primary-900',
    dot: 'bg-pardis-primary-500',
  },
  blue: {
    cover: 'from-sky-400 via-blue-500 to-slate-900',
    dot: 'bg-sky-500',
  },
  emerald: {
    cover: 'from-emerald-400 via-emerald-600 to-emerald-900',
    dot: 'bg-emerald-500',
  },
  amber: {
    cover: 'from-amber-400 via-orange-500 to-rose-700',
    dot: 'bg-amber-500',
  },
}

const formatNumber = (value: number) =>
  new Intl.NumberFormat('fa-IR').format(value)

export function CourseCard({
  accent = 'teal',
  description,
  href,
  status,
  students,
  title,
}: CourseCardProps) {
  const accentTone = accentStyles[accent]
  const needsMore = description.length > 96
  const truncatedDescription = needsMore
    ? `${description.slice(0, 96).trimEnd()}…`
    : description

  return (
    <div
      className={clsx(
        'group relative flex h-full flex-col overflow-hidden rounded-3xl',
        'bg-white text-gray-900 ring-1 ring-pardis-primary/10 shadow-lg',
        'transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-pardis-primary/50',
        'group-data-[site-theme=dark]/site:bg-slate-900/80 group-data-[site-theme=dark]/site:text-slate-100 group-data-[site-theme=dark]/site:ring-white/10 group-data-[site-theme=dark]/site:shadow-[0_20px_60px_-35px_rgba(0,0,0,0.9)]',
      )}
    >
      <div className="absolute -left-24 bottom-0 h-40 w-40 rounded-full bg-pardis-primary/10 blur-3xl" aria-hidden="true" />
      <div className="relative mx-4 mt-4 overflow-hidden rounded-2xl ring-1 ring-pardis-primary/10">
        <div className={clsx('aspect-[3/2] w-full bg-linear-to-br', accentTone.cover)} />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.32),transparent_38%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_30%),radial-gradient(circle_at_40%_80%,rgba(255,255,255,0.18),transparent_35%)]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-white/25 via-white/10 to-black/10" />
      </div>

      <div className="flex flex-1 flex-col gap-4 px-6 py-6">
        <div className="flex items-center gap-2 text-sm text-pardis-primary-700 group-data-[site-theme=dark]/site:text-pardis-primary-100">
          <span className={clsx('size-2 rounded-full', accentTone.dot)} />
          <span className="font-semibold">{status}</span>
        </div>
        <div>
          <p className="text-xl font-extrabold tracking-tight text-gray-950 group-data-[site-theme=dark]/site:text-white">
            {title}
          </p>
          <p className="mt-2 text-sm leading-6 text-gray-600 group-data-[site-theme=dark]/site:text-slate-300">
            {truncatedDescription}{' '}
            {needsMore && (
              <Link
                href={href}
                className="font-semibold text-pardis-primary-700 data-hover:text-pardis-primary-900"
              >
                ...
              </Link>
            )}
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2 text-sm font-semibold text-gray-700 group-data-[site-theme=dark]/site:text-slate-200">
          <span className="inline-flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 ring-1 ring-gray-200 group-data-[site-theme=dark]/site:bg-white/5 group-data-[site-theme=dark]/site:ring-white/15">
            <UserGroupIcon className="size-4 text-pardis-primary-700 group-data-[site-theme=dark]/site:text-pardis-primary-100" />
            <span className="tabular-nums">{formatNumber(students)}</span>
          </span>
          <Button
            href={href}
            variant="primary"
            className="shrink-0 px-3 py-2 text-sm font-semibold whitespace-nowrap"
          >
            <ArrowUpRightIcon className="size-5" />
            <span>اطلاعات بیشتر</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
