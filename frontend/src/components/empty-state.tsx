import { clsx } from 'clsx'

type EmptyStateProps = {
  title: string
  description?: string
  icon?: React.ReactNode
  action?: React.ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white/80 px-6 py-8 text-center',
        'group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/60',
        'group-data-[site-theme=dark]/site:border-white/10 group-data-[site-theme=dark]/site:bg-slate-900/60',
        className,
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white group-data-[site-theme=dark]/site:text-white">
        {title}
      </div>
      {description && (
        <p className="max-w-sm text-xs leading-6 text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400 group-data-[site-theme=dark]/site:text-slate-400">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
