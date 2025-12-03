'use client'

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

type SiteTheme = 'light' | 'dark'

type SiteThemeContextValue = {
  theme: SiteTheme
  setTheme: Dispatch<SetStateAction<SiteTheme>>
  toggleTheme: () => void
}

const SiteThemeContext = createContext<SiteThemeContextValue | null>(null)

export function SiteThemeProvider({ children }: { children: React.ReactNode }) {
  const [hasUserThemePreference, setHasUserThemePreference] = useState(() => {
    if (typeof window === 'undefined') return false
    const stored = window.localStorage.getItem('site:theme')
    return stored === 'dark' || stored === 'light'
  })

  const [theme, setTheme] = useState<SiteTheme>(() => {
    if (typeof window === 'undefined') return 'light'
    const stored = window.localStorage.getItem('site:theme')
    if (stored === 'dark' || stored === 'light') return stored
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = (event: MediaQueryListEvent) => {
      if (!hasUserThemePreference) {
        setTheme(event.matches ? 'dark' : 'light')
      }
    }
    handleChange({ matches: mediaQuery.matches } as MediaQueryListEvent)
    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [hasUserThemePreference])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // حذف کلیدهای قدیمی تم بخش‌های جداگانه و اتکا به site:theme
      window.localStorage.removeItem('dashboard:theme')
      window.localStorage.removeItem('auth:theme')
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (hasUserThemePreference) {
        window.localStorage.setItem('site:theme', theme)
      } else {
        window.localStorage.removeItem('site:theme')
      }
    }
    if (typeof document !== 'undefined') {
      document.documentElement.style.colorScheme = theme === 'dark' ? 'dark' : 'light'
      document.documentElement.dataset.siteTheme = theme
      document.body.dataset.siteTheme = theme
    }
  }, [hasUserThemePreference, theme])

  const toggleTheme = () => {
    setHasUserThemePreference(true)
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const value = useMemo(
    () => ({
      theme,
      setTheme: (next) => {
        setHasUserThemePreference(true)
        setTheme(next)
      },
      toggleTheme,
    }),
    [theme],
  )

  return (
    <SiteThemeContext.Provider value={value}>
      <div
        data-site-theme={theme}
        className="group/site min-h-screen bg-white text-gray-950 transition-colors duration-300 data-[site-theme=dark]:bg-slate-950 data-[site-theme=dark]:text-slate-100"
      >
        {children}
      </div>
    </SiteThemeContext.Provider>
  )
}

export function useSiteTheme() {
  const ctx = useContext(SiteThemeContext)
  if (!ctx) {
    throw new Error('Site theme context is not available')
  }
  return ctx
}
