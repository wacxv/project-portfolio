"use client";

import { ReactLenis } from "lenis/react";
import { MotionConfig } from "framer-motion";
import { usePathname } from "next/navigation";
import { useLayoutEffect, type ReactNode } from "react";

export default function SmoothScroll({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isHorizontalPage = pathname === "/";
  useLayoutEffect(() => {
    if (isHorizontalPage) {
      document.documentElement.classList.add("page-horizontal");
      document.body.classList.add("page-horizontal");
    } else {
      document.documentElement.classList.remove("page-horizontal");
      document.body.classList.remove("page-horizontal");
    }

    // Hash navigation can scroll an overflow-hidden document vertically.
    // Keep the horizontal page below its fixed header, including after a
    // return from a vertically scrolling route such as /projects.
    const resetVerticalScroll = () => {
      if (window.scrollY !== 0) {
        window.scrollTo({ left: window.scrollX, top: 0, behavior: "instant" });
      }
    };

    if (isHorizontalPage) {
      resetVerticalScroll();
      window.addEventListener("scroll", resetVerticalScroll, { passive: true });
    }

    return () => {
      window.removeEventListener("scroll", resetVerticalScroll);
      document.documentElement.classList.remove("page-horizontal");
      document.body.classList.remove("page-horizontal");
    };
  }, [isHorizontalPage]);

  return (
    <MotionConfig reducedMotion="never">
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
    </MotionConfig>
  );
}
