import Link from "next/link";
import type { Project } from "@/lib/types";
import { Icon } from "./Icons";

function ProjectSigil({ category }: { category: string }) {
  const kind = category.toLowerCase();
  if (kind.includes("data") || kind.includes("analytics")) return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="M18 78h64M25 70V48M45 70V28M65 70V38"/><circle cx="25" cy="42" r="4"/><circle cx="45" cy="22" r="4"/><circle cx="65" cy="32" r="4"/><path d="m25 42 20-20 20 10 14-16"/></svg>;
  if (kind.includes("backend") || kind.includes("api")) return <svg viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="13"/><circle cx="20" cy="25" r="7"/><circle cx="80" cy="25" r="7"/><circle cx="20" cy="75" r="7"/><circle cx="80" cy="75" r="7"/><path d="m26 30 14 12M74 30 60 42M26 70l14-12M74 70 60 58"/></svg>;
  if (kind.includes("web") || kind.includes("front")) return <svg viewBox="0 0 100 100" aria-hidden="true"><rect x="16" y="22" width="68" height="52" rx="5"/><path d="M16 34h68M27 28h1M35 28h1M43 28h1M35 48h30M35 58h20"/><path d="m28 84 22-10 22 10"/></svg>;
  return <svg viewBox="0 0 100 100" aria-hidden="true"><path d="m50 14 32 18v36L50 86 18 68V32Z"/><path d="m18 32 32 19 32-19M50 51v35M34 23l32 19"/></svg>;
}

export default function ProjectCard({ project, index = 0, variant = "default" }: { project: Project; index?: number; variant?: "default" | "featured" }) {
  const cover = project.images?.[0];
  const featured = variant === "featured";
  return (
    <Link href={`/projects/${project.slug}`} className={`project-card glass accent-${project.accent} ${featured ? "featured-project-card" : ""}`} style={{ "--card-delay": `${index * -1.1}s` } as React.CSSProperties}>
      <div className={`project-visual ${cover ? "has-cover" : ""}`} style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(5,8,15,.05), rgba(5,8,15,.7)), url("${cover}")` } : undefined}>
        <div className="project-number">{String(index + 1).padStart(2, "0")}</div>
        {featured && <><div className="artifact-grid"/><div className="artifact-orbits"><i/><i/><i/></div><div className="project-sigil"><ProjectSigil category={project.category}/><span>{project.category}</span></div><div className="signal-meter"><i/><i/><i/><i/><i/></div></>}
        {!featured && !cover && <div className="mock-window"><div className="mock-bar"><i/><i/><i/></div><div className="mock-content"><span/><span/><span/><b/></div></div>}
        <span className="project-status">{project.status}</span>
        {project.featured && <span className="featured-badge">Featured</span>}
      </div>
      <div className="project-info">
        <p>{project.eyebrow} · {project.year}</p><h3>{project.name}</h3><p>{project.description}</p>
        {featured && <div className="artifact-label"><span>TRANSMISSION {String(index + 1).padStart(2, "0")}</span><i/><b>{project.difficulty}</b></div>}
        <div className="project-bottom"><div className="tags">{project.stack.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><span className="round-arrow"><Icon name="arrow" /></span></div>
      </div>
    </Link>
  );
}
