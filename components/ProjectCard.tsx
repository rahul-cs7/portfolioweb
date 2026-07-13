import Link from "next/link";
import type { Project } from "@/lib/types";
import { Icon } from "./Icons";

export default function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const cover = project.images?.[0];
  return (
    <Link href={`/projects/${project.slug}`} className={`project-card glass accent-${project.accent}`}>
      <div className={`project-visual ${cover ? "has-cover" : ""}`} style={cover ? { backgroundImage: `linear-gradient(180deg, rgba(5,8,15,.05), rgba(5,8,15,.7)), url("${cover}")` } : undefined}>
        <div className="project-number">{String(index + 1).padStart(2, "0")}</div>
        {!cover && <div className="mock-window"><div className="mock-bar"><i/><i/><i/></div><div className="mock-content"><span/><span/><span/><b/></div></div>}
        <span className="project-status">{project.status}</span>
        {project.featured && <span className="featured-badge">Featured</span>}
      </div>
      <div className="project-info">
        <p>{project.eyebrow} · {project.year}</p><h3>{project.name}</h3><p>{project.description}</p>
        <div className="project-bottom"><div className="tags">{project.stack.slice(0, 3).map(tag => <span key={tag}>{tag}</span>)}</div><span className="round-arrow"><Icon name="arrow" /></span></div>
      </div>
    </Link>
  );
}
