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
        className,
      )}
    >
      {icon && <div className="text-2xl">{icon}</div>}
      <div className="text-sm font-semibold text-gray-900">{title}</div>
      {description && (
        <p className="max-w-sm text-xs leading-6 text-pardis-gray">
          {description}
        </p>
      )}
      {action}
    </div>
  )
}
