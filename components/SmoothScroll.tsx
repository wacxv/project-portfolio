"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHorizontalPage = pathname === "/";
  const [prefersReducedMotion, setPrefersReducedMotion] = useState<boolean | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (isHorizontalPage) {
      document.documentElement.classList.add("page-horizontal");
      document.body.classList.add("page-horizontal");
    } else {
      document.documentElement.classList.remove("page-horizontal");
      document.body.classList.remove("page-horizontal");
    }
  }, [isHorizontalPage]);

  // Fallback wheel scroll if reduced motion is preferred on horizontal page
  useEffect(() => {
    if (!isHorizontalPage || prefersReducedMotion !== true) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        window.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isHorizontalPage, prefersReducedMotion]);

  if (prefersReducedMotion !== false) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      key={isHorizontalPage ? "horizontal" : "vertical"}
      options={
        isHorizontalPage
          ? {
              lerp: 0.08,
              orientation: "horizontal",
              gestureOrientation: "both",
              anchors: true,
              touchMultiplier: 1.2,
              wheelMultiplier: 1,
            }
          : {
              lerp: 0.1,
              orientation: "vertical",
              anchors: true,
            }
      }
    >
      {children}
    </ReactLenis>
  );
}

