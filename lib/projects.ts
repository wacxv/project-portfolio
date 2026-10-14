import "server-only";

import { asc, and, desc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { projects, type Project } from "@/db/schema";
import { db } from "@/lib/db";

const PROJECTS_TAG = "projects";

async function queryFeaturedProjects(): Promise<Project[]> {
  try {
    return await db
      .select()
      .from(projects)
      .where(and(eq(projects.status, "published"), eq(projects.featured, true)))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt))
      .limit(4);
  } catch (error: unknown) {
    console.error("Failed to load featured projects:", error);
    return [];
  }
}

async function queryAllProjects(): Promise<Project[]> {
  try {
    return await db
      .select()
      .from(projects)
      .where(eq(projects.status, "published"))
      .orderBy(asc(projects.sortOrder), desc(projects.createdAt));
  } catch (error: unknown) {
    console.error("Failed to load projects:", error);
    return [];
  }
}

async function queryProjectBySlug(slug: string): Promise<Project | null> {
  try {
    const [project] = await db
      .select()
      .from(projects)
      .where(and(eq(projects.slug, slug), eq(projects.status, "published")))
      .limit(1);

    return project ?? null;
  } catch (error: unknown) {
    console.error(`Failed to load project "${slug}":`, error);
    return null;
  }
}

export const getFeaturedProjects = unstable_cache(
  queryFeaturedProjects,
  ["projects-featured"],
  { tags: [PROJECTS_TAG] },
);

export const getAllProjects = unstable_cache(
  queryAllProjects,
  ["projects-all-v2"],
  { tags: [PROJECTS_TAG], revalidate: 60 },
);

export const getProjectBySlug = (slug: string): Promise<Project | null> =>
  unstable_cache(
    () => queryProjectBySlug(slug),
    ["project-by-slug", slug],
    { tags: [PROJECTS_TAG] },
  )();
