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
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    
    // اگر کاربری شروع به اصلاح فیلدی کرد، ارور آن فیلد را پاک کن
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({}) // پاک کردن تمام ارورها قبل از درخواست جدید

    try {
      const res = await fetch('http://127.0.0.1:8000/api/accounts/register/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.email, // استفاده از ایمیل به عنوان نام کاربری
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
        // نمایش ارورهای بازگشتی از سمت جنگو (مثل تکراری بودن ایمیل یا ضعیف بودن پسورد)
        setErrors(data)
      }
    } catch (error) {
      alert('خطا در برقراری ارتباط با سرور. لطفاً اتصال اینترنت یا سرور را بررسی کنید.')
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
              {/* --- فیلد نام --- */}
              <Field className="space-y-3">
                <Label className="text-sm/5 font-medium">نام</Label>
                <Input
                  required
                  name="first_name"
                  onChange={handleChange}
                  className={clsx(
                    'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                    'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                    'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                    errors.first_name ? 'ring-red-500 focus:ring-red-500' : ''
                  )}
                />
                {errors.first_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.first_name.map((err, idx) => <span key={idx} className="block">• {err}</span>)}
                  </p>
                )}
              </Field>

              {/* --- فیلد نام خانوادگی --- */}
              <Field className="space-y-3">
                <Label className="text-sm/5 font-medium">نام خانوادگی</Label>
                <Input
                  required
                  name="last_name"
                  onChange={handleChange}
                  className={clsx(
                    'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                    'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                    'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                    errors.last_name ? 'ring-red-500 focus:ring-red-500' : ''
                  )}
                />
                {errors.last_name && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.last_name.map((err, idx) => <span key={idx} className="block">• {err}</span>)}
                  </p>
                )}
              </Field>
            </div>

            {/* --- فیلد ایمیل --- */}
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
                  errors.email ? 'ring-red-500 focus:ring-red-500' : '',
                  'text-left dir-ltr'
                )}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.email.map((err, idx) => <span key={idx} className="block">• {err}</span>)}
                </p>
              )}
            </Field>

            {/* --- فیلد رمز عبور --- */}
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