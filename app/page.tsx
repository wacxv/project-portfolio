import HomeClient from "@/components/HomeClient";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const projects = await getFeaturedProjects();

  return <HomeClient projects={projects} />;
}
