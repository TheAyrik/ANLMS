"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "@/components/button";
import { Container } from "@/components/container";
import { Logo } from "@/components/logo";
import { ApiError, apiRequest } from "@/lib/api";

import {
  DashboardContext,
  DashboardUser,
} from "./dashboard-context";

type NavItem = {
  name: string;
  href: string;
};

const mainNav: NavItem[] = [
  { name: "داشبورد", href: "/dashboard" },
  { name: "دوره‌ها", href: "/dashboard/courses" },
  { name: "فعالیت‌ها", href: "/dashboard/activity" },
  { name: "گزارش‌ها", href: "/dashboard/reports" },
];

const secondaryNav: NavItem[] = [
  { name: "تنظیمات", href: "/dashboard/settings" },
  { name: "پروفایل", href: "/dashboard/profile" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || (href !== "/dashboard" && pathname.startsWith(href));

  const refreshUser = useCallback(async () => {
    try {
      const profile = await apiRequest<DashboardUser>("/api/users/me/", {
        onUnauthorized: () => router.replace("/login"),
      });
      setUser(profile);
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        router.replace("/login");
        return;
      }
      console.error("Failed to load profile", error);
    } finally {
      setLoadingUser(false);
    }
  }, [router]);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const handleLogout = useCallback(async () => {
    setLoggingOut(true);
    try {
      await apiRequest("/api/users/logout/", { method: "POST" });
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout request failed:", error);
    } finally {
      setLoggingOut(false);
    }
  }, [router]);

  const userRoleLabel = useMemo(() => {
    if (!user) return "";
    if (user.role === "admin") return "ادمین";
    if (user.role === "instructor") return "مدرس";
    return "دانشجو";
  }, [user]);

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-white from-40% to-pardis-primary-50">
        <div className="rounded-2xl bg-white/90 px-8 py-6 text-center shadow-xs ring-1 ring-pardis-primary/10">
          <p className="text-sm font-medium text-gray-800">
            در حال آماده‌سازی داشبورد...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <DashboardContext.Provider
      value={{
        user,
        loading: loadingUser,
        refresh: refreshUser,
        logout: handleLogout,
      }}
    >
      <div className="min-h-screen bg-linear-to-b from-white from-40% to-pardis-primary-50">
        <Container className="relative flex min-h-screen flex-col pb-6 pt-4 lg:pt-8">
          <header className="mb-4 flex items-center justify-between gap-3 lg:mb-6">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Logo className="h-7 w-auto" />
              </Link>
              <div>
                <p className="text-xs font-medium text-pardis-secondary/80">
                  دپارتمان آموزش پردیس هوش مصنوعی
                </p>
                <h1 className="text-base font-semibold text-gray-950 sm:text-lg">
                  داشبورد ANLMS
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden flex-col items-end text-xs sm:flex">
                <span className="font-semibold text-gray-900">
                  {user.first_name || user.last_name
                    ? `${user.first_name} ${user.last_name}`.trim()
                    : user.username}
                </span>
                <span className="text-pardis-gray">{userRoleLabel}</span>
              </div>
              <Button
                variant="secondary"
                href="/"
                className="hidden text-xs sm:inline-flex"
              >
                بازگشت به صفحه اصلی
              </Button>
              <Button
                variant="outline"
                className="inline-flex text-xs lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                منو
              </Button>
            </div>
          </header>

          <div className="flex-1 lg:flex lg:gap-6">
            {sidebarOpen && (
              <div className="fixed inset-0 z-40 flex lg:hidden">
                <div
                  className="fixed inset-0 bg-black/40"
                  onClick={() => setSidebarOpen(false)}
                />
                <nav className="relative ml-auto flex h-full w-64 flex-col gap-6 bg-white px-4 py-5 shadow-xl ring-1 ring-black/10">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-gray-900">
                      منوی داشبورد
                    </span>
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="text-xs text-pardis-gray hover:text-gray-900"
                    >
                      بستن
                    </button>
                  </div>

                  <SidebarNav
                    mainNav={mainNav}
                    secondaryNav={secondaryNav}
                    isActive={isActive}
                    onNavigate={() => setSidebarOpen(false)}
                  />
                </nav>
              </div>
            )}

            <aside className="hidden w-64 shrink-0 lg:block">
              <div className="sticky top-6 flex h-[calc(100vh-6rem)] flex-col justify-between rounded-3xl bg-white/90 px-4 py-5 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur">
                <SidebarNav
                  mainNav={mainNav}
                  secondaryNav={secondaryNav}
                  isActive={isActive}
                />

                <div className="mt-6 border-t border-black/5 pt-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">
                        {user.first_name || user.last_name
                          ? `${user.first_name} ${user.last_name}`.trim()
                          : user.username}
                      </div>
                      <div className="text-[12px] text-pardis-gray">
                        {userRoleLabel}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      className="px-3 py-1 text-xs"
                      type="button"
                      onClick={handleLogout}
                      disabled={loggingOut}
                    >
                      {loggingOut ? "..." : "خروج"}
                    </Button>
                  </div>
                </div>
              </div>
            </aside>

            <main className="mt-2 flex-1 w-full lg:mt-0">
              <div className="rounded-3xl bg-white/90 p-4 shadow-xs ring-1 ring-pardis-primary/10 backdrop-blur sm:p-6">
                {children}
              </div>
            </main>
          </div>
        </Container>
      </div>
    </DashboardContext.Provider>
  );
}

function SidebarNav({
  mainNav,
  secondaryNav,
  isActive,
  onNavigate,
}: {
  mainNav: NavItem[];
  secondaryNav: NavItem[];
  isActive: (href: string) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="space-y-1 text-sm">
        {mainNav.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            active={isActive(item.href)}
            onClick={onNavigate}
          >
            {item.name}
          </SidebarLink>
        ))}
      </div>

      <div className="space-y-1 border-t border-black/5 pt-4 text-sm">
        {secondaryNav.map((item) => (
          <SidebarLink
            key={item.href}
            href={item.href}
            active={isActive(item.href)}
            onClick={onNavigate}
          >
            {item.name}
          </SidebarLink>
        ))}
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  active,
  children,
  onClick,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const baseClasses =
    "flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium transition-colors";
  const activeClasses =
    "bg-pardis-primary text-white shadow-sm";
  const inactiveClasses =
    "text-pardis-gray hover:bg-pardis-primary/10 hover:text-gray-900";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`${baseClasses} ${
        active ? activeClasses : inactiveClasses
      }`}
    >
      <span>{children}</span>
      {/* فعلاً فقط یک نقطه وضعیت ساده؛ اگر خواستی آیکن اضافه کن */}
      {active && (
        <span className="h-1.5 w-1.5 rounded-full bg-white/80" />
      )}
    </Link>
  );
}
