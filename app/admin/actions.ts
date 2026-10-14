"use server";

import { eq } from "drizzle-orm";
import { revalidatePath, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { projects } from "@/db/schema";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validators/project";

export type ProjectActionState = { error?: string; success?: string };

async function requireAdmin(): Promise<void> {
  const session = await getSession();
  if (!session || session.email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/admin/login");
  }
}

function refreshProjects(): void {
  updateTag("projects");
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/projects");
}

export async function saveProject(
  _state: ProjectActionState,
  form: FormData,
): Promise<ProjectActionState> {
  await requireAdmin();
  const id = form.get("id");
  if (id && !z.uuid().safeParse(id).success) return { error: "Invalid project ID." };
  const optional = (name: string) => form.get(name) || null;
  const parsed = createProjectSchema.omit({ gallery: true }).safeParse({
    title: form.get("title"), slug: form.get("slug"),
    summary: optional("summary"), description: optional("description"),
    techTags: String(form.get("techTags") ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
    coverImageUrl: optional("coverImageUrl"), liveUrl: optional("liveUrl"), repoUrl: optional("repoUrl"),
    featured: form.get("featured") === "on", sortOrder: Number(form.get("sortOrder")),
    status: form.get("status"),
  });
  if (!parsed.success) return { error: parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`).join(" ") };
  const values = parsed.data;
  // Restrict public links and covers to web URLs; never store executable schemes.
  for (const url of [values.liveUrl, values.repoUrl, values.coverImageUrl]) {
    if (url && !/^https?:\/\//i.test(url)) return { error: "URLs must start with https:// or http://." };
  }
  if (values.coverImageUrl) {
    const url = new URL(values.coverImageUrl);
    if (url.protocol !== "https:" || url.username || url.password) {
      return { error: "Cover images must use a public HTTPS image URL without embedded credentials." };
    }
  }
  try {
    if (typeof id === "string" && id) {
      const rows = await db.update(projects).set({ ...values, updatedAt: new Date() }).where(eq(projects.id, id)).returning({ id: projects.id });
      if (!rows.length) return { error: "Project no longer exists. Refresh the dashboard." };
    } else {
      await db.insert(projects).values(values);
    }
  } catch {
    return { error: "Could not save. Check that the slug is unique and the database is available." };
  }
  refreshProjects();
  return { success: "Project saved." };
}

export async function deleteProject(
  _state: ProjectActionState,
  form: FormData,
): Promise<ProjectActionState> {
  await requireAdmin();
  const id = z.uuid().safeParse(form.get("id"));
  if (!id.success || form.get("confirmDelete") !== "on") return { error: "Confirm deletion before continuing." };
  try {
    const rows = await db.delete(projects).where(eq(projects.id, id.data)).returning({ id: projects.id });
    if (!rows.length) return { error: "Project no longer exists. Refresh the dashboard." };
  } catch {
    return { error: "Could not delete. Try again when the database is available." };
  }
  refreshProjects();
  return { success: "Project deleted." };
}
