"use client";
import { motion } from "framer-motion";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "projects", label: "Projects" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" },
];

export default function SectionDots({ activeSection }: { activeSection: string }) {
  return (
    <nav className="section-dots" aria-label="Section navigation">
      {SECTIONS.map((section) => (
        <a
          key={section.id}
          href={`#${section.id}`}
          className={`section-dot${activeSection === section.id ? " is-active" : ""}`}
          aria-label={`Go to ${section.label}`}
          title={section.label}
          onClick={(e) => {
            e.preventDefault();
            const el = document.getElementById(section.id);
            if (el) {
              el.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
            }
          }}
        >
          {activeSection === section.id && (
            <motion.span
              className="section-dot-active-ring"
              layoutId="dot-ring"
              transition={{ duration: 0.3 }}
            />
          )}
        </a>
      ))}
    </nav>
  );
}

