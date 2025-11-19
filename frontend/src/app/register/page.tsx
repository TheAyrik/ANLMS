// frontend/src/app/register/page.tsx
'use client'

import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Field, Input, Label } from '@headlessui/react'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string[]>>({})
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: [] })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({}) // پاک کردن ارورهای قبلی
    
    try {
      const res = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.email,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        alert('ثبت‌نام با موفقیت انجام شد! لطفاً وارد شوید.')
        router.push('/login')
      } else {
        // نمایش خطای ساده (می‌توانید بعداً حرفه‌ای‌تر کنید)
        alert('خطا در ثبت‌نام: ' + JSON.stringify(data))
      }
    } catch (error) {
      alert('خطا در برقراری ارتباط با سرور')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5">
          <form onSubmit={handleSubmit} className="p-7 sm:p-11">
            <div className="flex items-start">
              <Link href="/" title="صفحه اصلی">
                <Logo className="h-9" />
              </Link>
            </div>
            <h1 className="mt-8 text-base/6 font-medium">ایجاد حساب کاربری</h1>
            <p className="mt-1 text-sm/5 text-gray-600">
              برای دسترسی به دوره‌ها و امکانات، ثبت‌نام کنید.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <Field className="space-y-3">
                <Label className="text-sm/5 font-medium">نام</Label>
                <Input
                  required
                  name="first_name"
                  onChange={handleChange}
                  className={clsx(
                    'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                    'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                    'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black'
                  )}
                />
              </Field>
              <Field className="space-y-3">
                <Label className="text-sm/5 font-medium">نام خانوادگی</Label>
                <Input
                  required
                  name="last_name"
                  onChange={handleChange}
                  className={clsx(
                    'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                    'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                    'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black'
                  )}
                />
              </Field>
            </div>

            <Field className="mt-4 space-y-3">
              <Label className="text-sm/5 font-medium">ایمیل</Label>
              <Input
                required
                type="email"
                name="email"
                onChange={handleChange}
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                  'text-left dir-ltr'
                )}
              />
            </Field>

            <Field className="mt-4 space-y-3">
              <Label className="text-sm/5 font-medium">رمز عبور</Label>
              <Input
                required
                type="password"
                name="password"
                onChange={handleChange}
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                   errors.password ? 'ring-red-500 focus:ring-red-500' : '',
                  'text-left dir-ltr'
                )}
              />
              {/* نمایش متن ارور */}
              {errors.password && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.password.map((err, idx) => <span key={idx} className="block">• {err}</span>)}
                </p>
              )}
            </Field>

            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'در حال ثبت‌نام...' : 'ثبت‌نام'}
              </Button>
            </div>
          </form>
          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
            قبلاً عضو شده‌اید؟{' '}
            <Link href="/login" className="font-medium hover:text-gray-600">
              وارد شوید
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}