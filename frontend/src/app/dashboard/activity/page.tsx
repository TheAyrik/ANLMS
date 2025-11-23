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
  is_published: boolean;
  updated_at: string;
  created_at: string;
  instructor: number;
  instructor_name?: string;
};

type ActivityItem = {
  id: string;
  title: string;
  description: string;
  time: string;
  status: "info" | "success" | "warning";
};

export default function ActivityPage() {
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
            : "خطا در دریافت فعالیت‌ها",
        );
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const activities = useMemo(() => buildActivity(courses, user), [courses, user]);
  const focusItems = useMemo(
    () => courses.filter((c) => !c.is_published && user.role !== "student"),
    [courses, user.role],
  );

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-pardis-secondary/80">
            پایش فعالیت‌ها و هشدارها
          </p>
          <Heading as="h1" className="!text-3xl sm:!text-[2.6rem]">
            فعالیت‌ها و اولویت‌های امروز
          </Heading>
          <p className="mt-2 text-sm text-pardis-gray">
            از آخرین بروزرسانی‌ها، تغییر وضعیت انتشار و اقدام‌های فوری مطلع شو.
          </p>
        </div>
        <Button variant="secondary" href="/dashboard/reports">
          رفتن به گزارش‌ها
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
          <div className="flex items-center justify-between border-b border-black/5 pb-3">
            <h2 className="text-base font-semibold text-gray-900">
              تایم‌لاین
            </h2>
            <span className="text-xs text-pardis-gray">
              {activities.length} رویداد
            </span>
          </div>
          {loading ? (
            <p className="py-4 text-sm text-pardis-gray">
              در حال دریافت فعالیت‌ها...
            </p>
          ) : activities.length === 0 ? (
            <EmptyState
              title="فعلاً فعالیت ثبت نشده"
              description="با ایجاد یا بروزرسانی یک دوره، تایم‌لاین فعال می‌شود."
            />
          ) : (
            <ul className="space-y-3 py-4">
              {activities.map((item) => (
                <li
                  key={item.id}
                  className="rounded-2xl border border-black/5 bg-white/90 px-4 py-3 shadow-xs"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-semibold text-gray-900">
                      {item.title}
                    </div>
                    <Badge color={badgeColor(item.status)}>
                      {item.status === "success"
                        ? "منتشر شد"
                        : item.status === "warning"
                        ? "نیاز به اقدام"
                        : "فعالیت"}
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-pardis-gray">
                    {item.description}
                  </p>
                  <div className="mt-2 text-[11px] text-pardis-gray">
                    {item.time}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {error && <p className="text-xs text-red-600">{error}</p>}
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">
                اولویت‌های فوری
              </div>
              <Badge color="amber">{focusItems.length}</Badge>
            </div>
            {focusItems.length === 0 ? (
              <EmptyState
                title="اقدام فوری ندارید"
                description="همه چیز به‌روز است."
              />
            ) : (
              <ul className="mt-3 space-y-3 text-xs text-pardis-gray">
                {focusItems.map((course) => (
                  <li
                    key={course.id}
                    className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-gray-900">
                        {course.title}
                      </span>
                      <Badge color="amber">پیش‌نویس</Badge>
                    </div>
                    <div className="mt-1 text-[11px]">
                      آخرین ویرایش: {formatDate(course.updated_at)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <div className="text-sm font-semibold text-gray-900">
              نکات امنیتی
            </div>
            <ul className="mt-2 space-y-2 text-xs text-pardis-gray">
              <li>• از اشتراک‌گذاری لینک پنل ادمین خودداری کن.</li>
              <li>• در صورت تغییر نقش کاربران، مجوزها را بازبینی کن.</li>
              <li>• برای ورود، حتماً از مرورگر مطمئن استفاده کن.</li>
            </ul>
          </section>
        </aside>
      </div>
    </div>
  );
}

function buildActivity(courses: Course[], user: { id: number; role: string }) {
  const sorted = [...courses].sort(
    (a, b) =>
      new Date(b.updated_at).getTime() -
      new Date(a.updated_at).getTime(),
  );

  return sorted.slice(0, 8).map<ActivityItem>((course) => {
    const mine = course.instructor === user.id;
    const title = mine
      ? `دوره «${course.title}» توسط شما ${course.is_published ? "منتشر شد" : "ویرایش شد"}`
      : `دوره «${course.title}» بروزرسانی شد`;

    return {
      id: `${course.id}-${course.updated_at}`,
      title,
      description: course.is_published
        ? "دوره در دسترس عموم است."
        : "وضعیت هنوز پیش‌نویس است، برای انتشار بررسی کن.",
      time: formatDate(course.updated_at),
      status: course.is_published
        ? "success"
        : mine
        ? "warning"
        : "info",
    };
  });
}

function formatDate(value: string) {
  return formatPersianDate(value, { includeTime: true });
}

function badgeColor(status: ActivityItem["status"]) {
  if (status === "success") return "green" as const;
  if (status === "warning") return "amber" as const;
  return "blue" as const;
}
