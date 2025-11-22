"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function TopLoader() {
  const pathname = usePathname();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(18);

    const tick = setInterval(() => {
      setProgress((p) => (p < 85 ? p + 12 : p));
    }, 180);

    const finish = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setVisible(false), 240);
    }, 900);

    return () => {
      clearInterval(tick);
      clearTimeout(finish);
      setProgress(100);
      setTimeout(() => setVisible(false), 240);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-50 h-1 bg-pardis-primary/15 backdrop-blur">
      <div
        className="h-full rounded-e-full bg-pardis-primary shadow-[0_0_12px_rgba(19,181,222,0.45)] transition-[width]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
