// frontend/src/app/dashboard/page.tsx
'use client'

import { Container } from '@/components/container'
import { Button } from '@/components/button'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type UserProfile = {
  id: number
  username: string
  email: string
  first_name: string
  last_name: string
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/users/me/`, {
          credentials: 'include',
        })

        if (res.status === 401) {
          router.replace('/login')
          return
        }

        const data = await res.json().catch(() => null)
        if (!res.ok) {
          if (isMounted) {
            setError(data?.detail ?? 'خطایی در دریافت اطلاعات کاربر رخ داد.')
          }
          return
        }

        if (isMounted && data) {
          setUser(data as UserProfile)
        }
      } catch (error) {
        if (isMounted) {
          setError('خطا در اتصال به سرور')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    fetchProfile()

    return () => {
      isMounted = false
    }
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch(`${API_BASE_URL}/api/users/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })
    } finally {
      router.push('/login')
    }
  }

  if (loading) {
    return (
      <Container className="py-16 text-center">
        <p className="text-base text-gray-600">در حال بررسی وضعیت ورود...</p>
      </Container>
    )
  }

  if (error) {
    return (
      <Container className="py-16 text-center">
        <p className="text-lg text-red-600">{error}</p>
        <div className="mt-8 flex justify-center gap-x-6">
          <Button onClick={() => router.push('/login')}>بازگشت به صفحه ورود</Button>
        </div>
      </Container>
    )
  }

  if (!user) {
    return null
  }

  const fullName =
    user.first_name || user.last_name
      ? `${user.first_name} ${user.last_name}`.trim()
      : user.username

  return (
    <Container className="py-16 text-center">
      <h1 className="text-4xl font-bold tracking-tight text-gray-900">
        {fullName ? `سلام ${fullName}!` : 'سلام!'} به پردیس هوش مصنوعی خوش آمدید.
      </h1>
      <p className="mt-6 text-lg text-gray-600">
        اینجا داشبورد هوشمند شماست (نسخه اولیه).
        شما با موفقیت احراز هویت شدید و سیستم JWT به درستی کار می‌کند.
      </p>

      <div className="mt-10 flex justify-center gap-x-6">
        <Button color="red" onClick={handleLogout}>
          خروج از حساب کاربری
        </Button>
        <Button href="/">بازگشت به صفحه اصلی</Button>
      </div>
    </Container>
  )
}
