"use client";

import { ReactLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHorizontalPage = pathname === "/";
  // Initialize to false so ReactLenis is always mounted on first render,
  // avoiding the hydration-flicker / scroll-position-reset bug that occurred
  // when the previous null initial state caused a conditional remount.
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

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
    return () => {
      document.documentElement.classList.remove("page-horizontal");
      document.body.classList.remove("page-horizontal");
    };
  }, [isHorizontalPage]);

  // Fallback wheel scroll if reduced motion is preferred on horizontal page
  useEffect(() => {
    if (!isHorizontalPage || !prefersReducedMotion) {
      return;
    }

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.defaultPrevented || !e.cancelable) return;

      // Let nested controls consume their own vertical scrolling first.
      for (const element of e.composedPath()) {
        if (!(element instanceof HTMLElement) || element === document.body) break;
        if (element.hasAttribute("data-lenis-prevent") ||
            element.hasAttribute("data-lenis-prevent-wheel")) return;
        const { overflowY } = window.getComputedStyle(element);
        if (/auto|scroll/.test(overflowY) && element.scrollHeight > element.clientHeight &&
            ((e.deltaY < 0 && element.scrollTop > 0) ||
             (e.deltaY > 0 && element.scrollTop + element.clientHeight < element.scrollHeight))) return;
      }

      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      const multiplier = e.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 :
        e.deltaMode === WheelEvent.DOM_DELTA_PAGE ? window.innerWidth : 1;
      e.preventDefault();
      window.scrollBy({ left: e.deltaY * multiplier, behavior: "instant" });
    };

    window.addEventListener("wheel", handleWheel, { passive: false });
    return () => window.removeEventListener("wheel", handleWheel);
  }, [isHorizontalPage, prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <>{children}</>;
  }

  return (
    <ReactLenis
      root
      key={isHorizontalPage ? "horizontal" : "vertical"}
      options={
        isHorizontalPage
          ? {
              lerp: 0.075,
              orientation: "horizontal",
              gestureOrientation: "both",
              anchors: true,
              touchMultiplier: 1.5,
              wheelMultiplier: 1.2,
              allowNestedScroll: true,
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
