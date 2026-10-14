"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { staggerContainer } from "@/components/animation-variants";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/db/schema";

export default function ProjectGrid({ projects }: { projects: Project[] }) {
  const [selectedTag, setSelectedTag] = useState("All");
  const tags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((project) => project.techTags))).sort()],
    [projects],
  );
  const filteredProjects =
    selectedTag === "All"
      ? projects
      : projects.filter((project) => project.techTags.includes(selectedTag));

  return (
    <>
      <div className="project-filters" aria-label="Filter projects by technology">
        {tags.map((tag) => (
          <button
            className={`project-filter${selectedTag === tag ? " is-active" : ""}`}
            type="button"
            aria-pressed={selectedTag === tag}
            key={tag}
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>
      {filteredProjects.length > 0 ? (
        <motion.div
          className="projects-page-grid"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {filteredProjects.map((project, index) => (
            <ProjectCard key={project.id} project={project} eagerCover={index === 0} />
          ))}
        </motion.div>
      ) : (
        <p className="projects-empty">
          {projects.length > 0
            ? "No projects use that technology yet."
            : "No projects have been published yet. Check back soon."}
        </p>
      )}
    </>
  );
}
