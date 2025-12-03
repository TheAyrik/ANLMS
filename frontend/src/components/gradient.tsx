import { clsx } from 'clsx'

export function Gradient({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      {...props}
      className={clsx(
        className,
        'bg-linear-115 from-white from-10% via-[#eaf9fe] via-55% to-pardis-primary/30 sm:bg-linear-145',
        'group-data-[site-theme=dark]/site:from-[#0f1b2d] group-data-[site-theme=dark]/site:via-[#0c2537] group-data-[site-theme=dark]/site:to-[#0a84ad]/50',
      )}
    />
  )
}

export function GradientBackground({
  variant = 'light',
}: {
  variant?: 'light' | 'dark'
}) {
  const isDark = variant === 'dark'

  return (
    <div className="relative mx-auto max-w-7xl">
      <div
        className={clsx(
          'absolute -top-44 -right-60 h-60 w-[36rem] transform-gpu md:right-0',
          'rotate-[-10deg] rounded-full blur-3xl',
          isDark
            ? 'bg-linear-115 from-[#0f1b2d] from-20% via-[#0b2b3f] via-60% to-[#0a84ad]/70 opacity-60'
            : 'bg-linear-115 from-[#e5f8ff] from-20% via-[#13b5de] via-60% to-[#208ea8]',
        )}
      />
    </div>
  )
}
