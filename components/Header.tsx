"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import type { GitHubProfile } from "@/lib/github";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/skills", label: "Skills" },
  { href: "/experience", label: "Experience" },
];

export default function Header({ profile }: { profile: GitHubProfile }) {
  const pathname = usePathname();

  return (
    <header id="header-outer">
      <div id="header-inner">
        <div id="header-container">
          <Link href="/" id="username-container">
            <Image src={profile.avatar_url} alt={`${profile.login} avatar`} width={40} height={40} id="username-logo" />
            <span>{profile.login}</span>
          </Link>
          <nav id="nav-container" aria-label="Main navigation">
            {navigation.map((item) => (
              <Link
                href={item.href}
                className={`nav-link${pathname === item.href ? " active" : ""}`}
                aria-current={pathname === item.href ? "page" : undefined}
                key={item.href}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
