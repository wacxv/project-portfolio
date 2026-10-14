"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";

import { fadeInUp } from "@/components/animation-variants";
import type { Project } from "@/db/schema";

export default function ProjectCard({
  project,
  eagerCover = false,
  duplicate = false,
}: {
  project: Project;
  eagerCover?: boolean;
  duplicate?: boolean;
}) {
  return (
    <motion.article
      className="project-card"
      variants={fadeInUp}
    >
      {project.coverImageUrl ? (
        <Image
          className="project-card-image"
          src={project.coverImageUrl}
          unoptimized
          loading={eagerCover ? "eager" : "lazy"}
          alt={`${project.title} cover`}
          width={800}
          height={500}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      ) : (
        <div className="project-card-image project-card-image-placeholder" aria-hidden="true" />
      )}
      <div className="project-card-content">
        <div
          className="project-card-details"
          tabIndex={duplicate ? -1 : 0}
          role="region"
          aria-label={`${project.title} details and technologies`}
        >
          <h3>{project.title}</h3>
          {project.summary ? <p>{project.summary}</p> : null}
          {project.techTags.length > 0 ? (
            <ul className="project-tech-tags" aria-label="Technologies used">
              {[...new Set(project.techTags)].map((tag) => (
                <li key={tag}>{tag}</li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="project-card-links">
          {project.repoUrl ? (
            <Link
              className="project-repo-link"
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View ${project.title} repository on GitHub (opens in a new tab)`}
              title="View repository on GitHub"
              tabIndex={duplicate ? -1 : undefined}
            >
              <FaGithub aria-hidden="true" />
            </Link>
          ) : null}
          {project.liveUrl ? (
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer" tabIndex={duplicate ? -1 : undefined}>
              Live demo
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
