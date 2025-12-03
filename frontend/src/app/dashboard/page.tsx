"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/text";
import { ApiError, apiRequest } from "@/lib/api";
import { formatPersianDate } from "@/lib/date";

import { useDashboard } from "./dashboard-context";

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  is_free: boolean;
  image?: string | null;
  instructor: number;
  instructor_name?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

const recommendedTags = ["یادگیری تقویتی", "بینایی ماشین", "MLOps", "تحلیل داده"];

export default function DashboardPage() {
  const { user } = useDashboard();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    apiRequest<Course[]>("/api/courses/")
      .then((data) => {
        if (!active) return;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        if (err instanceof ApiError) {
          setError(err.message);
        } else {
          setError("دریافت داده‌های داشبورد با مشکل مواجه شد.");
        }
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const publishedCourses = courses.filter((c) => c.is_published);
  const myCourses = courses.filter((c) => c.instructor === user.id);

  const heroCourses =
    user.role === "student"
      ? publishedCourses.slice(0, 4)
      : (myCourses.length ? myCourses : publishedCourses).slice(0, 4);

  const displayName = user.first_name || user.last_name;

  const stats = useMemo(
    () => [
      {
        label: "دوره‌های فعال",
        value: publishedCourses.length,
        helper:
          user.role === "student"
            ? "دوره‌های منتشرشده قابل ثبت‌نام"
            : "وضعیت دوره‌های در حال فروش",
      },
      {
        label: user.role === "student" ? "دوره‌های من" : "دوره‌های من به عنوان مدرس",
        value: myCourses.length || "۰",
        helper:
          user.role === "student"
            ? "دوره‌های ثبت‌نام شده"
            : "دوره‌هایی که تو تدریس می‌کنی",
      },
      {
        label: "پیش‌نویس/در انتظار انتشار",
        value: courses.length - publishedCourses.length,
        helper: "برای مدیران و مدرس‌ها",
      },
      {
        label: "میانگین قیمت",
        value:
          courses.length > 0
            ? `${averagePrice(courses).toLocaleString("fa-IR")} تومان`
            : "—",
        helper: "بر اساس لیست دوره‌ها",
      },
    ],
    [courses, myCourses.length, publishedCourses.length, user.role],
  );

  return (
    <div className="space-y-8 w-full">
      <header className="relative overflow-hidden rounded-4xl bg-gradient-to-br from-pardis-primary-700 via-pardis-secondary-600 to-pardis-primary-950 text-white shadow-lg ring-1 ring-white/10 group-data-[dashboard-theme=dark]/dashboard:from-[#0b1f2d] group-data-[dashboard-theme=dark]/dashboard:via-[#0f3043] group-data-[dashboard-theme=dark]/dashboard:to-[#060e18] group-data-[dashboard-theme=dark]/dashboard:ring-white/15">
        <div className="absolute -left-16 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" aria-hidden="true" />
        <div className="absolute -right-24 bottom-0 h-56 w-56 rounded-full bg-cyan-200/15 blur-3xl" aria-hidden="true" />
        <div className="absolute inset-x-0 top-0 h-px bg-white/20 opacity-50" aria-hidden="true" />

        <div className="relative space-y-4 p-6 sm:p-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold ring-1 ring-white/20">
            <span className="size-2 rounded-full bg-white/80" aria-hidden="true" />
            فضای کاربری اختصاصی
          </span>
          <Heading
            as="h1"
            className="!text-[2.4rem] sm:!text-[3.2rem] text-white drop-shadow-sm"
          >
            {displayName ? `سلام ${displayName} 👋` : "سلام 👋"}
          </Heading>
          <p className="max-w-2xl text-base/7 text-white/80">
            داشبورد یک نگاه فوری به وضعیت دوره‌ها، انتشارها و مسیر یادگیری به تو می‌دهد. همه‌چیز این‌جاست تا بدون حواس‌پرتی، تصمیم بعدی را بگیری.
          </p>
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((item) => (
          <StatCard
            key={item.label}
            label={item.label}
            value={item.value}
            helper={item.helper}
          />
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="space-y-6">
          <section className="rounded-3xl bg-white/90 ring-1 ring-pardis-primary/10 shadow-xs backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="flex items-center justify-between gap-3 border-b border-black/5 px-5 py-4 group-data-[dashboard-theme=dark]/dashboard:border-white/10">
              <div>
                <h2 className="text-base font-semibold text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
                  مسیر یادگیری/مدیریت دوره‌ها
                </h2>
                <p className="mt-1 text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                  آخرین دوره‌هایی که برای تو در دسترس هستند.
                </p>
              </div>
              <Button variant="outline" href="/dashboard/courses">
                تمام دوره‌ها
              </Button>
            </div>
            {loading ? (
              <div className="p-5 text-sm text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                در حال بارگذاری دوره‌ها...
              </div>
            ) : heroCourses.length === 0 ? (
              <EmptyState
                title="هنوز دوره‌ای نداری"
                description={
                  user.role === "student"
                    ? "از بخش دوره‌ها یک دوره را انتخاب کن یا با پشتیبانی تماس بگیر."
                    : "برای شروع، اولین دوره‌ات را بساز و منتشر کن."
                }
                action={
                  <Button variant="outline" href="/dashboard/courses">
                    رفتن به لیست دوره‌ها
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 p-5 md:grid-cols-2">
                {heroCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </section>

          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
                  پیشنهاد برای تو
                </h2>
                <p className="mt-1 text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                  بر اساس تخصص و نقش فعلی‌ات.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              {recommendedTags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>
          </section>
        </section>

        <aside className="space-y-6">
          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <h2 className="mb-3 text-base font-semibold text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
              رویدادهای پیش‌رو
            </h2>
            <div className="space-y-3">
              {upcomingFromCourses(publishedCourses).map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2 text-xs text-gray-800 group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/60 group-data-[dashboard-theme=dark]/dashboard:text-slate-100"
                >
                  <div className="font-medium">{item.title}</div>
                  <div className="mt-1 text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                    {item.date}
                  </div>
                </div>
              ))}
              {publishedCourses.length === 0 && (
                <EmptyState
                  title="فعلاً رویداد فعالی نیست"
                  description="با انتشار یا ثبت‌نام در یک دوره، رویدادها این‌جا نمایش داده می‌شوند."
                />
              )}
            </div>
          </section>

          <section className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <h2 className="mb-3 text-base font-semibold text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
              آخرین بروزرسانی‌ها
            </h2>
            <ul className="space-y-3 text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
              {recentActivity(courses).map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-black/5 bg-white/70 px-3 py-2 group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
                      {item.title}
                    </span>
                    <Badge color={item.is_published ? "green" : "amber"}>
                      {item.is_published ? "منتشر شده" : "پیش‌نویس"}
                    </Badge>
                  </div>
                  <div className="mt-1 text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                    آخرین بروزرسانی: {formatDate(item.updated_at)}
                  </div>
                </li>
              ))}
              {courses.length === 0 && (
                <EmptyState
                  title="فعلاً فعالیتی نیست"
                  description="هنوز دوره‌ای بارگذاری یا به‌روزرسانی نشده است."
                />
              )}
              {error && (
                <li className="text-[11px] text-red-600 group-data-[dashboard-theme=dark]/dashboard:text-red-300">
                  {error}
                </li>
              )}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

type StatCardProps = {
  label: string;
  value: number | string;
  helper?: string;
};

function StatCard({ label, value, helper }: StatCardProps) {
  return (
    <div className="rounded-3xl bg-white/90 px-5 py-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
      <div className="text-sm font-semibold text-pardis-secondary/80 group-data-[dashboard-theme=dark]/dashboard:text-pardis-primary-100">
        {label}
      </div>
      <div className="mt-2 text-[1.35rem] font-semibold leading-tight tracking-tight text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
        {value}
      </div>
      {helper && (
        <div className="mt-1 text-[12px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
          {helper}
        </div>
      )}
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-black/5 bg-white/90 p-4 shadow-xs group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/70 group-data-[dashboard-theme=dark]/dashboard:shadow-[0_15px_50px_-30px_rgba(0,0,0,0.85)]">
      <div>
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold text-gray-950 group-data-[dashboard-theme=dark]/dashboard:text-white">
            {course.title}
          </h3>
          <Badge color={course.is_published ? "green" : "amber"}>
            {course.is_published ? "منتشر شده" : "پیش‌نویس"}
          </Badge>
        </div>
        <p className="mt-1 line-clamp-2 text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
          {course.description || "بدون توضیح"}
        </p>
        <p className="mt-1 text-[11px] text-pardis-secondary group-data-[dashboard-theme=dark]/dashboard:text-pardis-primary-100">
          {course.instructor_name || "بدون نام مدرس"}
        </p>
      </div>
      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
          <span>هزینه</span>
          <span>
            {course.is_free
              ? "رایگان"
              : `${Number(course.price || 0).toLocaleString("fa-IR")} تومان`}
          </span>
        </div>
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            className="w-full text-xs"
            href={`/courses/${course.slug}`}
          >
            مشاهده جزئیات
          </Button>
        </div>
      </div>
    </div>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-pardis-primary/20 bg-white/70 px-3 py-1 text-[11px] font-medium text-gray-700 group-data-[dashboard-theme=dark]/dashboard:border-white/15 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/60 group-data-[dashboard-theme=dark]/dashboard:text-slate-200">
      {children}
    </span>
  );
}

function formatDate(value: string) {
  return formatPersianDate(value, { includeTime: true });
}

function averagePrice(list: Course[]) {
  if (!list.length) return 0;
  const sum = list.reduce((acc, course) => acc + Number(course.price || 0), 0);
  return Math.round(sum / list.length);
}

function upcomingFromCourses(list: Course[]) {
  return list.slice(0, 3).map((course) => ({
    id: course.id,
    title: `مرور ${course.title}`,
    date: `آخرین ویرایش: ${formatDate(course.updated_at)}`,
  }));
}

function recentActivity(list: Course[]) {
  return [...list]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime(),
    )
    .slice(0, 4);
}
