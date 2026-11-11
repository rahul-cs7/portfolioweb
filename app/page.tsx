import Home from "@/views/home/Home";
import { getContent } from "@/models/store";

export const dynamic = "force-dynamic";

export default async function Page() {
  const content = await getContent();
  return <Home initialProjects={content.projects.filter(project => project.featured)} skills={content.skills} />;
}
