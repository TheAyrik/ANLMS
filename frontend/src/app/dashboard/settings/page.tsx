"use client";

import React, { useEffect, useState } from "react";

import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { EmptyState } from "@/components/empty-state";
import { Heading } from "@/components/text";

import { useDashboard } from "../dashboard-context";

type PreferenceKey = "persistLogin" | "notifications" | "compactUI";

export default function SettingsPage() {
  const { logout } = useDashboard();
  const [prefs, setPrefs] = useState<Record<PreferenceKey, boolean>>({
    persistLogin: true,
    notifications: true,
    compactUI: false,
  });

  useEffect(() => {
    const stored = localStorage.getItem("dashboard:prefs");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Record<PreferenceKey, boolean>;
        setPrefs((prev) => ({ ...prev, ...parsed }));
      } catch (_) {
        // no-op
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dashboard:prefs", JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (key: PreferenceKey) =>
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));

  return (
    <div className="space-y-6 w-full">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium text-pardis-secondary/80">
            تنظیمات و امنیت
          </p>
          <Heading as="h1" className="!text-3xl sm:!text-[2.6rem]">
            کنترل تجربه کاربری و نشست‌ها
          </Heading>
          <p className="mt-2 text-sm text-pardis-gray">
            سلیقه‌های بصری، نحوه ورود و خروج و نکات امنیتی را از این بخش مدیریت کن.
          </p>
        </div>
        <Button variant="secondary" href="/dashboard/profile">
          مشاهده پروفایل
        </Button>
      </header>

      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
          <div className="text-base font-semibold text-gray-900">
            ترجیحات رابط کاربری
          </div>
          <div className="mt-3 space-y-3">
            <PreferenceToggle
              label="حالت فشرده‌سازی کارت‌ها"
              description="کاهش فاصله‌ها و حاشیه‌ها برای نمایش اطلاعات بیشتر در یک صفحه."
              active={prefs.compactUI}
              onToggle={() => toggle("compactUI")}
            />
            <PreferenceToggle
              label="دریافت اعلان‌های سیستمی"
              description="فعال نگه دار تا از تغییر وضعیت دوره‌ها مطلع شوی."
              active={prefs.notifications}
              onToggle={() => toggle("notifications")}
            />
            <PreferenceToggle
              label="حفظ نشست ورود"
              description="تا پایان عمر کوکی‌ها در این مرورگر وارد بمان."
              active={prefs.persistLogin}
              onToggle={() => toggle("persistLogin")}
            />
          </div>
        </section>

        <aside className="space-y-4">
          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-900">
                نشست‌ها و خروج
              </div>
              <Badge color="amber">امنیت</Badge>
            </div>
            <p className="mt-2 text-xs text-pardis-gray">
              در صورت استفاده از دستگاه مشترک، پس از اتمام کار خروج کن.
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={logout}
              >
                خروج از حساب
              </Button>
            </div>
          </section>

          <section className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
            <div className="text-sm font-semibold text-gray-900">
              سایر تنظیمات
            </div>
            <EmptyState
              title="به‌زودی"
              description="امکان مدیریت اعلان‌های کانال‌های مختلف و تغییر زبان در دست توسعه است."
            />
          </section>
        </aside>
      </div>
    </div>
  );
}

function PreferenceToggle({
  label,
  description,
  active,
  onToggle,
}: {
  label: string;
  description: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex items-start justify-between rounded-2xl border border-black/5 bg-white/80 px-3 py-3">
      <div>
        <div className="text-sm font-semibold text-gray-900">
          {label}
        </div>
        <p className="mt-1 text-[11px] text-pardis-gray">
          {description}
        </p>
      </div>
      <button
        type="button"
        onClick={onToggle}
        className={[
          "relative h-6 w-11 rounded-full transition-all",
          active ? "bg-pardis-primary" : "bg-pardis-gray-200",
        ].join(" ")}
        aria-pressed={active}
      >
        <span
          className={[
            "absolute top-[2px] inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-all",
            active ? "left-[22px]" : "left-[2px]",
          ].join(" ")}
        />
      </button>
    </div>
  );
}
