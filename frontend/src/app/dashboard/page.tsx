// app/dashboard/page.tsx (یا pages/dashboard.tsx)

import React from "react";

const demoCourses = [
  {
    id: 1,
    title: "مبانی یادگیری ماشین",
    progress: 45,
    nextLesson: "درس ۳: رگرسیون خطی",
  },
  {
    id: 2,
    title: "شبکه‌های عصبی عمیق",
    progress: 20,
    nextLesson: "درس ۱: پرسپترون",
  },
  {
    id: 3,
    title: "پردازش زبان طبیعی با Python",
    progress: 70,
    nextLesson: "درس ۵: Word Embeddingها",
  },
];

const upcomingItems = [
  {
    id: 1,
    title: "کوییز ۱ – مبانی یادگیری ماشین",
    date: "سه‌شنبه ۲۹ آبان، ساعت ۱۸",
  },
  {
    id: 2,
    title: "تحویل تمرین شبکه‌های عصبی",
    date: "پنج‌شنبه ۱ آذر، ساعت ۲۳:۵۹",
  },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Container اصلی */}
      <div className="mx-auto max-w-6xl px-4 py-6 lg:py-10">
        {/* هدر */}
        <header className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
              سلام، آیریک 👋
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              خوش آمدی به داشبورد یادگیری‌ات. امروز چطوره ادامه بدیم؟
            </p>
          </div>
          <button className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50">
            + شروع یک دوره جدید
          </button>
        </header>

        {/* کارت‌های آماری */}
        <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="دوره‌های فعال" value="۳" helper="۲ دوره جدید در این هفته" />
          <StatCard label="میانگین پیشرفت" value="۴۵٪" helper="در مسیر خوبی هستی" />
          <StatCard label="ساعت مطالعه این هفته" value="۵ ساعت" helper="هدف: ۸ ساعت" />
          <StatCard label="تمرین‌های باز" value="۲" helper="بهتره امروز یکی رو ببندی" />
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
          {/* ستون اصلی */}
          <main className="space-y-6">
            {/* ادامه یادگیری */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  ادامه یادگیری
                </h2>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-700">
                  مشاهده همه دوره‌ها
                </button>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {demoCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* پیشنهاد دوره‌ها – بعداً می‌تونی وصلش کنی به بک‌اند */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-base font-semibold text-slate-900">
                  پیشنهاد برای تو
                </h2>
                <span className="text-xs text-slate-400">
                  بر اساس دوره‌های فعلی‌ات
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  یادگیری تقویتی
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  بینایی ماشین
                </span>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                  MLOps
                </span>
              </div>
            </section>
          </main>

          {/* ستون کناری */}
          <aside className="space-y-6">
            {/* رویدادهای پیش‌رو */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                رویدادهای پیش‌رو
              </h2>
              <div className="space-y-3">
                {upcomingItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-3 text-xs"
                  >
                    <div className="font-medium text-slate-800">
                      {item.title}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {item.date}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* آخرین فعالیت‌ها – فعلاً استاتیک */}
            <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h2 className="mb-3 text-base font-semibold text-slate-900">
                آخرین فعالیت‌ها
              </h2>
              <ul className="space-y-2 text-xs text-slate-600">
                <li>✅ تکمیل درس ۲ از دوره مبانی یادگیری ماشین</li>
                <li>📘 شروع دوره شبکه‌های عصبی عمیق</li>
                <li>⏱ ۴۵ دقیقه مطالعه در روز گذشته</li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: string;
  helper?: string;
};

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
      {helper && (
        <div className="mt-1 text-[11px] text-slate-400">{helper}</div>
      )}
    </div>
  );
}

type Course = {
  id: number;
  title: string;
  progress: number;
  nextLesson: string;
};

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div>
        <h3 className="text-sm font-semibold text-slate-900 line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-1 text-[11px] text-slate-500">
          درس بعدی: {course.nextLesson}
        </p>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
          <span>پیشرفت</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-blue-500"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <button className="mt-3 w-full rounded-xl bg-blue-600 py-1.5 text-xs font-medium text-white hover:bg-blue-700">
          ادامه دوره
        </button>
      </div>
    </div>
  );
}
