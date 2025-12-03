import { clsx } from 'clsx'

type BadgeProps = {
  color?: 'gray' | 'green' | 'blue' | 'amber' | 'red'
  children: React.ReactNode
  className?: string
}

const colors: Record<NonNullable<BadgeProps['color']>, string> = {
  gray: 'bg-pardis-gray-50 text-pardis-gray ring-pardis-gray-100 group-data-[dashboard-theme=dark]/dashboard:bg-white/10 group-data-[dashboard-theme=dark]/dashboard:text-slate-200 group-data-[dashboard-theme=dark]/dashboard:ring-white/10 group-data-[site-theme=dark]/site:bg-white/10 group-data-[site-theme=dark]/site:text-slate-200 group-data-[site-theme=dark]/site:ring-white/10',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100 group-data-[dashboard-theme=dark]/dashboard:bg-emerald-500/15 group-data-[dashboard-theme=dark]/dashboard:text-emerald-100 group-data-[dashboard-theme=dark]/dashboard:ring-emerald-400/40 group-data-[site-theme=dark]/site:bg-emerald-500/15 group-data-[site-theme=dark]/site:text-emerald-100 group-data-[site-theme=dark]/site:ring-emerald-400/40',
  blue: 'bg-pardis-primary-50 text-pardis-primary-700 ring-pardis-primary-100 group-data-[dashboard-theme=dark]/dashboard:bg-pardis-primary-500/15 group-data-[dashboard-theme=dark]/dashboard:text-pardis-primary-100 group-data-[dashboard-theme=dark]/dashboard:ring-pardis-primary-400/40 group-data-[site-theme=dark]/site:bg-pardis-primary-500/15 group-data-[site-theme=dark]/site:text-pardis-primary-100 group-data-[site-theme=dark]/site:ring-pardis-primary-400/40',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100 group-data-[dashboard-theme=dark]/dashboard:bg-amber-500/15 group-data-[dashboard-theme=dark]/dashboard:text-amber-100 group-data-[dashboard-theme=dark]/dashboard:ring-amber-400/40 group-data-[site-theme=dark]/site:bg-amber-500/15 group-data-[site-theme=dark]/site:text-amber-100 group-data-[site-theme=dark]/site:ring-amber-400/40',
  red: 'bg-red-50 text-red-700 ring-red-100 group-data-[dashboard-theme=dark]/dashboard:bg-red-500/15 group-data-[dashboard-theme=dark]/dashboard:text-red-100 group-data-[dashboard-theme=dark]/dashboard:ring-red-400/40 group-data-[site-theme=dark]/site:bg-red-500/15 group-data-[site-theme=dark]/site:text-red-100 group-data-[site-theme=dark]/site:ring-red-400/40',
}

export function Badge({
  color = 'gray',
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ring-1',
        colors[color],
        className,
      )}
    >
      {children}
    </span>
  )
}
