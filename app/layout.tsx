import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { getGitHubProfile } from "@/lib/github";

export const metadata: Metadata = {
  title: "Joaquin Vizconde | Full-Stack Developer",
  description: "Portfolio of Joaquin Vizconde, a full-stack developer.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const profile = await getGitHubProfile("wacxv");

  return (
    <html lang="en">
      <body>
        <Header profile={profile} />
        {children}
      </body>
    </html>
  );
}
