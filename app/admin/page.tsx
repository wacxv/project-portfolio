import { redirect } from "next/navigation";
import { Suspense } from "react";

import { getSession } from "@/lib/auth";
import { asc, desc } from "drizzle-orm";
import { projects, type Project } from "@/db/schema";
import { db } from "@/lib/db";
import ProjectEditor from "./ProjectEditor";

export default function AdminPage() {
  return (
    <Suspense fallback={<main className="admin-dashboard"><h1>Dashboard</h1><p role="status">Loading projects…</p></main>}>
      <AdminDashboard />
    </Suspense>
  );
}

async function AdminDashboard() {
  const session = await getSession();
  if (!session || session.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/admin/login");
  }

  let items: Project[] = [];
  let databaseError = false;
  try {
    items = await db.select().from(projects).orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  } catch {
    databaseError = true;
  }
  return (
    <main className="admin-dashboard">
      <h1>Dashboard</h1>
      <p>Signed in as {session.email}. Manage the projects displayed on your portfolio.</p>
      {databaseError ? <p className="admin-error" role="alert">Could not load projects. Check your database connection and run npm run db:push if the table has not been created.</p> : <>
        <p>{items.length} projects · {items.filter((item) => item.status === "published").length} published · {items.filter((item) => item.status === "draft").length} drafts</p>
        <details className="admin-project-panel">
          <summary>Create a project</summary>
          <ProjectEditor />
        </details>
        {items.length === 0 && <p>No projects yet. Create your first project above.</p>}
        {items.map((project) => <details className="admin-project-panel" key={project.id}>
          <summary>{project.title} <span className="admin-project-status">{project.status}{project.featured ? " · featured" : ""}</span></summary>
          <ProjectEditor project={project} />
        </details>)}
      </>}
    </main>
  );
}
