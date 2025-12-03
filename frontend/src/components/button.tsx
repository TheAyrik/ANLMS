import * as Headless from '@headlessui/react'
import { clsx } from 'clsx'
import { Link } from './link'

const variants = {
  primary: clsx(
    'inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-lg border border-transparent bg-pardis-primary shadow-md shadow-pardis-primary/40',
    'text-base font-medium whitespace-nowrap text-white',
    'group-data-[dashboard-theme=dark]/dashboard:shadow-pardis-primary/30',
    'group-data-[site-theme=dark]/site:shadow-pardis-primary/30 group-data-[site-theme=dark]/site:bg-pardis-primary/90',
    'data-disabled:bg-pardis-primary data-disabled:opacity-40 data-hover:bg-pardis-secondary',
  ),
  secondary: clsx(
    'relative inline-flex items-center justify-center px-4 py-[calc(--spacing(2)-1px)]',
    'rounded-lg border border-transparent bg-white/80 ring-1 shadow-md ring-pardis-primary/25',
    'after:absolute after:inset-0 after:rounded-lg after:shadow-[inset_0_0_2px_1px_rgba(19,181,222,0.35)]',
    'text-base font-medium whitespace-nowrap text-pardis-primary',
    'group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:text-slate-100 group-data-[dashboard-theme=dark]/dashboard:ring-white/15',
    'group-data-[dashboard-theme=dark]/dashboard:after:shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.08)]',
    'group-data-[dashboard-theme=dark]/dashboard:data-hover:bg-slate-800',
    'group-data-[site-theme=dark]/site:bg-slate-900/80 group-data-[site-theme=dark]/site:text-slate-100 group-data-[site-theme=dark]/site:ring-white/15',
    'group-data-[site-theme=dark]/site:after:shadow-[inset_0_0_2px_1px_rgba(255,255,255,0.08)]',
    'group-data-[site-theme=dark]/site:data-hover:bg-slate-800',
    'data-disabled:bg-white/60 data-disabled:opacity-40 data-hover:bg-white',
  ),
  outline: clsx(
    'inline-flex items-center justify-center px-2 py-[calc(--spacing(1.5)-1px)]',
    'rounded-lg border border-transparent ring-1 shadow-sm ring-pardis-primary/40',
    'text-sm font-medium whitespace-nowrap text-pardis-primary',
    'group-data-[dashboard-theme=dark]/dashboard:ring-white/20 group-data-[dashboard-theme=dark]/dashboard:text-slate-100 group-data-[dashboard-theme=dark]/dashboard:data-hover:bg-white/5',
    'group-data-[site-theme=dark]/site:ring-white/20 group-data-[site-theme=dark]/site:text-slate-100 group-data-[site-theme=dark]/site:data-hover:bg-white/5',
    'data-disabled:bg-transparent data-disabled:opacity-40 data-hover:bg-pardis-primary/5',
  ),
}

type ButtonProps = {
  variant?: keyof typeof variants
} & (
  | React.ComponentPropsWithoutRef<typeof Link>
  | (Headless.ButtonProps & { href?: undefined })
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(className, variants[variant])

  if (typeof props.href === 'undefined') {
    return <Headless.Button {...props} className={className} />
  }

  return <Link {...props} className={className} />
}
