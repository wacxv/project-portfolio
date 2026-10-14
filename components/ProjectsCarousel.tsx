"use client";

import { useCallback, useEffect, useState } from "react";
import type { KeyboardEvent } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { motion } from "framer-motion";

import { staggerContainer } from "@/components/animation-variants";
import ProjectCard from "@/components/ProjectCard";
import type { Project } from "@/db/schema";

export default function ProjectsCarousel({
  projects,
}: {
  projects: Project[];
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    loop: false,
    dragFree: false,
  });

  const updateControls = useCallback(() => {
    if (!emblaApi) {
      return;
    }

    setSelectedIndex(emblaApi.selectedScrollSnap());
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) {
      return;
    }

    emblaApi.on("select", updateControls);
    emblaApi.on("reInit", updateControls);
    const frame = requestAnimationFrame(updateControls);

    return () => {
      cancelAnimationFrame(frame);
      emblaApi.off("select", updateControls);
      emblaApi.off("reInit", updateControls);
    };
  }, [emblaApi, updateControls]);

  const handleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (!emblaApi) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      emblaApi.scrollPrev();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      emblaApi.scrollNext();
    }
  };

  if (projects.length === 0) {
    return <p className="projects-empty">No featured projects yet.</p>;
  }

  if (projects.length <= 2) {
    return (
      <motion.div
        id="projects-grid"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
      >
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </motion.div>
    );
  }

  return (
    <div
      className="projects-carousel"
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured projects"
      tabIndex={0}
      onKeyDown={handleKeyDown}
    >
      <div className="projects-carousel-viewport" ref={emblaRef}>
        <motion.div
          className="projects-carousel-container"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {projects.map((project, index) => (
            <div
              className="projects-carousel-slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${projects.length}`}
              key={project.id}
            >
              <ProjectCard project={project} />
            </div>
          ))}
        </motion.div>
      </div>
      <div className="projects-carousel-controls">
        <button
          className="projects-carousel-button"
          type="button"
          aria-label="Previous featured project"
          disabled={!canScrollPrev}
          onClick={() => emblaApi?.scrollPrev()}
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <div className="projects-carousel-dots" aria-label="Choose featured project">
          {projects.map((project, index) => (
            <button
              className={`projects-carousel-dot${selectedIndex === index ? " is-active" : ""}`}
              type="button"
              aria-label={`Go to ${project.title}`}
              aria-current={selectedIndex === index ? "true" : undefined}
              key={project.id}
              onClick={() => emblaApi?.scrollTo(index)}
            />
          ))}
        </div>
        <button
          className="projects-carousel-button"
          type="button"
          aria-label="Next featured project"
          disabled={!canScrollNext}
          onClick={() => emblaApi?.scrollNext()}
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
