import HomeClient from "@/components/HomeClient";
import { getGitHubProfile } from "@/lib/github";
import { getFeaturedProjects } from "@/lib/projects";

export default async function HomePage() {
  const [projects, profile] = await Promise.all([
    getFeaturedProjects(),
    getGitHubProfile("wacxv"),
  ]);

  return <HomeClient projects={projects} avatarUrl={profile.avatar_url} />;
}
