"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Cosmos from "./Cosmos";
import ContactForm from "./ContactForm";
import { Icon } from "./Icons";
import ProjectCard from "./ProjectCard";
import type { Project, Skill } from "@/lib/types";
import Brand from "./Brand";

const chapters = [
  { number: "01", year: "2004 —", title: "Rooted in Bihar", copy: "Curiosity started small: taking things apart, asking why, and imagining what could be built next." },
  { number: "02", year: "2023", title: "Code became a language", copy: "Computer Science at Uttaranchal University turned curiosity into a craft — algorithms, systems, and a builder’s mindset." },
  { number: "03", year: "2024", title: "First products, real users", copy: "A frontend internship at OBL Softwares sharpened the fundamentals: responsive interfaces, performance, and thoughtful interaction." },
  { number: "04", year: "2025 — now", title: "From interfaces to intelligence", copy: "Backend systems, Java applications, data products, and AI research became connected parts of one journey." },
];

const experiences = [
  { date: "Jun — Jul 2025", role: "Java Developer", company: "Codec Technologies", copy: "Built Java Swing interfaces connected to MySQL, applying object-oriented design to practical desktop workflows.", tags: ["Java", "Swing", "MySQL", "OOP"] },
  { date: "Jul 2024", role: "Crowdfunding Volunteer", company: "Muskurahat Foundation", copy: "Raised ₹1,093 through targeted outreach and campaign storytelling while learning to communicate with clarity and empathy.", tags: ["Campaigns", "Communication", "Teamwork"] },
  { date: "Jun — Jul 2024", role: "Frontend Developer", company: "OBL Softwares Pvt. Ltd.", copy: "Created responsive, interactive pages and optimized real interfaces for performance and user experience.", tags: ["HTML", "CSS", "JavaScript", "Bootstrap"] },
];

const research = [
  { code: "PAPER 01 / 2025", title: "AI in sustainable development and climate change mitigation", copy: "Exploring AI-driven solutions for carbon reduction, climate resilience, renewable energy, and intelligent resource management.", topics: ["Sustainability", "AI", "Climate"] },
  { code: "PAPER 02 / 2025", title: "AI for early detection and intervention in mental health disorders", copy: "Studying machine learning, NLP, predictive analytics, wearables, and the ethical constraints of digital healthcare.", topics: ["Mental health", "NLP", "Ethics"] },
];

export default function Home({ initialProjects, skills }: { initialProjects: Project[]; skills: Skill[] }) {
  const [menu, setMenu] = useState(false);
  const [light, setLight] = useState(false);
  const [terminal, setTerminal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [command, setCommand] = useState("");
  const [terminalLines, setTerminalLines] = useState(["RahulVerse terminal v1.0", "Try: whoami, skills, projects, contact"]);

  useEffect(() => {
    document.documentElement.dataset.theme = light ? "light" : "dark";
  }, [light]);
  useEffect(() => { setShowAdmin(sessionStorage.getItem("rahulverse-admin-unlocked") === "true"); }, []);
  useEffect(() => { fetch("/api/analytics", { method: "POST" }).catch(() => undefined); }, []);

  function runCommand(event: React.FormEvent) {
    event.preventDefault();
    const cmd = command.trim().toLowerCase();
    if (cmd === "adminlogin") { setShowAdmin(true); sessionStorage.setItem("rahulverse-admin-unlocked", "true"); }
    const replies: Record<string, string> = {
      whoami: "Rahul Kumar — full-stack developer, researcher, lifelong learner.",
      skills: "JavaScript · Node.js · React · MongoDB · Java · SQL · Python",
      projects: "Brevio · BizNova · Message System",
      contact: "rahuluu2327@gmail.com · Dehradun, India",
      resume: "Open /resume.pdf to view the latest résumé.",
      help: "Commands: whoami, skills, projects, contact, resume, clear",
      adminlogin: "Admin access unlocked. Use the new navbar icon to open the secure dashboard.",
    };
    setTerminalLines(cmd === "clear" ? [] : [...terminalLines, `> ${cmd}`, replies[cmd] || "Unknown command. Type help."]);
    setCommand("");
  }

  return (
    <main>
      <header className="nav-wrap">
        <nav className="nav container" aria-label="Primary navigation">
          <Brand href="#top" />
          <div className={`nav-links ${menu ? "open" : ""}`}>
            {[{ label: "Story", href: "#story" }, { label: "Skills", href: "#skills" }, { label: "Experience", href: "#experience" }, { label: "Projects", href: "/projects" }, { label: "Research", href: "#research" }, { label: "Contact", href: "#contact" }].map(item => <Link key={item.label} href={item.href} onClick={() => setMenu(false)}>{item.label}</Link>)}
          </div>
          <div className="nav-actions">
            {showAdmin && <Link className="icon-button admin-shortcut admin-reveal" href="/admin" aria-label="Open admin dashboard" title="Admin dashboard"><Icon name="admin" /></Link>}
            <button className="icon-button" onClick={() => setTerminal(true)} aria-label="Open terminal"><Icon name="terminal" /></button>
            <button className="icon-button" onClick={() => setLight(!light)} aria-label="Change theme"><Icon name={light ? "moon" : "sun"} /></button>
            <button className="icon-button menu-button" onClick={() => setMenu(!menu)} aria-label="Open menu"><Icon name={menu ? "close" : "menu"} /></button>
          </div>
        </nav>
      </header>

      <section className="hero" id="top">
        <Cosmos />
        <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
        <div className="planet" aria-hidden="true"><div className="planet-glow"/><div className="planet-body"/><div className="planet-ring"/><span className="moon m1"/><span className="moon m2"/></div>
        <div className="container hero-content">
          <p className="eyebrow reveal"><span className="pulse"/> Available for opportunities · 2026</p>
          <h1 className="hero-title"><span>Engineering ideas</span><span>into <em>useful</em> digital products.</span></h1>
          <p className="hero-copy">I’m Rahul Kumar — a full-stack developer and researcher exploring the space between thoughtful interfaces, resilient systems, and responsible AI.</p>
          <div className="hero-actions"><a className="button primary" href="#work">Explore my work <Icon name="arrow" /></a><a className="button ghost" href="/resume.pdf" target="_blank">View résumé <Icon name="external" /></a></div>
          <div className="hero-meta"><span><b>03+</b> shipped projects</span><span><b>02</b> research papers</span><span><b>8.57</b> CGPA</span></div>
        </div>
        <div className="scroll-cue"><span>Scroll to explore</span><i/></div>
      </section>

      <section className="story section" id="story">
        <div className="container">
          <div className="section-heading split-heading"><div><p className="kicker">01 / ORIGIN STORY</p><h2>Every system starts<br/>with a <em>first question.</em></h2></div><p>I didn’t begin with all the answers. I began with an instinct to understand how things work — then learned to build them better.</p></div>
          <div className="chapters">
            {chapters.map((chapter, index) => <article className="chapter" key={chapter.number}><div className="chapter-index">{chapter.number}</div><div className="chapter-line"><span/></div><div className="chapter-content"><p>{chapter.year}</p><h3>{chapter.title}</h3><p>{chapter.copy}</p></div><div className={`chapter-orb orb-${index + 1}`}>{index === 0 ? "⌖" : index === 1 ? "</>" : index === 2 ? "UI" : "AI"}</div></article>)}
          </div>
        </div>
      </section>

      <section className="skills section" id="skills">
        <div className="container">
          <div className="section-heading center"><p className="kicker">02 / CAPABILITY MAP</p><h2>A growing galaxy of <em>skills.</em></h2><p>Tools change. The habit of learning compounds.</p></div>
          <div className="skill-system">
            <div className="skill-core"><span>RK</span><small>BUILDER</small></div>
            <div className="orbit-line o1"/><div className="orbit-line o2"/><div className="orbit-line o3"/>
            <div className="skill-orbiters">
              {skills.map((skill, index) => { const angle = (index / Math.max(skills.length, 1)) * Math.PI * 2 - Math.PI / 2; return <button className="skill-planet" key={skill.id} style={{ "--level": `${skill.level}%`, "--planet-delay": `${index * -0.35}s`, left: `${50 + Math.cos(angle) * 43}%`, top: `${50 + Math.sin(angle) * 42}%` } as React.CSSProperties}><span>{skill.name.slice(0, 2).toUpperCase()}</span><b>{skill.name}</b><small>{skill.type} · {skill.level}%</small></button>; })}
            </div>
          </div>
          <div className="skill-mobile">{skills.map(skill => <div className="skill-bar" key={skill.id}><span>{skill.name}</span><i><b style={{ width: `${skill.level}%` }}/></i><small>{skill.level}%</small></div>)}</div>
        </div>
      </section>

      <section className="experience section" id="experience">
        <div className="container">
          <div className="section-heading split-heading"><div><p className="kicker">03 / FIELD NOTES</p><h2>Learning by <em>doing.</em></h2></div><p>Each stop has added a new lens: engineering, communication, ownership, and the discipline to finish.</p></div>
          <div className="timeline">
            {experiences.map((item, index) => <article className="timeline-item" key={item.role}><div className="timeline-marker"><span>{String(index + 1).padStart(2, "0")}</span></div><div className="timeline-date">{item.date}</div><div className="timeline-card glass"><p>{item.company}</p><h3>{item.role}</h3><p>{item.copy}</p><div className="tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></div></article>)}
          </div>
        </div>
      </section>

      <section className="work section" id="work">
        <div className="container">
          <div className="section-heading work-heading"><div><p className="kicker">04 / FEATURED WORK</p><h2>Projects with a <em>point of view.</em></h2></div><Link className="button ghost" href="/projects">View all projects <Icon name="arrow"/></Link></div>
          <div className="project-grid">
            {initialProjects.map((project, index) => <ProjectCard project={project} index={index} key={project.slug}/>)}
          </div>
        </div>
      </section>

      <section className="research section" id="research">
        <div className="container research-grid">
          <div className="research-intro"><p className="kicker">05 / RESEARCH LAB</p><h2>Asking harder <em>questions.</em></h2><p>Research is where engineering meets responsibility — exploring not only what technology can do, but what it should do.</p><div className="lab-status"><span className="pulse"/> Two manuscripts · IEEE focus · 2025</div></div>
          <div className="paper-list">{research.map(paper => <article className="paper glass" key={paper.code}><p>{paper.code}</p><h3>{paper.title}</h3><p>{paper.copy}</p><div className="tags">{paper.topics.map(topic => <span key={topic}>{topic}</span>)}</div><span className="paper-arrow"><Icon name="external" /></span></article>)}</div>
        </div>
      </section>

      <section className="education section">
        <div className="container education-card glass">
          <div><p className="kicker">06 / EDUCATION</p><h2>Built on strong <em>fundamentals.</em></h2></div><div className="degree"><p>2023 — PRESENT · DEHRADUN</p><h3>B.Tech in Computer Science & Engineering</h3><p>Uttaranchal University</p></div><div className="score"><strong>8.57</strong><span>CGPA</span><small>and still learning</small></div>
        </div>
      </section>

      <section className="contact section" id="contact">
        <div className="container contact-grid">
          <div className="contact-copy"><p className="kicker">07 / OPEN CHANNEL</p><h2>Let’s make the next idea <em>real.</em></h2><p>I’m open to software engineering opportunities, research collaborations, and projects where thoughtful technology can create real value.</p><div className="contact-links"><a href="mailto:rahuluu2327@gmail.com"><Icon name="mail"/>rahuluu2327@gmail.com</a><a href="https://www.linkedin.com/in/rahuluu/" target="_blank"><Icon name="linkedin"/>LinkedIn</a><a href="https://github.com/rahuluu" target="_blank"><Icon name="github"/>GitHub</a><span><Icon name="location"/>Dehradun, India</span></div>
          </div><ContactForm />
        </div>
      </section>

      <footer><div className="container footer-inner"><Brand href="#top"/><p>Designed & engineered with curiosity.<br/>© 2026 Rahul Kumar.</p><a href="#top">Back to orbit ↑</a></div></footer>

      {terminal && <div className="terminal-overlay" role="dialog" aria-modal="true" aria-label="Interactive terminal"><button className="terminal-backdrop" onClick={() => setTerminal(false)} aria-label="Close terminal"/><div className="terminal-window"><div className="terminal-bar"><span><i/><i/><i/> rahul@verse:~</span><button onClick={() => setTerminal(false)}><Icon name="close"/></button></div><div className="terminal-output">{terminalLines.map((line, i) => <p key={`${line}-${i}`}>{line}</p>)}</div><form onSubmit={runCommand}><span>›</span><input autoFocus value={command} onChange={event => setCommand(event.target.value)} aria-label="Terminal command" autoComplete="off" /></form></div></div>}
    </main>
  );
}
