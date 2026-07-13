import fs from "node:fs/promises";
import path from "node:path";
import Home from "@/components/Home";

export const dynamic = "force-dynamic";

async function getContent() {
  const content = await fs.readFile(path.join(process.cwd(), "data/content.json"), "utf8");
  return JSON.parse(content);
}

export default async function Page() {
  const content = await getContent();
  return <Home initialProjects={content.projects.filter((project: { featured?: boolean }) => project.featured)} skills={content.skills || []} />;
}
