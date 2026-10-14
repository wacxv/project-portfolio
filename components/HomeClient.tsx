"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

import { fadeInUp, staggerContainer } from "@/components/animation-variants";
import PhotoStrip from "@/components/PhotoStrip";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import type { Project } from "@/db/schema";

const CONTACT_EMAIL = "your.email@example.com";

function AnimatedTechContinuous({
  text,
  baseDelay = 0,
}: {
  text: string;
  baseDelay?: number;
}) {
  return (
    <span className="tech-highlight-continuous">
      {text.split("").map((letter, index) => (
        <motion.span
          key={`${text}-${index}`}
          animate={{
            color: ["#DC2626", "#EF4444", "#F87171", "#EF4444", "#DC2626"],
            textShadow: [
              "0 0 0px rgba(220, 38, 38, 0)",
              "0 0 15px rgba(220, 38, 38, 0.6)",
              "0 0 25px rgba(220, 38, 38, 0.9)",
              "0 0 15px rgba(220, 38, 38, 0.6)",
              "0 0 0px rgba(220, 38, 38, 0)",
            ],
            scale: [1, 1.05, 1.1, 1.05, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: baseDelay + index * 0.08,
            ease: "easeInOut",
          }}
          style={{ display: "inline-block" }}
        >
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </span>
  );
}

function ScrollProgress() {
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      style={prefersReducedMotion ? undefined : { scaleX: progress }}
    />
  );
}

export default function HomeClient({ projects }: { projects: Project[] }) {
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress: heroProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 1], [1, 0]);
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.92]);

  return (
    <>
      <ScrollProgress />
      <div id="profile-outer">
      <div id="profile-inner">
        <section id="home" ref={heroRef}>
          <motion.div
            id="hero-scroll-wrapper"
            style={
              prefersReducedMotion
                ? undefined
                : { opacity: heroOpacity, y: heroY, scale: heroScale }
            }
          >
            <motion.div
              id="hero-container"
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
            >
            <motion.h1 id="hero-greeting" variants={fadeInUp}>
              Hi, I&apos;m <span className="name-highlight">Joaquin Vizconde</span>
            </motion.h1>
            <motion.h2 id="hero-title" variants={fadeInUp}>
              a Full-Stack Developer
            </motion.h2>
            <motion.p id="hero-description" variants={fadeInUp}>
              I&apos;m too{" "}
              <AnimatedTechContinuous text="caffeinated" /> to sit still, so I
              build things instead. Clean code, sharp interfaces, and{" "}
              <AnimatedTechContinuous text="zero chill" baseDelay={0.6} />.
            </motion.p>
            <motion.div variants={fadeInUp}>
              <Link href="/#contact" id="cta-button">
                Get in Touch
              </Link>
            </motion.div>
            <motion.div className="hero-socials" variants={fadeInUp}>
              <a
                href="https://github.com/wacxv"
                className="social-link"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaGithub />
                <span>GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/joaquin-carlos-vizconde"
                className="social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedin />
                <span>LinkedIn</span>
              </a>
              <a href={`mailto:${CONTACT_EMAIL}`} className="social-link" aria-label="Email">
                <FaEnvelope />
                <span>Email</span>
              </a>
            </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <motion.div
          id="section-divider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />

        <section id="projects">
          <div id="projects-section-container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
            >
              Recent Projects
            </motion.h2>
            <ProjectsCarousel projects={projects} />
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <Link href="/projects" id="view-all-link">
                View All Projects
                <FaArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>

        <PhotoStrip />

        <section id="skills">
          <motion.div
            className="content-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp}>Skills</motion.h2>
            <div className="placeholder-grid">
              {["Frontend", "Backend", "Database", "Tools"].map((category) => (
                <motion.div className="placeholder-card" variants={fadeInUp} key={category}>
                  <h3>{category}</h3>
                  <ul>
                    <li>TODO: Add {category.toLowerCase()} skills</li>
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        <section id="experience">
          <motion.div
            className="content-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp}>Experience</motion.h2>
            <motion.ol className="experience-list" variants={staggerContainer}>
              <motion.li variants={fadeInUp}><strong>Education</strong><span>TODO: Add education details</span></motion.li>
              <motion.li variants={fadeInUp}><strong>Experience</strong><span>TODO: Add work experience</span></motion.li>
            </motion.ol>
          </motion.div>
        </section>

        <section id="contact">
          <motion.div
            className="content-section contact-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.h2 className="section-title" variants={fadeInUp}>Get in Touch</motion.h2>
            <motion.p variants={fadeInUp}>Have a project in mind? I&apos;d love to hear from you.</motion.p>
            <motion.a href={`mailto:${CONTACT_EMAIL}`} className="contact-button" variants={fadeInUp}>
              Email Me
            </motion.a>
          </motion.div>
        </section>
      </div>
      </div>
    </>
  );
}
