"use client";

import {
  Dispatch,
  SetStateAction,
  createContext,
  useContext,
} from "react";

export type DashboardUser = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "student" | "instructor" | "admin";
};

export type DashboardTheme = "light" | "dark";

type DashboardContextValue = {
  user: DashboardUser | null;
  loading: boolean;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  theme: DashboardTheme;
  setTheme: Dispatch<SetStateAction<DashboardTheme>>;
  toggleTheme: () => void;
};

export const DashboardContext =
  createContext<DashboardContextValue | null>(null);

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("Dashboard context is not available");
  }
  return ctx;
}
