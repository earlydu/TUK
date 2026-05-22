"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function GlobalLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // expose programmatic control
    (window as any).showGlobalLoader = () => setLoading(true);
    (window as any).hideGlobalLoader = () => setLoading(false);

    const clickHandler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = (target as HTMLAnchorElement).getAttribute("href");
      if (!href) return;

      // show loader for internal product pages
      if (href.startsWith("/product/") || href.includes("/product/")) {
        setLoading(true);
      }
    };

    document.addEventListener("click", clickHandler, true);

    const hideOnPop = () => setLoading(false);
    window.addEventListener("popstate", hideOnPop);
    window.addEventListener("pageshow", hideOnPop);

    return () => {
      document.removeEventListener("click", clickHandler, true);
      window.removeEventListener("popstate", hideOnPop);
      window.removeEventListener("pageshow", hideOnPop);
      (window as any).showGlobalLoader = undefined;
      (window as any).hideGlobalLoader = undefined;
    };
  }, []);

  // Hide loader when the route (pathname) changes
  useEffect(() => {
    if (loading) {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
        <div className="text-white font-medium">Opening page...</div>
      </div>
    </div>
  );
}
