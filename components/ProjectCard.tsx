"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaGithub } from "react-icons/fa";

import { fadeInUp } from "@/components/animation-variants";
import type { Project } from "@/db/schema";

export default function ProjectCard({ project }: { project: Project }) {
  const cardRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollXProgress } = useScroll({
    target: cardRef,
    axis: "x",
    offset: ["start 0.95", "center 0.5"],
  });
  const cardOpacity = useTransform(scrollXProgress, [0, 1], [0, 1]);
  const cardScale = useTransform(scrollXProgress, [0, 1], [0.95, 1]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.article
      ref={cardRef}
      className="project-card"
      variants={fadeInUp}
      style={
        !isMounted || prefersReducedMotion
          ? undefined
          : { opacity: cardOpacity, scale: cardScale }
      }
    >
      {project.coverImageUrl ? (
        <Image
          className="project-card-image"
          src={project.coverImageUrl}
          unoptimized
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
          data-lenis-prevent
          tabIndex={0}
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
            >
              <FaGithub aria-hidden="true" />
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
