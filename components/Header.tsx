"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import type { GitHubProfile } from "@/lib/github";

const navigation = [
  { href: "/#home", label: "Home" },
  { href: "/#projects", label: "Projects" },
  { href: "/#about", label: "About" },
  { href: "/#skills", label: "Skills" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function Header({ profile }: { profile: GitHubProfile }) {
  const pathname = usePathname();
  const lenis = useLenis();
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (pathname !== "/") {
      return;
    }

    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(2)))
      .filter((section): section is HTMLElement => section !== null);

    const updateActiveSection = () => {
      setActiveSection(window.location.hash.slice(1) || "home");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((entry) => entry.isIntersecting);
        if (intersecting.length > 0) {
          intersecting.sort((a, b) => b.intersectionRatio - a.intersectionRatio);
          setActiveSection(intersecting[0].target.id);
        }
      },
      {
        rootMargin: "0px -25% 0px -25%",
        threshold: [0.1, 0.3, 0.5, 0.8],
      },
    );

    sections.forEach((section) => observer.observe(section));
    updateActiveSection();
    window.addEventListener("hashchange", updateActiveSection);

    return () => {
      observer.disconnect();
      window.removeEventListener("hashchange", updateActiveSection);
    };
  }, [pathname]);

  useEffect(() => {
    if (pathname === "/") {
      return;
    }

    const closeMenu = window.setTimeout(() => setIsMenuOpen(false), 0);
    return () => window.clearTimeout(closeMenu);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    const menuButton = menuButtonRef.current;
    document.body.style.overflow = "hidden";

    const firstMenuLink = mobileMenuRef.current?.querySelector<HTMLAnchorElement>("a");
    firstMenuLink?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        return;
      }

      if (event.key !== "Tab" || !mobileMenuRef.current) {
        return;
      }

      const focusableElements = mobileMenuRef.current.querySelectorAll<HTMLElement>(
        "a[href], button:not([disabled])",
      );
      const firstFocusable = focusableElements[0];
      const lastFocusable = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable?.focus();
      } else if (!event.shiftKey && document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable?.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      lenis?.start();
      menuButton?.focus();
    };
  }, [isMenuOpen, lenis]);

  const renderNavigation = (mobile = false) =>
    navigation.map((item) => (
      <Link
        href={item.href}
        className={`nav-link${mobile ? " mobile-nav-link" : ""}`}
        aria-current={pathname === "/" && activeSection === item.href.slice(2) ? "page" : undefined}
        key={item.href}
        onClick={(event) => {
          if (mobile) {
            setIsMenuOpen(false);
          }
          if (pathname === "/") {
            const targetId = item.href.slice(2);
            const targetEl = document.getElementById(targetId);
            if (targetEl) {
              if (lenis) {
                event.preventDefault();
                lenis.scrollTo(targetEl, { offset: 0 });
                window.history.pushState(null, "", item.href);
                setActiveSection(targetId);
              }
            }
          }
        }}
      >
        {item.label}
        {pathname === "/" && activeSection === item.href.slice(2) ? (
          <motion.span
            className="nav-link-underline"
            layoutId={mobile ? "mobile-nav-link-underline" : "nav-link-underline"}
          />
        ) : null}
      </Link>
    ));

  return (
    <header id="header-outer">
      <div id="header-inner">
        <div id="header-container">
          <Link href="/" id="username-container">
            <Image src={profile.avatar_url} alt={`${profile.login} avatar`} width={40} height={40} id="username-logo" />
            <span>{profile.login}</span>
          </Link>
          <nav id="nav-links" aria-label="Main navigation">
            <div id="nav-container">{renderNavigation()}</div>
          </nav>
          <button
            ref={menuButtonRef}
            id="menu-toggle"
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
        <AnimatePresence>
          {isMenuOpen ? (
            <motion.div
              ref={mobileMenuRef}
              id="mobile-menu"
              data-lenis-prevent
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <nav aria-label="Mobile navigation">{renderNavigation(true)}</nav>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}
