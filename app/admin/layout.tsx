import type { Metadata } from "next";
import Link from "next/link";
import { Suspense, type ReactNode } from "react";

import { logout } from "./login/actions";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return <Suspense fallback={<main className="admin-shell admin-dashboard"><p role="status">Loading admin…</p></main>}><AdminShell>{children}</AdminShell></Suspense>;
}

async function AdminShell({ children }: { children: ReactNode }) {
  const session = await getSession();
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>Admin</strong>
        <nav aria-label="Admin navigation">
          <Link href="/">Back to site</Link>
          {session && <form action={logout}>
            <button className="admin-link-button" type="submit">
              Log out
            </button>
          </form>}
        </nav>
      </header>
      {children}
    </div>
  );
}
