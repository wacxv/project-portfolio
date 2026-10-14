"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

import { fadeInUp } from "@/components/animation-variants";
import type { Project } from "@/db/schema";

export default function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.article className="project-card" variants={fadeInUp}>
      {project.coverImageUrl ? (
        <Image
          className="project-card-image"
          src={project.coverImageUrl}
          alt={`${project.title} cover`}
          width={800}
          height={500}
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        />
      ) : (
        <div className="project-card-image project-card-image-placeholder" aria-hidden="true" />
      )}
      <div className="project-card-content">
        <h3>{project.title}</h3>
        {project.summary ? <p>{project.summary}</p> : null}
        {project.techTags.length > 0 ? (
          <ul className="project-tech-tags" aria-label="Technologies used">
            {project.techTags.map((tag) => (
              <li key={tag}>{tag}</li>
            ))}
          </ul>
        ) : null}
        <div className="project-card-links">
          {project.repoUrl ? (
            <Link href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              Repository
            </Link>
          ) : null}
          {project.liveUrl ? (
            <Link href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              Live demo
            </Link>
          ) : null}
        </div>
      </div>
    </motion.article>
  );
}
