import dotenv from "dotenv";

import { projects } from "@/db/schema";

const sampleProjects = [
  {
    title: "Portfolio Platform",
    slug: "portfolio-platform",
    summary: "A fast, accessible personal portfolio built with Next.js.",
    description: "A content-driven portfolio with a focused, editorial layout.",
    techTags: ["Next.js", "TypeScript", "Postgres"],
    liveUrl: "https://example.com/portfolio",
    repoUrl: "https://github.com/wacxv/project-portfolio",
    featured: true,
    sortOrder: 1,
    status: "published" as const,
  },
  {
    title: "Neon Data Playground",
    slug: "neon-data-playground",
    summary: "A small application exploring serverless Postgres workflows.",
    description:
      "A practical sandbox for typed queries and branch-based development.",
    techTags: ["Neon", "Drizzle", "React"],
    repoUrl: "https://github.com/wacxv/neon-data-playground",
    featured: true,
    sortOrder: 2,
    status: "published" as const,
  },
  {
    title: "Design System Notes",
    slug: "design-system-notes",
    summary: "A collection of reusable interface patterns and notes.",
    description:
      "A reference project for documenting thoughtful UI decisions.",
    techTags: ["TypeScript", "CSS", "Storybook"],
    featured: false,
    sortOrder: 3,
    status: "published" as const,
  },
];

async function main(): Promise<void> {
  dotenv.config({ path: ".env.local" });
  const { db } = await import("@/lib/db");

  await db.insert(projects).values(sampleProjects).onConflictDoNothing({
    target: projects.slug,
  });
}

main().catch((error: unknown) => {
  console.error("Failed to seed projects:", error);
  process.exitCode = 1;
});
