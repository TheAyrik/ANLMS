"use client";

import React from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/text";

import { useDashboard } from "../dashboard-context";

export default function ProfilePage() {
  const { user, refresh, logout } = useDashboard();

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-pardis-secondary/80 group-data-[dashboard-theme=dark]/dashboard:text-pardis-primary-100">
            پروفایل کاربری
          </p>
          <Heading
            as="h1"
            className="!text-3xl sm:!text-[2.6rem] group-data-[dashboard-theme=dark]/dashboard:!text-white"
          >
            اطلاعات حساب و نقش دسترسی
          </Heading>
          <p className="mt-2 text-sm text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
            مشخصات ورود، نقش دسترسی و وضعیت فعلی حساب را یکجا ببین.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={refresh}>
            بروزرسانی اطلاعات
          </Button>
          <Button variant="secondary" onClick={logout}>
            خروج امن
          </Button>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
          <div className="flex items-center justify-between border-b border-black/5 pb-3 group-data-[dashboard-theme=dark]/dashboard:border-white/10">
            <h2 className="text-base font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              مشخصات اصلی
            </h2>
            <Badge color="blue">{roleLabel(user.role)}</Badge>
          </div>
          <dl className="grid gap-4 py-4 text-sm text-gray-800 group-data-[dashboard-theme=dark]/dashboard:text-slate-200 sm:grid-cols-2">
            <InfoRow label="نام">
              {user.first_name || "—"}
            </InfoRow>
            <InfoRow label="نام خانوادگی">
              {user.last_name || "—"}
            </InfoRow>
            <InfoRow label="نام کاربری">
              {user.username}
            </InfoRow>
            <InfoRow label="ایمیل">
              {user.email}
            </InfoRow>
            <InfoRow label="شناسه کاربر">
              <span className="font-mono text-xs">#{user.id}</span>
            </InfoRow>
            <InfoRow label="سطح دسترسی">
              {roleDescription(user.role)}
            </InfoRow>
          </dl>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              امنیت حساب
            </div>
            <ul className="mt-2 space-y-2 text-xs text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">
              <li>• از اشتراک‌گذاری کوکی/مرورگر با دیگران خودداری کن.</li>
              <li>• حتماً پس از اتمام کار در دستگاه عمومی از حساب خارج شو.</li>
              <li>• نقش‌ها فقط از طریق ادمین سیستم تغییر می‌کنند.</li>
            </ul>
            <div className="mt-4 flex gap-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={logout}
              >
                خروج از همه نشست‌ها
              </Button>
            </div>
          </section>

          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur group-data-[dashboard-theme=dark]/dashboard:border group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/80 group-data-[dashboard-theme=dark]/dashboard:ring-white/10">
            <div className="text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
              دسترسی‌های سفارشی
            </div>
            <EmptyState
              title="در حال توسعه"
              description="به‌زودی امکان مدیریت اعلان‌ها و ترجیحات حساب اضافه می‌شود."
            />
          </section>
        </aside>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-black/5 bg-white/80 px-3 py-2 group-data-[dashboard-theme=dark]/dashboard:border-white/10 group-data-[dashboard-theme=dark]/dashboard:bg-slate-900/60">
      <div className="text-xs font-medium text-pardis-gray group-data-[dashboard-theme=dark]/dashboard:text-slate-400">{label}</div>
      <div className="mt-1 text-sm font-semibold text-gray-900 group-data-[dashboard-theme=dark]/dashboard:text-white">
        {children}
      </div>
    </div>
  );
}

function roleLabel(role: string) {
  if (role === "admin") return "ادمین";
  if (role === "instructor") return "مدرس";
  return "دانشجو";
}

function roleDescription(role: string) {
  if (role === "admin") {
    return "تحت عنوان ادمین می‌توانی همه بخش‌ها را مدیریت کنی.";
  }
  if (role === "instructor") {
    return "به عنوان مدرس می‌توانی دوره ایجاد و ویرایش کنی.";
  }
  return "دانشجو به محتوای منتشر شده دسترسی دارد.";
}
