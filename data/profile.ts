export type SkillCategoryKey = "frontend" | "backend" | "database" | "tools";

export interface SkillItem {
  name: string;
  icon: string;
}

export interface SkillCategory {
  key: SkillCategoryKey;
  label: string;
  items: SkillItem[];
}

export interface TimelineEntry {
  title: string;
  place: string;
  dates: string;
  description: string;
}

export const ABOUT_TEXT = [
  "I am Joaquin Carlos Vizconde, a full-stack developer from Pasig City, Philippines, who enjoys building and deploying web applications.",
  "I like coffee (maybe too much), long walks, and making thoughtful interfaces that turn complex ideas into useful tools.",
];

export const CURRENTLY_LEARNING = "Currently learning / building: TODO - add your current focus.";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "frontend",
    label: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Angular", icon: "angular" },
      { name: "TypeScript", icon: "typescript" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "Tailwind CSS", icon: "css" },
      { name: "Bootstrap", icon: "bootstrap" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    items: [
      { name: "Node.js", icon: "node" },
      { name: "Express.js", icon: "express" },
      { name: "ASP.NET Core", icon: "dotnet" },
      { name: "RESTful APIs", icon: "api" },
      { name: "JWT", icon: "jwt" },
      { name: "bcrypt", icon: "security" },
      { name: "Nodemailer", icon: "api" },
      { name: "WebRTC", icon: "webrtc" },
      { name: "Socket.IO", icon: "api" },
      { name: "MQTT", icon: "api" },
      { name: "BLE", icon: "api" },
    ],
  },
  {
    key: "database",
    label: "Database",
    items: [
      { name: "MongoDB", icon: "mongodb" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MariaDB", icon: "mariadb" },
      { name: "MySQL", icon: "mysql" },
    ],
  },
  {
    key: "tools",
    label: "Tools",
    items: [
      { name: "AWS", icon: "aws" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Vercel", icon: "vercel" },
      { name: "Tauri", icon: "tauri" },
      { name: "Python", icon: "python" },
      { name: "Rust", icon: "rust" },
      { name: "C#", icon: "dotnet" },
      { name: "OpenCV", icon: "opencv" },
      { name: "Postman", icon: "postman" },
      { name: "MQTT", icon: "api" },
      { name: "WebRTC", icon: "webrtc" },
      { name: "Chart.js", icon: "api" },
      { name: "Figma", icon: "api" },
    ],
  },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    title: "Bachelor of Science in Information Technology, Cum Laude",
    place: "Mapúa University",
    dates: "2022 – February 2026",
    description: "Graduated with a focus on building practical software systems across web, desktop, and connected-device projects.",
  },
  {
    title: "Cloud Developer Intern",
    place: "iCXeed Inc., Philippines",
    dates: "January 2025 – May 2025",
    description: "Built an Angular and TypeScript AWS pricing calculator, contributed MariaDB pricing logic and CRUD operations, and deployed the application with CloudFront, S3, and Cognito.",
  },
  {
    title: "HavenBloom Telehealth Platform",
    place: "Undergraduate Thesis",
    dates: "2025",
    description: "Built most of the features in a three-person team, including real-time chat, WebRTC consultations, live BLE and MQTT health data, dashboards, and appointment workflows.",
  },
  {
    title: "Microsoft Artificial Intelligence Course: Azure AI Fundamentals",
    place: "TESDA",
    dates: "2026",
    description: "Completed foundational coursework covering artificial intelligence concepts and Azure AI fundamentals.",
  },
  {
    title: "AWS Cloud Technical Essentials",
    place: "Amazon Web Services, Coursera",
    dates: "2025",
    description: "Completed coursework covering core AWS cloud concepts and services.",
  },
  {
    title: "IoT (Internet of Things) Wireless & Cloud Computing Emerging Technologies",
    place: "Yonsei University, Coursera",
    dates: "2024",
    description: "Completed coursework covering wireless IoT systems and cloud computing technologies.",
  },
  {
    title: "Software Architecture",
    place: "University of Alberta, Coursera",
    dates: "2024",
    description: "Completed coursework covering software architecture principles and design practices.",
  },
  {
    title: "Data Structures",
    place: "University of California San Diego, Coursera",
    dates: "2023",
    description: "Completed coursework covering core data structures and algorithmic problem solving.",
  },
];
