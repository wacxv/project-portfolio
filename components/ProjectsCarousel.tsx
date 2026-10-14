"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { staggerContainer } from "@/components/animation-variants";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/db/schema";

export default function ProjectsCarousel({ projects }: { projects: Project[] }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting), { threshold: 0.05 },
    );
    observer.observe(carousel);
    return () => observer.disconnect();
  }, []);
  if (projects.length === 0) return <p className="projects-empty">No featured projects yet.</p>;
  const loopProjects = projects.length === 2 ? [...projects, ...projects] : projects;
  return (
    <div ref={carouselRef} className={`projects-carousel${isInView ? " is-in-view" : ""}${projects.length === 1 ? " is-single" : ""}`} role="region" aria-label="Featured projects. Moving cards pause on hover or keyboard focus.">
      <div className="projects-carousel-viewport" tabIndex={0} data-lenis-prevent>
        <motion.div className="projects-carousel-container" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.05 }} variants={staggerContainer}>
          {[false, true].map((duplicate) => (
            <div className="projects-carousel-set" key={String(duplicate)} aria-hidden={duplicate || undefined}>
              {loopProjects.map((project, index) => (
                <div className="projects-carousel-slide" key={`${project.id}-${index}`} aria-hidden={duplicate || index >= projects.length || undefined}>
                  <ProjectCard project={project} eagerCover={!duplicate && index === 0} duplicate={duplicate || index >= projects.length} />
                </div>
              ))}
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
