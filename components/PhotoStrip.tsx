"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

import { fadeInUp } from "@/components/animation-variants";
import { GALLERY_PHOTOS } from "@/data/gallery";

const STRIP_LABEL = "OFF THE KEYBOARD";
const STRIP_HEADING = {
  before: "I ",
  highlight: "walk",
  after: " too.",
};
const STRIP_DESCRIPTION =
  "Between commits I am usually out chasing good coffee and wrong turns. A few frames from across the Philippines.";

function PhotoSet({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <div className="photo-strip-set" aria-hidden={duplicate}>
      {GALLERY_PHOTOS.map((photo, index) => (
        <div
          className={`photo-strip-card ${index % 2 === 0 ? "photo-strip-card-raised" : "photo-strip-card-lowered"}`}
          key={`${photo}-${duplicate ? "duplicate" : "original"}`}
        >
          <Image
            src={photo}
            alt=""
            width={1000}
            height={1333}
            loading="lazy"
            sizes="(max-width: 768px) 180px, 240px"
          />
        </div>
      ))}
    </div>
  );
}

export default function PhotoStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => setIsInView(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="gallery"
      className={`photo-strip-section${isInView ? " is-in-view" : ""}`}
      ref={sectionRef}
    >
      <motion.div
        className="photo-strip-copy"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUp}
      >
        <p className="photo-strip-label">{STRIP_LABEL}</p>
        <h2>
          {STRIP_HEADING.before}
          <span>{STRIP_HEADING.highlight}</span>
          {STRIP_HEADING.after}
        </h2>
        <p>{STRIP_DESCRIPTION}</p>
      </motion.div>
      <div
        className="photo-strip-viewport"
        tabIndex={0}
        aria-label="Photo strip"
      >
        <div className="photo-strip-track">
          <PhotoSet />
          <PhotoSet duplicate />
        </div>
      </div>
    </section>
  );
}
