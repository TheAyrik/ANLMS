import { clsx } from 'clsx'

type BadgeProps = {
  color?: 'gray' | 'green' | 'blue' | 'amber' | 'red'
  children: React.ReactNode
  className?: string
}

const colors: Record<NonNullable<BadgeProps['color']>, string> = {
  gray: 'bg-pardis-gray-50 text-pardis-gray ring-pardis-gray-100',
  green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  blue: 'bg-pardis-primary-50 text-pardis-primary-700 ring-pardis-primary-100',
  amber: 'bg-amber-50 text-amber-800 ring-amber-100',
  red: 'bg-red-50 text-red-700 ring-red-100',
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
