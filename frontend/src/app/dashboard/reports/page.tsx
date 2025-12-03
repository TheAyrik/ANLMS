"use client";

import React, { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/text";
import { ApiError, apiRequest } from "@/lib/api";
import { formatPersianDate } from "@/lib/date";

import { useDashboard } from "../dashboard-context";

type Course = {
  id: number;
  title: string;
  price: string;
  is_free: boolean;
  is_published: boolean;
  instructor: number;
  instructor_name?: string;
  created_at: string;
  updated_at: string;
};

export default function ReportsPage() {
  const { user } = useDashboard();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    apiRequest<Course[]>("/api/courses/")
      .then((data) => {
        if (!active) return;
        setCourses(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!active) return;
        setError(
          err instanceof ApiError
            ? err.message
            : "خطا در دریافت گزارش‌ها",
        );
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const published = courses.filter((c) => c.is_published);
  const drafts = courses.filter((c) => !c.is_published);
  const freeCourses = courses.filter((c) => c.is_free);
  const myCourses = courses.filter((c) => c.instructor === user.id);
  const projectedRevenue = published.reduce(
    (acc, course) => acc + Number(course.price || 0),
    0,
  );

  const chartData = useMemo(
    () => [
      { label: "منتشر شده", value: published.length, color: "bg-pardis-primary" },
      { label: "پیش‌نویس", value: drafts.length, color: "bg-amber-400" },
      { label: "رایگان", value: freeCourses.length, color: "bg-emerald-500" },
    ],
    [drafts.length, freeCourses.length, published.length],
  );

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-pardis-secondary/80 group-data-[dashboard-theme=dark]/dashboard:text-pardis-primary-100">
            گزارش‌ها و سلامت محتوا
          </p>
          <Heading
            as="h1"
            className="!text-3xl sm:!text-[2.6rem] group-data-[dashboard-theme=dark]/dashboard:!text-white"
          >
            وضعیت دوره‌ها و ظرفیت انتشار
          </Heading>
          <p className="mt-2 text-sm text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
            شاخص‌های کلیدی برای پیگیری انتشار، درآمد بالقوه و محتوای رایگان.
          </p>
        </div>
        <Button variant="secondary" href="/dashboard/courses">
          مدیریت دوره‌ها
        </Button>
      </header>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ReportCard
          label="دوره‌های منتشر شده"
          value={published.length}
          helper="آماده ثبت‌نام"
        />
        <ReportCard
          label="پیش‌نویس‌ها"
          value={drafts.length}
          helper="نیاز به تکمیل/انتشار"
        />
        <ReportCard
          label="دوره‌های رایگان"
          value={freeCourses.length}
          helper="محتوای جذب مخاطب"
        />
        <ReportCard
          label="ارزش بالقوه فروش"
          value={
            published.length
              ? `${projectedRevenue.toLocaleString("fa-IR")} تومان`
              : "—"
          }
          helper="بر اساس قیمت فعلی دوره‌های منتشر شده"
        />
      </section>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
          <div className="flex items-center justify-between border-b border-black/5 pb-3 group-data-[dashboard-theme=dark]/dashboard:border-white/10">
            <h2 className="text-base font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              جزئیات دوره‌ها
            </h2>
            <span className="text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
              {courses.length} دوره ثبت شده
            </span>
          </div>

          {loading ? (
            <p className="py-4 text-sm text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
              در حال دریافت داده...
            </p>
          ) : courses.length === 0 ? (
            <EmptyState
              title="دوره‌ای ثبت نشده"
              description="برای مشاهده گزارش، یک دوره اضافه کنید."
            />
          ) : (
            <div className="space-y-3 py-4">
              {courses.map((course) => (
                <ReportRow key={course.id} course={course} />
              ))}
            </div>
          )}
          {error && (
            <p className="text-xs text-red-600 group-data-[dashboard-theme=dark]/dashboard:text-red-300">
              {error}
            </p>
          )}
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              ترکیب محتوا
            </div>
            <div className="mt-3 space-y-2">
              {chartData.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-pardis-primary/10 group-data-[dashboard-theme=dark]/dashboard:bg-white/10">
                    <div
                      className={`h-full ${item.color}`}
                      style={{
                        width: `${percentage(item.value, courses.length)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              وضعیت دسترسی شما
            </div>
            <ul className="mt-2 space-y-2 text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
              <li>• نقش فعلی: {roleLabel(user.role)}</li>
              <li>• تعداد دوره‌های تحت مدیریت: {myCourses.length}</li>
              <li>
                • آخرین فعالیت:{" "}
                {courses.length
                  ? formatDate(
                      courses
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.updated_at).getTime() -
                            new Date(a.updated_at).getTime(),
                        )[0].updated_at,
                    )
                  : "—"}
              </li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ReportCard({
  label,
  value,
  helper,
}: {
  label: string;
  value: number | string;
  helper?: string;
}) {
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

function ReportRow({ course }: { course: Course }) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-xs group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/70">
      <div className="flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
            {course.title}
          </div>
          <div className="mt-1 text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
            مدرس: {course.instructor_name || "—"}
          </div>
        </div>
        <Badge color={course.is_published ? "green" : "amber"}>
          {course.is_published ? "منتشر شده" : "پیش‌نویس"}
        </Badge>
      </div>
      <div className="mt-2 grid gap-2 text-[11px] text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400 sm:grid-cols-3">
        <div>
          <span className="font-medium text-gray-800 group-data-[dashboard-theme=dark]/dashboard:text-slate-200">قیمت: </span>
          {course.is_free
            ? "رایگان"
            : `${Number(course.price || 0).toLocaleString("fa-IR")} تومان`}
        </div>
        <div>
          <span className="font-medium text-gray-800 group-data-[dashboard-theme=dark]/dashboard:text-slate-200">تاریخ ایجاد: </span>
          {formatDate(course.created_at)}
        </div>
        <div>
          <span className="font-medium text-gray-800 group-data-[dashboard-theme=dark]/dashboard:text-slate-200">آخرین بروزرسانی: </span>
          {formatDate(course.updated_at)}
        </div>
      </div>
    </div>
  );
}

function percentage(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function formatDate(value: string) {
  return formatPersianDate(value);
}

function roleLabel(role: string) {
  if (role === "admin") return "ادمین";
  if (role === "instructor") return "مدرس";
  return "دانشجو";
}
