// neo-lms/frontend/src/components/navbar.tsx
'use client';

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from '@headlessui/react';
import { Bars2Icon } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';
import { Link } from './link';
import { Logo } from './logo';
import { PlusGrid, PlusGridItem, PlusGridRow } from './plus-grid';
import { useSiteTheme } from './site-theme-provider';

// --- شروع ترجمه ---
const links = [
  { href: '/', label: 'خانه' },
  { href: '/courses', label: 'دوره‌های آموزشی' },
  { href: '/blog', label: 'اخبار' },
  { href: '/contact', label: 'تماس با ما' },
  { href: '/login', label: 'پنل کاربری' },
];
// --- پایان ترجمه ---

function DesktopNav({ onToggleTheme }: { onToggleTheme: () => void }) {
  const { theme } = useSiteTheme();
  const isDark = theme === 'dark';

  return (
    <nav className="relative hidden items-center gap-2 lg:flex">
      {links.map(({ href, label }) => (
        <PlusGridItem key={href} className="relative flex">
          <Link
            href={href}
            className="flex items-center px-4 py-3 text-base font-medium text-gray-950 bg-blend-multiply data-hover:bg-pardis-primary/5 data-hover:text-pardis-primary group-data-[site-theme=dark]/site:text-slate-200 group-data-[site-theme=dark]/site:data-hover:text-white group-data-[site-theme=dark]/site:data-hover:bg-white/10"
          >
            {label}
          </Link>
        </PlusGridItem>
      ))}
      <button
        type="button"
        onClick={onToggleTheme}
        className="rounded-full px-3 py-2 text-xs font-semibold ring-1 transition-colors group-data-[site-theme=dark]/site:bg-white/5 group-data-[site-theme=dark]/site:text-slate-100 group-data-[site-theme=dark]/site:ring-white/10 group-data-[site-theme=dark]/site:hover:bg-white/10 group-data-[site-theme=dark]/site:hover:text-white group-data-[site-theme=dark]/site:shadow-[0_10px_30px_-18px_rgba(0,0,0,0.75)] group-data-[site-theme=dark]/site:backdrop-blur-sm bg-white text-pardis-secondary ring-black/5 hover:bg-pardis-primary/10"
        aria-pressed={isDark}
      >
        {isDark ? 'روشن' : 'تیره'}
      </button>
    </nav>
  )
}

function MobileNavButton() {
  return (
    <DisclosureButton
      className="flex size-12 items-center justify-center self-center rounded-lg data-hover:bg-pardis-primary/10 lg:hidden"
      aria-label="باز کردن منوی اصلی" // --- ترجمه شد ---
    >
      <Bars2Icon className="size-6 text-pardis-primary" />
    </DisclosureButton>
  )
}

function MobileNav() {
  const { theme, toggleTheme } = useSiteTheme();

  return (
    <DisclosurePanel className="lg:hidden">
      <div className="flex flex-col gap-6 py-4">
        {links.map(({ href, label }, linkIndex) => (
          <motion.div
            initial={{ opacity: 0, rotateX: -90 }}
            animate={{ opacity: 1, rotateX: 0 }}
            transition={{
              duration: 0.15,
              ease: 'easeInOut',
              rotateX: { duration: 0.3, delay: linkIndex * 0.1 },
            }}
            key={href}
          >
            <Link
              href={href}
              className="text-base font-medium text-gray-950 data-hover:text-pardis-primary group-data-[site-theme=dark]/site:text-slate-200 group-data-[site-theme=dark]/site:data-hover:text-white"
            >
              {label}
            </Link>
          </motion.div>
        ))}
        <button
          type="button"
          onClick={toggleTheme}
          className="self-start rounded-full px-3 py-2 text-xs font-semibold ring-1 transition-colors bg-white text-pardis-secondary ring-black/5 hover:bg-pardis-primary/10 group-data-[site-theme=dark]/site:bg-white/5 group-data-[site-theme=dark]/site:text-slate-100 group-data-[site-theme=dark]/site:ring-white/10 group-data-[site-theme=dark]/site:hover:bg-white/10"
          aria-pressed={theme === 'dark'}
        >
          حالت {theme === 'dark' ? 'روشن' : 'تیره'}
        </button>
      </div>
      <div className="absolute left-1/2 w-screen -translate-x-1/2">
        <div className="absolute inset-x-0 top-0 border-t border-black/5 group-data-[site-theme=dark]/site:border-white/10" />
        <div className="absolute inset-x-0 top-2 border-t border-black/5 group-data-[site-theme=dark]/site:border-white/10" />
      </div>
    </DisclosurePanel>
  )
}

export function Navbar({ banner }: { banner?: React.ReactNode }) {
  const { toggleTheme } = useSiteTheme();

  return (
    <Disclosure as="header" className="pt-6 sm:pt-8">
      <PlusGrid>
        <PlusGridRow className="relative flex justify-between">
          <div className="relative flex gap-6">
            <PlusGridItem className="py-3">
              <Link href="/" title="صفحه اصلی"> {/* --- ترجمه شد --- */}
                <Logo className="h-9" />
              </Link>
            </PlusGridItem>
            {banner && (
              <div className="relative hidden items-center py-3 lg:flex">
                {banner}
              </div>
            )}
          </div>
          <DesktopNav onToggleTheme={toggleTheme} />
          <MobileNavButton />
        </PlusGridRow>
      </PlusGrid>
      <MobileNav />
    </Disclosure>
  )
}
