// frontend/src/app/login/page.tsx
'use client'

import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { useSiteTheme } from '@/components/site-theme-provider'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

export default function Login() {
  const router = useRouter()
  const { theme, toggleTheme } = useSiteTheme()
  const isDark = theme === 'dark'
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingSession, setCheckingSession] = useState(true)

  useEffect(() => {
    let isMounted = true

    const checkExistingSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
          credentials: 'include',
        })

        if (!isMounted) return

        if (res.ok) {
          router.replace('/dashboard')
          return
        }
      } catch (error) {
        // no-op, we'll show the login form below
      }

      if (isMounted) {
        setCheckingSession(false)
      }
    }

    checkExistingSession()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/api/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          username: formData.email, // جنگو یوزرنیم می‌خواهد، ما ایمیل را می‌فرستیم
          password: formData.password,
        }),
      })

      const data = await res.json().catch(() => null)

      if (!res.ok) {
        setError(data?.detail ?? 'نام کاربری یا رمز عبور اشتباه است.')
        return
      }

      router.push('/dashboard')
    } catch (error) {
      setError('خطا در برقراری ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <main
        data-auth-theme={theme}
        className={clsx(
          'overflow-hidden min-h-dvh transition-colors',
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900',
        )}
      >
        <GradientBackground variant={isDark ? 'dark' : 'light'} />
        <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
          <div
            className={clsx(
              'w-full max-w-md rounded-xl p-8 text-center ring-1 shadow-md backdrop-blur-sm',
              isDark ? 'bg-slate-900/80 ring-white/10' : 'bg-white ring-black/5',
            )}
          >
            <p className={clsx('text-base', isDark ? 'text-slate-200' : 'text-gray-700')}>
              در حال بررسی وضعیت ورود...
            </p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main
      data-auth-theme={theme}
      className={clsx(
        'overflow-hidden min-h-dvh transition-colors',
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900',
      )}
    >
      <GradientBackground variant={isDark ? 'dark' : 'light'} />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div
          className={clsx(
            'w-full max-w-md rounded-xl ring-1 shadow-md backdrop-blur-sm',
            isDark
              ? 'bg-slate-900/80 ring-white/10 border border-white/10'
              : 'bg-white ring-black/5',
          )}
        >
          <form onSubmit={handleSubmit} className="p-7 sm:p-11">
            <div className="flex items-start justify-between gap-3">
              <Link href="/" title="صفحه اصلی">
                <Logo className="h-9" />
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                className={clsx(
                  'rounded-full px-3 py-1 text-xs font-semibold ring-1 transition-colors',
                  isDark
                    ? 'bg-white/5 text-slate-100 ring-white/10 hover:bg-white/10'
                    : 'bg-white text-pardis-secondary ring-black/5 hover:bg-pardis-primary/10',
                )}
                aria-pressed={isDark}
              >
                حالت {isDark ? 'روشن' : 'تیره'}
              </button>
            </div>
            <h1 className="mt-8 text-base/6 font-medium">خوش آمدید!</h1>
            <p className={clsx('mt-1 text-sm/5', isDark ? 'text-slate-300' : 'text-gray-600')}>
              برای ورود به نئو LMS وارد شوید.
            </p>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">ایمیل</Label>
              <Input
                required
                autoFocus
                type="email"
                name="email"
                onChange={handleChange}
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                  'text-left dir-ltr placeholder:text-gray-500',
                  isDark
                    ? 'bg-slate-900/70 text-slate-100 ring-white/10 placeholder:text-slate-500 data-focus:outline-white'
                    : 'bg-white text-gray-900',
                )}
              />
            </Field>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">رمز عبور</Label>
              <Input
                required
                type="password"
                name="password"
                onChange={handleChange}
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'text-left dir-ltr placeholder:text-gray-500',
                  isDark
                    ? 'bg-slate-900/70 text-slate-100 ring-white/10 placeholder:text-slate-500'
                    : 'bg-white text-gray-900',
                )}
              />
            </Field>
            {error && (
              <p className={clsx('mt-4 text-sm/6', isDark ? 'text-red-300' : 'text-red-600')}>
                {error}
              </p>
            )}
            <div className="mt-8 flex items-center justify-between text-sm/5">
              <Field className="flex items-center gap-3">
                <Checkbox
                  name="remember-me"
                  className={clsx(
                    'group block size-4 rounded-sm border border-transparent ring-1 shadow-sm ring-black/10 focus:outline-hidden',
                    'data-checked:bg-black data-checked:ring-black',
                    'data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black',
                    isDark ? 'bg-slate-900/70 ring-white/15' : 'bg-white',
                  )}
                >
                  <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
                </Checkbox>
                <Label>مرا به خاطر بسپار</Label>
              </Field>
              <Link
                href="#"
                className={clsx(
                  'font-medium hover:text-gray-600',
                  isDark && 'text-slate-200 hover:text-slate-100',
                )}
              >
                فراموشی رمز عبور؟
              </Link>
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </div>
          </form>
          <div
            className={clsx(
              'm-1.5 rounded-lg py-4 text-center text-sm/5 ring-1',
              isDark
                ? 'bg-slate-900/70 text-slate-200 ring-white/10'
                : 'bg-gray-50 text-gray-800 ring-black/5',
            )}
          >
            عضو نیستید؟{' '}
            <Link
              href="/register"
              className={clsx(
                'font-medium hover:text-gray-600',
                isDark && 'text-slate-100 hover:text-white',
              )}
            >
              ایجاد حساب کاربری
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
