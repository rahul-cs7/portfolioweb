"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Project } from "@/lib/types";
import ProjectCard from "./ProjectCard";
import BrandMark from "./BrandMark";

export default function ProjectArchive({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState("All");
  const categories = ["All", ...Array.from(new Set(projects.map(project => project.category)))];
  const visible = useMemo(() => filter === "All" ? projects : projects.filter(project => project.category === filter), [filter, projects]);
  return <main className="archive-page">
    <nav className="project-nav container"><Link className="brand" href="/"><BrandMark/><span>RAHUL<span className="muted">VERSE</span></span></Link><div className="project-nav-actions"><Link href="/">← Home</Link></div></nav>
    <header className="archive-hero container"><p className="kicker">PROJECT UNIVERSE / {projects.length} TRANSMISSIONS</p><h1>All the things<br/>I’ve <em>built.</em></h1><p>Products, experiments, and systems created while learning how useful software comes together.</p></header>
    <section className="archive-content container">
      <div className="filters">{categories.map(category => <button className={filter === category ? "active" : ""} onClick={() => setFilter(category)} key={category}>{category}</button>)}</div>
      <div className="project-grid archive-grid">{visible.map((project, index) => <ProjectCard project={project} index={index} key={project.slug}/>)}</div>
    </section>
  </main>;
}
