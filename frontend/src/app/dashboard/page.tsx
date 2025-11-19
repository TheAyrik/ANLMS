// neo-lms/frontend/src/app/dashboard/page.tsx

import React from "react";

import { Button } from "@/components/button";
import { Heading, Subheading } from "@/components/text";

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
    <div className="space-y-8">
      {/* هدر داشبورد */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Subheading as="p">داشبورد یادگیری</Subheading>
          <Heading as="h1" className="mt-2 text-3xl sm:text-4xl">
            سلام، آیریک 👋
          </Heading>
          <p className="mt-3 max-w-md text-sm/6 text-pardis-gray">
            این‌جا تصویر کلی از مسیر یادگیری‌ات است. می‌توانی از همین‌جا دوره‌ها،
            پیشرفت و رویدادهای پیش‌رو را مدیریت کنی.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button href="/courses">شروع یک دوره جدید</Button>
          <Button variant="secondary" href="/profile">
            مشاهده پروفایل یادگیری
          </Button>
        </div>
      </header>

      {/* کارت‌های آماری بالا */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="دوره‌های فعال"
          value="۳"
          helper="۲ دوره جدید در این هفته"
        />
        <StatCard
          label="میانگین پیشرفت"
          value="۴۵٪"
          helper="در مسیر خوبی هستی"
        />
        <StatCard
          label="ساعت مطالعه این هفته"
          value="۵ ساعت"
          helper="هدف این هفته: ۸ ساعت"
        />
        <StatCard
          label="تمرین‌های باز"
          value="۲"
          helper="بهتره امروز یکی رو ببندی"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        {/* ستون اصلی */}
        <section className="space-y-6">
          {/* ادامه یادگیری */}
          <section className="rounded-3xl bg-white/90 ring-1 ring-pardis-primary/10 shadow-xs backdrop-blur">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4">
              <h2 className="text-sm font-medium text-gray-950">
                ادامه یادگیری
              </h2>
              <Button variant="outline" href="/courses">
                مشاهده همه دوره‌ها
              </Button>
            </div>
            <div className="grid gap-4 p-5 md:grid-cols-2">
              {demoCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </section>

          {/* پیشنهاد دوره‌ها */}
          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-medium text-gray-950">
                  پیشنهاد برای تو
                </h2>
                <p className="mt-1 text-xs text-pardis-gray">
                  بر اساس دوره‌های فعلی‌ات و مسیر یادگیری تعریف‌شده.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Tag>یادگیری تقویتی</Tag>
              <Tag>بینایی ماشین</Tag>
              <Tag>MLOps</Tag>
              <Tag>تحلیل داده</Tag>
            </div>
          </section>
        </section>

        {/* ستون کناری */}
        <aside className="space-y-6">
          {/* رویدادهای پیش‌رو */}
          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <h2 className="mb-3 text-sm font-medium text-gray-950">
              رویدادهای پیش‌رو
            </h2>
            <div className="space-y-3">
              {upcomingItems.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2 text-xs text-gray-800"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-[11px] text-pardis-gray">
                    {item.date}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* آخرین فعالیت‌ها */}
          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <h2 className="mb-3 text-sm font-medium text-gray-950">
              آخرین فعالیت‌ها
            </h2>
            <ul className="space-y-2 text-xs text-pardis-gray">
              <li>✅ تکمیل درس ۲ از دوره مبانی یادگیری ماشین</li>
              <li>📘 شروع دوره شبکه‌های عصبی عمیق</li>
              <li>⏱ ۴۵ دقیقه مطالعه در روز گذشته</li>
            </ul>
          </section>
        </aside>
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
    <div className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
      <div className="text-xs font-medium text-pardis-secondary/80">
        {label}
      </div>
      <div className="mt-2 text-xl font-semibold tracking-tight text-gray-950">
        {value}
      </div>
      {helper && (
        <div className="mt-1 text-[11px] text-pardis-gray">{helper}</div>
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
    <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white/90 p-4 shadow-xs">
      <div>
        <h3 className="line-clamp-2 text-sm font-semibold text-gray-950">
          {course.title}
        </h3>
        <p className="mt-1 text-[11px] text-pardis-gray">
          درس بعدی: {course.nextLesson}
        </p>
      </div>
      <div className="mt-3">
        <div className="mb-1 flex items-center justify-between text-[11px] text-pardis-gray">
          <span>پیشرفت</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full bg-pardis-primary/10">
          <div
            className="h-full rounded-full bg-pardis-primary"
            style={{ width: `${course.progress}%` }}
          />
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            className="w-full text-xs"
            href={`/courses/${course.id}`}
          >
            ادامه دوره
          </Button>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-pardis-primary/20 bg-white/70 px-3 py-1 text-[11px] font-medium text-gray-700">
      {children}
    </span>
  );
}
