import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/models/store";
import ProjectDetail from "@/views/projects/ProjectDetail";

type PageProps = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = (await getContent()).projects.find(item => item.slug === slug);
  return project ? { title: project.name, description: project.description } : {};
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = (await getContent()).projects.find(item => item.slug === slug);
  if (!project) notFound();
  return <ProjectDetail project={project} />;
}
