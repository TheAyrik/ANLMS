// frontend/src/app/dashboard/page.tsx
'use client'

import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const router = useRouter()
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    // بررسی وجود توکن
    const token = localStorage.getItem('accessToken')
    if (!token) {
      router.push('/login')
    } else {
      setIsAuth(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    router.push('/login')
  }

  if (!isAuth) return null // یا نمایش یک لودینگ

  return (
    <Container className="py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        سلام! به پردیس هوش مصنوعی خوش آمدید.
      </h1>
      <p className="mt-6 text-lg text-gray-600">
        اینجا داشبورد هوشمند شماست (نسخه اولیه).
        شما با موفقیت احراز هویت شدید و سیستم JWT به درستی کار می‌کند.
      </p>
      
      <div className="mt-10 flex justify-center gap-x-6">
        <Button color="red" onClick={handleLogout}>
          خروج از حساب کاربری
        </Button>
        <Button href="/">
          بازگشت به صفحه اصلی
        </Button>
      </div>
    </Container>
  )
}