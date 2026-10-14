import type { Metadata } from "next";
import Link from "next/link";

import { logout } from "./login/actions";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export const instant = false;

export default async function AdminLayout({
  children,
}: LayoutProps<"/admin">) {
  return (
    <div className="admin-shell">
      <header className="admin-header">
        <strong>Admin</strong>
        <nav aria-label="Admin navigation">
          <Link href="/">Back to site</Link>
          <form action={logout}>
            <button className="admin-link-button" type="submit">
              Log out
            </button>
          </form>
        </nav>
      </header>
      {children}
    </div>
  );
}
