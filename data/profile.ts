export type SkillCategoryKey = "languages" | "frontend" | "backend" | "database" | "cloud" | "realtime" | "tools" | "testing";

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
  "I am Joaquin Vizconde, a full-stack developer from Pasig City, Philippines, who enjoys building and deploying web applications.",
  "I like coffee (maybe too much), long walks, and making thoughtful interfaces that turn complex ideas into useful tools.",
];

export const CURRENTLY_LEARNING = "Currently building: StickUp! A desktop productivity app built with Tauri, React, and TypeScript. It helps users stay focused by allowing them to create sticky notes that stay on top of other windows.";

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    key: "languages",
    label: "Languages",
    items: [
      { name: "JavaScript", icon: "javascript" },
      { name: "TypeScript", icon: "typescript" },
      { name: "Python", icon: "python" },
      { name: "C#", icon: "dotnet" },
      { name: "Rust", icon: "rust" },
      { name: "Java", icon: "java" },
      { name: "C++", icon: "cpp" },
      { name: "Kotlin", icon: "kotlin" },
      { name: "PHP", icon: "php" },
    ],
  },
  {
    key: "frontend",
    label: "Frontend",
    items: [
      { name: "React", icon: "react" },
      { name: "Angular", icon: "angular" },
      { name: "HTML", icon: "html" },
      { name: "CSS", icon: "css" },
      { name: "Tailwind CSS", icon: "tailwind" },
      { name: "Bootstrap", icon: "bootstrap" },
    ],
  },
  {
    key: "backend",
    label: "Backend",
    items: [
      { name: "Node.js", icon: "node" },
      { name: "Express.js", icon: "express" },
      { name: "Spring Boot", icon: "spring" },
      { name: "ASP.NET Core", icon: "dotnet" },
      { name: "Entity Framework Core", icon: "dotnet" },
      { name: "RESTful APIs", icon: "api" },
      { name: "JWT", icon: "jwt" },
      { name: "bcrypt", icon: "security" },
      { name: "Nodemailer", icon: "mail" },
    ],
  },
  {
    key: "database",
    label: "Databases",
    items: [
      { name: "MongoDB Atlas", icon: "mongodb" },
      { name: "PostgreSQL", icon: "postgresql" },
      { name: "MariaDB", icon: "mariadb" },
      { name: "MySQL", icon: "mysql" },
    ],
  },
  {
    key: "cloud",
    label: "Cloud & DevOps",
    items: [
      { name: "AWS CloudFront", icon: "aws" },
      { name: "AWS S3", icon: "aws" },
      { name: "AWS Cognito", icon: "aws" },
      { name: "Git", icon: "git" },
      { name: "GitHub", icon: "github" },
      { name: "Vercel", icon: "vercel" },
      { name: "Render", icon: "render" },
      { name: "Docker", icon: "docker" },
    ],
  },
  {
    key: "realtime",
    label: "Real-time & IoT",
    items: [
      { name: "WebSockets", icon: "websocket" },
      { name: "Socket.IO", icon: "socketio" },
      { name: "WebRTC", icon: "webrtc" },
      { name: "MQTT", icon: "mqtt" },
      { name: "Bluetooth Low Energy (BLE)", icon: "bluetooth" },
    ],
  },
  {
    key: "tools",
    label: "Desktop, Vision & Tools",
    items: [
      { name: "Tauri", icon: "tauri" },
      { name: "CustomTkinter", icon: "python" },
      { name: "OpenCV", icon: "opencv" },
      { name: "NumPy", icon: "numpy" },
      { name: "Vite", icon: "vite" },
      { name: "Postman", icon: "postman" },
      { name: "Chart.js", icon: "chartjs" },
      { name: "Figma", icon: "figma" },
    ],
  },
  {
    key: "testing",
    label: "Testing",
    items: [{ name: "Manual Functional & UI Testing", icon: "testing" }],
  },
];

export const TIMELINE_ENTRIES: TimelineEntry[] = [
  {
    title: "Cloud Developer Intern",
    place: "iCXeed Inc., Philippines",
    dates: "January 2025 – May 2025",
    description: "Co-developed a responsive Amazon Connect pricing calculator using Angular, TypeScript, Bootstrap, and Node.js that streamlined AWS cost estimations for iCXeed employees. Integrated RESTful APIs and MariaDB to deliver real-time pricing updates, wrote core calculation logic, implemented CRUD operations, and deployed the full-stack application securely on AWS using CloudFront, S3, and Cognito.",
  }
];
