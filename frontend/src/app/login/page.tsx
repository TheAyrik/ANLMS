// frontend/src/app/login/page.tsx
'use client'

import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo'
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('http://127.0.0.1:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // جنگو یوزرنیم می‌خواهد، ما ایمیل را می‌فرستیم
          password: formData.password,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        // ذخیره توکن‌ها در حافظه مرورگر
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        
        console.log('Login Successful:', data)
        // هدایت به داشبورد
        router.push('/dashboard')
      } else {
        alert('نام کاربری یا رمز عبور اشتباه است.')
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
            <h1 className="mt-8 text-base/6 font-medium">خوش آمدید!</h1>
            <p className="mt-1 text-sm/5 text-gray-600">
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
                  'text-left dir-ltr'
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
                  'text-left dir-ltr'
                )}
              />
            </Field>
            <div className="mt-8 flex items-center justify-between text-sm/5">
              <Field className="flex items-center gap-3">
                <Checkbox
                  name="remember-me"
                  className={clsx(
                    'group block size-4 rounded-sm border border-transparent ring-1 shadow-sm ring-black/10 focus:outline-hidden',
                    'data-checked:bg-black data-checked:ring-black',
                    'data-focus:outline data-focus:outline-2 data-focus:outline-offset-2 data-focus:outline-black',
                  )}
                >
                  <CheckIcon className="fill-white opacity-0 group-data-checked:opacity-100" />
                </Checkbox>
                <Label>مرا به خاطر بسپار</Label>
              </Field>
              <Link href="#" className="font-medium hover:text-gray-600">
                فراموشی رمز عبور؟
              </Link>
            </div>
            <div className="mt-8">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'در حال ورود...' : 'ورود'}
              </Button>
            </div>
          </form>
          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
            عضو نیستید؟{' '}
            <Link href="/register" className="font-medium hover:text-gray-600">
              ایجاد حساب کاربری
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}