import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import fs from "node:fs/promises";
import path from "node:path";
import { Icon } from "@/components/Icons";
import type { Project } from "@/lib/types";
import Brand from "@/components/Brand";

async function projects(): Promise<Project[]> { return JSON.parse(await fs.readFile(path.join(process.cwd(), "data/content.json"), "utf8")).projects; }

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const project = (await projects()).find(item => item.slug === slug);
  return project ? { title: project.name, description: project.description } : {};
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const project = (await projects()).find(item => item.slug === slug); if (!project) notFound();
  return <main className={`project-page accent-${project.accent}`}>
    <nav className="project-nav container"><Brand/><div className="project-nav-actions"><Link href="/projects">← All projects</Link></div></nav>
    <header className="project-hero container"><p className="kicker">{project.eyebrow} / {project.year}</p><h1>{project.name}</h1><p>{project.description}</p><div className="tags">{project.stack.map(tag => <span key={tag}>{tag}</span>)}</div>{(project.liveUrl || project.githubUrl) && <div className="project-links">{project.liveUrl && <a className="button primary" href={project.liveUrl} target="_blank" rel="noreferrer">Live project <Icon name="external"/></a>}{project.githubUrl && <a className="button ghost" href={project.githubUrl} target="_blank" rel="noreferrer">View source <Icon name="github"/></a>}</div>}</header>
    <div className={`project-showcase ${project.images?.[0] ? "showcase-image" : ""}`} style={project.images?.[0] ? { backgroundImage: `linear-gradient(180deg, rgba(5,8,15,.05), rgba(5,8,15,.35)), url("${project.images[0]}")` } : undefined}>{!project.images?.[0] && <div className="mock-window"><div className="mock-bar"><i/><i/><i/></div><div className="mock-content"><span/><span/><span/><b/></div></div>}</div>
    <section className="project-body container"><aside><p className="kicker">Project signal</p><dl><dt>Status</dt><dd>{project.status}</dd><dt>Complexity</dt><dd>{project.difficulty}</dd><dt>Category</dt><dd>{project.category}</dd><dt>Built</dt><dd>{project.year}</dd></dl></aside><article><p className="lead">{project.longDescription}</p><div className="case-grid"><div><p className="kicker">The challenge</p><h2>Making complexity feel simple.</h2><p>{project.challenge}</p></div><div><p className="kicker">The approach</p><h2>Designing the right boundaries.</h2><p>{project.solution}</p></div></div><div className="feature-block"><p className="kicker">What it does</p><h2>Core capabilities</h2><div className="feature-grid">{project.features.map((feature,index)=><div key={feature}><span>0{index+1}</span><p>{feature}</p></div>)}</div></div></article></section>
    {project.images?.length > 1 && <section className="project-gallery container"><p className="kicker">Project gallery</p><div>{project.images.slice(1).map((image, index) => <img src={image} alt={`${project.name} screenshot ${index + 2}`} key={image}/>)}</div></section>}
    <section className="next-project"><div className="container"><p className="kicker">Next transmission</p><h2>Have a problem worth solving?</h2><a className="button primary" href="mailto:rahuluu2327@gmail.com">Start a conversation <Icon name="arrow"/></a></div></section>
  </main>;
}
