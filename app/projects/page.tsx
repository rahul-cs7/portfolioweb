import type { Metadata } from "next";
import fs from "node:fs/promises";
import path from "node:path";
import ProjectArchive from "@/components/ProjectArchive";
import type { Project } from "@/lib/types";

export const metadata: Metadata = { title: "Projects", description: "Explore all projects built by Rahul Kumar." };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const content = JSON.parse(await fs.readFile(path.join(process.cwd(), "data/content.json"), "utf8"));
  return <ProjectArchive projects={content.projects as Project[]} />;
}
