import type { Metadata } from "next";
import Link from "next/link";

import ProjectGrid from "@/components/ProjectGrid";
import { getAllProjects } from "@/lib/projects";

export const metadata: Metadata = {
  title: "Projects | Joaquin Vizconde",
  description: "Selected projects by Joaquin Vizconde.",
};

export default async function ProjectsPage() {
  const projects = await getAllProjects();

  return (
    <main className="projects-page">
      <Link className="back-to-home" href="/#projects">
        Back to home
      </Link>
      <h1>Projects</h1>
      <p className="projects-page-intro">A selection of things I&apos;ve built.</p>
      <ProjectGrid projects={projects} />
    </main>
  );
}
