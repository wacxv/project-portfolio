import { redirect } from "next/navigation";

import { getSession } from "@/lib/auth";

export default async function AdminPage() {
  if (!(await getSession())) {
    redirect("/admin/login");
  }

  return (
    <main className="admin-dashboard">
      <h1>Dashboard</h1>
      <p>Projects coming next.</p>
    </main>
  );
}
