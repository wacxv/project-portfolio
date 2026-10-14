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
    title: "Cloud Developer Intern",
    place: "iCXeed Inc., Philippines",
    dates: "January 2025 – May 2025",
    description: "Built an Angular and TypeScript AWS pricing calculator, contributed MariaDB pricing logic and CRUD operations, and deployed the application with CloudFront, S3, and Cognito.",
  }
];
