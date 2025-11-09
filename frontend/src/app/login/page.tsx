// neo-lms/frontend/src/app/login/page.tsx
import { Button } from '@/components/button'
import { GradientBackground } from '@/components/gradient'
import { Link } from '@/components/link'
import { Logo } from '@/components/logo' // <-- 1. از Mark به Logo تغییر کرد
import { Checkbox, Field, Input, Label } from '@headlessui/react'
import { CheckIcon } from '@heroicons/react/16/solid'
import { clsx } from 'clsx'
import type { Metadata } from 'next'

// --- 2. ترجمه Metadata ---
export const metadata: Metadata = {
  title: 'ورود به حساب کاربری',
  description: 'برای ادامه، وارد حساب کاربری خود شوید.',
}

export default function Login() {
  return (
    <main className="overflow-hidden bg-gray-50">
      <GradientBackground />
      <div className="isolate flex min-h-dvh items-center justify-center p-6 lg:p-8">
        <div className="w-full max-w-md rounded-xl bg-white ring-1 shadow-md ring-black/5">
          <form action="#" method="POST" className="p-7 sm:p-11">
            <div className="flex items-start">
              <Link href="/" title="صفحه اصلی"> {/* --- 3. ترجمه متن --- */}
                <Logo className="h-9" /> {/* <-- 1. کامپوننت جایگزین شد */}
              </Link>
            </div>
            {/* --- 3. ترجمه متن --- */}
            <h1 className="mt-8 text-base/6 font-medium">خوش آمدید!</h1>
            <p className="mt-1 text-sm/5 text-gray-600">
              برای ادامه وارد حساب کاربری خود شوید.
            </p>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">ایمیل</Label>
              <Input
                required
                autoFocus
                type="email"
                name="email"
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                  'text-left dir-ltr' // <-- 4. (اختیاری) بهبود RTL برای ایمیل
                )}
              />
            </Field>
            <Field className="mt-8 space-y-3">
              <Label className="text-sm/5 font-medium">رمز عبور</Label>
              <Input
                required
                type="password"
                name="password"
                className={clsx(
                  'block w-full rounded-lg border border-transparent ring-1 shadow-sm ring-black/10',
                  'px-[calc(--spacing(2)-1px)] py-[calc(--spacing(1.5)-1px)] text-base/6 sm:text-sm/6',
                  'data-focus:outline data-focus:outline-2 data-focus:-outline-offset-1 data-focus:outline-black',
                  'text-left dir-ltr' // <-- 4. (اختیاری) بهبود RTL برای رمز عبور
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
              <Button type="submit" className="w-full">
                ورود
              </Button>
            </div>
          </form>
          <div className="m-1.5 rounded-lg bg-gray-50 py-4 text-center text-sm/5 ring-1 ring-black/5">
            عضو نیستید؟{' '}
            <Link href="#" className="font-medium hover:text-gray-600">
              ایجاد حساب کاربری
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}