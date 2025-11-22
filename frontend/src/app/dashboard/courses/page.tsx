"use client";

import dayjs from "dayjs";
import "dayjs/locale/fa";
import React, { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/text";
import { ApiError, apiRequest } from "@/lib/api";

import { useDashboard } from "../dashboard-context";

type Course = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price: string;
  is_free: boolean;
  instructor: number;
  instructor_name?: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export default function CoursesPage() {
  const { user } = useDashboard();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [onlyMine, setOnlyMine] = useState(false);
  const [onlyDrafts, setOnlyDrafts] = useState(false);

  const canManage =
    user.role === "admin" || user.role === "instructor";

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
        setError(
          err instanceof ApiError
            ? err.message
            : "خطا در دریافت لیست دوره‌ها",
        );
      })
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) =>
        search
          ? course.title.includes(search) ||
            course.slug.includes(search)
          : true,
      )
      .filter((course) =>
        onlyMine ? course.instructor === user.id : true,
      )
      .filter((course) =>
        onlyDrafts ? !course.is_published : true,
      )
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() -
          new Date(a.updated_at).getTime(),
      );
  }, [courses, onlyDrafts, onlyMine, search, user.id]);

  const myCoursesCount = courses.filter(
    (c) => c.instructor === user.id,
  ).length;
  const draftCount = courses.filter((c) => !c.is_published).length;

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-pardis-secondary/80">
            مدیریت دوره‌ها
          </p>
          <Heading as="h1" className="!text-3xl sm:!text-[2.6rem]">
            دوره‌ها - {user.role === "student" ? "یادگیرنده" : "مدرس/ادمین"}
          </Heading>
          <p className="mt-2 text-sm text-pardis-gray">
            لیست کامل دوره‌ها. برای ایجاد، ویرایش یا انتشار دوره‌ها از همین‌جا اقدام کن.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" href="/dashboard">
            بازگشت به داشبورد
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur sm:p-5">
          <div className="flex flex-col gap-4 border-b border-black/5 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="جستجو بر اساس عنوان یا اسلاگ"
                className="w-full rounded-xl border border-black/5 bg-white/70 px-3 py-2 text-sm text-gray-900 shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-pardis-primary sm:w-64"
              />
              <ToggleButton
                active={onlyMine}
                onClick={() => setOnlyMine((prev) => !prev)}
              >
                فقط دوره‌های من ({myCoursesCount})
              </ToggleButton>
              <ToggleButton
                active={onlyDrafts}
                onClick={() => setOnlyDrafts((prev) => !prev)}
              >
                فقط پیش‌نویس‌ها ({draftCount})
              </ToggleButton>
            </div>
            <div className="text-xs text-pardis-gray">
              {courses.length} دوره ثبت شده
            </div>
          </div>

          {loading ? (
            <div className="py-6 text-sm text-pardis-gray">
              در حال بارگذاری دوره‌ها...
            </div>
          ) : filteredCourses.length === 0 ? (
            <EmptyState
              title="دوره‌ای پیدا نشد"
              description="فیلترها را تغییر بده یا یک دوره جدید بساز."
            />
          ) : (
            <div className="grid gap-4 py-4 md:grid-cols-2">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
          {error && (
            <div className="text-xs text-red-600">{error}</div>
          )}
        </section>

        {canManage && (
          <aside className="space-y-4">
            <NewCourseForm
              onCreated={(newCourse) =>
                setCourses((prev) => [newCourse, ...prev])
              }
              instructorId={user.id}
            />

            <div className="rounded-2xl bg-white/90 p-4 ring-1 ring-pardis-primary/10 backdrop-blur">
              <div className="text-sm font-semibold text-gray-900">
                راهنمای نقش‌ها
              </div>
              <ul className="mt-2 space-y-2 text-xs text-pardis-gray">
                <li>• ادمین می‌تواند همه دوره‌ها را مشاهده و ویرایش کند.</li>
                <li>• مدرس فقط می‌تواند دوره‌های خود را ایجاد/ویرایش کند.</li>
                <li>• دانشجو دسترسی ساخت ندارد و فقط دوره‌های منتشر شده را می‌بیند.</li>
              </ul>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  return (
    <article className="flex h-full flex-col justify-between rounded-2xl border border-black/5 bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {course.title}
          </h3>
          <p className="mt-1 line-clamp-2 text-[11px] text-pardis-gray">
            {course.description || "بدون توضیح"}
          </p>
          <div className="mt-2 flex items-center gap-2 text-[11px] text-pardis-secondary">
            <span className="rounded-full bg-pardis-primary-50 px-2 py-1">
              {course.instructor_name || "مدرس تعیین نشده"}
            </span>
          </div>
        </div>
        <Badge color={course.is_published ? "green" : "amber"}>
          {course.is_published ? "منتشر شده" : "پیش‌نویس"}
        </Badge>
      </div>
      <div className="mt-3 space-y-2 text-[11px] text-gray-700">
        <div className="flex items-center justify-between">
          <span>اسلاگ</span>
          <span className="dir-ltr font-mono text-xs text-pardis-gray">
            {course.slug}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>قیمت</span>
          <span>
            {course.is_free
              ? "رایگان"
              : `${Number(course.price || 0).toLocaleString("fa-IR")} تومان`}
          </span>
        </div>
        <div className="flex items-center justify-between text-pardis-gray">
          <span>آخرین بروزرسانی</span>
          <span>{formatDate(course.updated_at)}</span>
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <Button variant="outline" className="w-full text-xs" href={`/courses/${course.slug}`}>
          مشاهده عمومی
        </Button>
      </div>
    </article>
  );
}

type NewCourseFormProps = {
  onCreated: (course: Course) => void;
  instructorId: number;
};

function NewCourseForm({ onCreated, instructorId }: NewCourseFormProps) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [isPublished, setIsPublished] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [slugEdited, setSlugEdited] = useState(false);

  useEffect(() => {
    if (!slugEdited) {
      setSlug(slugify(title));
    }
  }, [slugEdited, title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("slug", slug || slugify(title));
      formData.append("description", description);
      formData.append("price", price || "0");
      formData.append("is_published", String(isPublished));
      formData.append("instructor", String(instructorId));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const created = await apiRequest<Course>("/api/courses/", {
        method: "POST",
        body: formData,
      });
      onCreated(created);
      setTitle("");
      setSlug("");
      setDescription("");
      setPrice("0");
      setIsPublished(false);
      setImageFile(null);
      setSlugEdited(false);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "ثبت دوره با خطا مواجه شد",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            ایجاد دوره جدید
          </div>
          <p className="text-[11px] text-pardis-gray">
            عنوان، توضیح و هزینه را وارد کن. ویرایش پیشرفته را می‌توانی بعداً انجام دهی.
          </p>
        </div>
        <Badge color={isPublished ? "green" : "amber"}>
          {isPublished ? "انتشار" : "پیش‌نویس"}
        </Badge>
      </div>

      <div className="space-y-3 text-sm">
        <label className="block space-y-1">
          <span className="text-gray-800">عنوان</span>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-pardis-primary"
            placeholder="مثلاً مبانی یادگیری ماشین"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-gray-800">اسلاگ</span>
          <input
            required
            value={slug}
            onChange={(e) => {
              setSlug(e.target.value);
              setSlugEdited(true);
            }}
            className="w-full rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-pardis-primary dir-ltr"
            placeholder="machine-learning-basics"
          />
        </label>
        <label className="block space-y-1">
          <span className="text-gray-800">توضیحات</span>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-pardis-primary"
            placeholder="مروری کوتاه بر محتوای دوره..."
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block space-y-1">
            <span className="text-gray-800">قیمت (تومان)</span>
            <input
              type="number"
              min={0}
              step="1000"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-pardis-primary dir-ltr"
            />
          </label>
          <label className="block space-y-1">
            <span className="text-gray-800">کاور دوره</span>
            <input
              type="file"
              accept="image/*"
              required
              onChange={(e) =>
                setImageFile(e.target.files?.[0] ?? null)
              }
              className="block w-full cursor-pointer rounded-xl border border-black/5 bg-white/80 px-3 py-2 text-sm file:mr-2 file:rounded-lg file:border-0 file:bg-pardis-primary file:px-3 file:py-1 file:text-white"
            />
          </label>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-gray-800">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="size-4 rounded border border-black/10 text-pardis-primary focus:ring-pardis-primary"
            />
            انتشار پس از ذخیره
          </label>
          <Button type="submit" disabled={submitting} className="px-4 py-2 text-sm">
            {submitting ? "در حال ثبت..." : "ثبت دوره"}
          </Button>
        </div>
        {error && (
          <div className="text-xs text-red-600">{error}</div>
        )}
      </div>
    </form>
  );
}

function ToggleButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-3 py-1 text-xs font-semibold",
        active
          ? "bg-pardis-primary text-white shadow-sm"
          : "bg-white/80 text-pardis-gray ring-1 ring-black/5 hover:text-gray-900",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function slugify(value: string) {
  return value
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .toLowerCase();
}

function formatDate(value: string) {
  return dayjs(value).locale("fa").format("D MMM HH:mm");
}
