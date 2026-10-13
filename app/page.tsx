"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";
import { FaArrowRight, FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

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

export default function Home() {
  return (
    <div id="profile-outer">
      <div id="profile-inner">
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
            I&apos;m a full-stack developer who loves turning ideas into polished web
            applications. I focus on writing clean, maintainable code and creating
            intuitive user experiences using{" "}
            <AnimatedTechContinuous text="React" />,{" "}
            <AnimatedTechContinuous text="Node.js" baseDelay={0.5} />,{" "}
            <AnimatedTechContinuous text="MongoDB" baseDelay={1} />, and{" "}
            <AnimatedTechContinuous text="Express.js" baseDelay={1.5} />.
          </motion.p>
          <motion.div variants={fadeInUp}>
            <Link href="/contact" id="cta-button">
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
            <a href="mailto:your.email@example.com" className="social-link" aria-label="Email">
              <FaEnvelope />
              <span>Email</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          id="section-divider"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "left" }}
        />

        <div id="projects-section-container">
          <motion.h2
            id="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
            Recent Projects
          </motion.h2>
          <motion.div
            id="projects-grid"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >

          </motion.div>
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
      </div>
    </div>
  );
}
