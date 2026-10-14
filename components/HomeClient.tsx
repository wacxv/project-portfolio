"use client";

import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ComponentType } from "react";
import {
  FaArrowRight,
  FaArrowLeft,
  FaAws,
  FaEnvelope,
  FaGithub,
  FaGitAlt,
  FaJava,
  FaLinkedin,
  FaPython,
  FaVials,
} from "react-icons/fa";
import {
  SiAngular,
  SiBootstrap,
  SiBluetooth,
  SiChartdotjs,
  SiCss,
  SiCplusplus,
  SiDocker,
  SiDotnet,
  SiExpress,
  SiFigma,
  SiHtml5,
  SiJsonwebtokens,
  SiJavascript,
  SiKotlin,
  SiMariadb,
  SiMongodb,
  SiMqtt,
  SiMysql,
  SiNodedotjs,
  SiNumpy,
  SiOpencv,
  SiPostgresql,
  SiPostman,
  SiPhp,
  SiReact,
  SiRender,
  SiRust,
  SiSocketdotio,
  SiSpringboot,
  SiTailwindcss,
  SiTauri,
  SiTypescript,
  SiVercel,
  SiVite,
  SiWebrtc,
} from "react-icons/si";
import { MdApi, MdSecurity, MdWeb, MdSyncAlt } from "react-icons/md";

import { fadeInUp, staggerContainer } from "@/components/animation-variants";
import PhotoStrip from "@/components/PhotoStrip";
import ProjectsCarousel from "@/components/ProjectsCarousel";
import ScrollReveal from "@/components/ScrollReveal";
import ContactForm from "@/components/ContactForm";
import SectionDots from "@/components/SectionDots";
import {
  ABOUT_TEXT,
  CURRENTLY_LEARNING,
  SKILL_CATEGORIES,
  TIMELINE_ENTRIES,
  type SkillItem,
} from "@/data/profile";
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
  const [isMounted, setIsMounted] = useState(false);
  const { scrollXProgress } = useScroll();
  const progress = useSpring(scrollXProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <motion.div
      className="scroll-progress"
      aria-hidden="true"
      initial={false}
      style={{
        scaleX: isMounted && !prefersReducedMotion ? progress : 0,
      }}
    />
  );
}

const SKILL_ICONS: Record<string, ComponentType<{ "aria-hidden"?: boolean }>> = {
  angular: SiAngular,
  api: MdApi,
  aws: FaAws,
  bootstrap: SiBootstrap,
  bluetooth: SiBluetooth,
  chartjs: SiChartdotjs,
  css: SiCss,
  cpp: SiCplusplus,
  docker: SiDocker,
  dotnet: SiDotnet,
  express: SiExpress,
  figma: SiFigma,
  git: FaGitAlt,
  github: FaGithub,
  html: SiHtml5,
  java: FaJava,
  javascript: SiJavascript,
  jwt: SiJsonwebtokens,
  kotlin: SiKotlin,
  mariadb: SiMariadb,
  mongodb: SiMongodb,
  mqtt: SiMqtt,
  mysql: SiMysql,
  node: SiNodedotjs,
  numpy: SiNumpy,
  opencv: SiOpencv,
  postgresql: SiPostgresql,
  postman: SiPostman,
  php: SiPhp,
  python: FaPython,
  react: SiReact,
  render: SiRender,
  rust: SiRust,
  security: MdSecurity,
  mail: FaEnvelope,
  socketio: SiSocketdotio,
  spring: SiSpringboot,
  tailwind: SiTailwindcss,
  tauri: SiTauri,
  testing: FaVials,
  typescript: SiTypescript,
  vercel: SiVercel,
  vite: SiVite,
  webrtc: SiWebrtc,
  websocket: MdSyncAlt,
};

function SkillIcon({ item }: { item: SkillItem }) {
  const Icon = SKILL_ICONS[item.icon] ?? MdWeb;
  return <Icon aria-hidden />;
}

export default function HomeClient({
  projects,
  avatarUrl,
}: {
  projects: Project[];
  avatarUrl: string;
}) {
  const heroRef = useRef<HTMLElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const { scrollXProgress: heroProgress } = useScroll({
    target: heroRef,
    axis: "x",
    offset: ["start start", "end start"],
  });
  const heroOpacity = useTransform(heroProgress, [0, 0.8], [1, 0.2]);
  const heroX = useTransform(heroProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(heroProgress, [0, 1], [1, 0.95]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setIsMounted(true);
      setCurrentYear(new Date().getFullYear());
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const sectionIds = ["home", "projects", "about", "skills", "experience", "contact"];
    const updateActive = () => {
      const scrollX = window.scrollX;
      const mid = scrollX + window.innerWidth / 2;
      let closest = sectionIds[0];
      let closestDist = Infinity;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const sectionMid = el.offsetLeft + el.offsetWidth / 2;
        const dist = Math.abs(sectionMid - mid);
        if (dist < closestDist) {
          closestDist = dist;
          closest = id;
        }
      }
      setActiveSection(closest);
    };
    window.addEventListener("scroll", updateActive, { passive: true });
    return () => window.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <>
      <ScrollProgress />
      <div id="profile-outer">
      <div id="profile-inner">
        <section id="home" ref={heroRef}>
          <motion.div
            id="hero-scroll-wrapper"
            style={
              !isMounted || prefersReducedMotion
                ? undefined
                : { opacity: heroOpacity, x: heroX, scale: heroScale }
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
            <motion.div className="hero-decorator" variants={fadeInUp} aria-hidden="true" />
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
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ transformOrigin: "top" }}
        />

        <section id="projects">
          <div id="projects-section-container">
            <div className="section-header">
              <span className="section-number" aria-hidden="true">01</span>
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6 }}
              >
                Recent Projects
              </motion.h2>
            </div>
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

        <section id="about">
          <motion.div
            className="content-section about-section"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={staggerContainer}
          >
            <motion.div className="about-image-wrapper" variants={fadeInUp}>
              <Image
                src={avatarUrl}
                alt="Joaquin Vizconde"
                width={480}
                height={480}
                className="about-image"
              />
            </motion.div>
            <div className="about-content">
              <div className="section-header">
                <span className="section-number" aria-hidden="true">02</span>
                <motion.h2 className="section-title" variants={fadeInUp}>About</motion.h2>
              </div>
              <ScrollReveal text={ABOUT_TEXT.join(" ")} />
              <motion.p className="currently-learning" variants={fadeInUp}>
                {CURRENTLY_LEARNING}
              </motion.p>
            </div>
          </motion.div>
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
            <div className="section-header">
              <span className="section-number" aria-hidden="true">03</span>
              <motion.h2 className="section-title" variants={fadeInUp}>Skills</motion.h2>
            </div>
            <div className="skills-grid">
              {SKILL_CATEGORIES.map((category) => (
                <motion.div className="skill-card" variants={fadeInUp} key={category.key}>
                  <h3>{category.label}</h3>
                  <ul className="skill-list">
                    {category.items.map((item) => (
                      <li key={item.name}>
                        <SkillIcon item={item} />
                        <span>{item.name}</span>
                      </li>
                    ))}
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
            <div className="section-header">
              <span className="section-number" aria-hidden="true">04</span>
              <motion.h2 className="section-title" variants={fadeInUp}>Experience</motion.h2>
            </div>
            <motion.ol className="experience-list" variants={staggerContainer}>
              {TIMELINE_ENTRIES.map((entry) => (
                <motion.li className="experience-entry" variants={fadeInUp} key={`${entry.title}-${entry.dates}`}>
                  <div className="experience-dot" aria-hidden="true" />
                  <div className="experience-entry-content">
                    <p className="experience-dates">{entry.dates}</p>
                    <h3>{entry.title}</h3>
                    <p className="experience-place">{entry.place}</p>
                    <p>{entry.description}</p>
                  </div>
                </motion.li>
              ))}
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
            <div className="section-header">
              <span className="section-number" aria-hidden="true">05</span>
              <motion.h2 className="section-title" variants={fadeInUp}>Get in Touch</motion.h2>
            </div>
            <motion.p variants={fadeInUp}>Have a project in mind? I&apos;d love to hear from you.</motion.p>
            <div className="contact-content">
              <motion.div className="contact-form-wrapper" variants={fadeInUp}>
                <ContactForm />
              </motion.div>
              <motion.aside className="contact-details" variants={fadeInUp}>
                <h3>Prefer email?</h3>
                <a href={`mailto:${CONTACT_EMAIL}`} className="contact-button">
                  <FaEnvelope aria-hidden="true" />
                  Email Me
                </a>
                <div className="contact-socials">
                  <a href="https://github.com/wacxv" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaGithub aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                  <a href="https://www.linkedin.com/in/joaquin-carlos-vizconde" className="social-link" target="_blank" rel="noopener noreferrer">
                    <FaLinkedin aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                </div>
              </motion.aside>
            </div>
          </motion.div>
        </section>

        <footer className="site-footer">
          <div className="footer-socials">
            <a href="https://github.com/wacxv" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/joaquin-carlos-vizconde" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href={`mailto:${CONTACT_EMAIL}`} className="social-link">Email</a>
          </div>
          <p>&copy; {currentYear ?? ""} Joaquin Vizconde. All rights reserved.</p>
          <p>Built with Next.js</p>
          <a
            className="back-to-top"
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ left: 0, behavior: "smooth" });
              window.history.pushState(null, "", "/#home");
            }}
          >
            Back to start <FaArrowLeft aria-hidden="true" />
          </a>
        </footer>
      </div>
      </div>
      <SectionDots activeSection={activeSection} />
    </>
  );
}
