import type { Metadata } from "next";
import ProjectArchive from "@/views/projects/ProjectArchive";
import { getContent } from "@/models/store";

export const metadata: Metadata = { title: "Projects", description: "Explore all projects built by Rahul Kumar." };
export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const content = await getContent();
  return <ProjectArchive projects={content.projects} />;
}
