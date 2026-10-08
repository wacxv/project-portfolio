export interface GitHubProfile {
  login: string;
  avatar_url: string;
}

export async function getGitHubProfile(username: string): Promise<GitHubProfile> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      Accept: "application/vnd.github+json",
      "User-Agent": "project-portfolio",
    },
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`GitHub profile request failed with status ${response.status}`);
  }

  const profile: unknown = await response.json();

  if (
    typeof profile !== "object" ||
    profile === null ||
    typeof (profile as Record<string, unknown>).login !== "string" ||
    typeof (profile as Record<string, unknown>).avatar_url !== "string"
  ) {
    throw new Error("GitHub profile response did not contain the expected fields");
  }

  return {
    login: (profile as Record<string, string>).login,
    avatar_url: (profile as Record<string, string>).avatar_url,
  };
}
