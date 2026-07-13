"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/Icons";
import type { Message, Project, Skill } from "@/lib/types";

type Data = { projects: Project[]; skills: Skill[]; messages: Message[] };
type Section = "overview" | "projects" | "skills" | "messages";

const blankProject = (): Project => ({
  slug: "", name: "", eyebrow: "Full-stack project", description: "", longDescription: "", year: String(new Date().getFullYear()),
  category: "Web Development", status: "In progress", difficulty: "Intermediate", stack: [], features: [], challenge: "", solution: "",
  accent: "violet", featured: false, githubUrl: "", liveUrl: "", images: [],
});

const slugify = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Admin() {
  const [token, setToken] = useState("");
  const [data, setData] = useState<Data | null>(null);
  const [section, setSection] = useState<Section>("overview");
  const [draft, setDraft] = useState<Project | null>(null);
  const [originalSlug, setOriginalSlug] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function login(event: FormEvent) {
    event.preventDefault(); setError("");
    const response = await fetch("/api/content", { headers: { Authorization: `Bearer ${token}` } });
    if (response.ok) setData(await response.json()); else setError("That access token was not accepted.");
  }

  function edit(project?: Project) {
    const next = project ? structuredClone(project) : blankProject();
    setDraft(next); setOriginalSlug(project?.slug || ""); setError(""); setNotice(""); setSection("projects");
  }

  async function persist(projects: Project[], skills = data?.skills || []) {
    const response = await fetch("/api/content", { method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ projects, skills }) });
    if (!response.ok) throw new Error((await response.json()).error || "Could not save content.");
    setData(current => current ? { ...current, projects, skills } : current);
  }

  function addSkill() {
    if (!data) return;
    setData({ ...data, skills: [...data.skills, { id: crypto.randomUUID(), name: "New skill", type: "Core", level: 70 }] });
  }

  function updateSkill(id: string, changes: Partial<Skill>) {
    if (!data) return;
    setData({ ...data, skills: data.skills.map(skill => skill.id === id ? { ...skill, ...changes } : skill) });
  }

  async function saveSkills() {
    if (!data) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const skills = data.skills.map(skill => ({ ...skill, name: skill.name.trim(), type: skill.type.trim(), level: Math.max(0, Math.min(100, Number(skill.level) || 0)) })).filter(skill => skill.name);
      await persist(data.projects, skills); setNotice("Skills saved. The landing-page galaxy is updated immediately.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save skills."); }
    finally { setSaving(false); }
  }

  async function saveProject(event: FormEvent) {
    event.preventDefault(); if (!draft || !data) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const clean = { ...draft, slug: slugify(draft.slug || draft.name) };
      if (!clean.name.trim() || !clean.slug || !clean.description.trim()) throw new Error("Name, URL slug, and short description are required.");
      if (data.projects.some(project => project.slug === clean.slug && project.slug !== originalSlug)) throw new Error("Another project already uses this URL slug.");
      const projects = originalSlug ? data.projects.map(project => project.slug === originalSlug ? clean : project) : [clean, ...data.projects];
      await persist(projects); setDraft(clean); setOriginalSlug(clean.slug); setNotice("Project saved. Public pages are updated immediately.");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not save project."); }
    finally { setSaving(false); }
  }

  async function deleteProject(project: Project) {
    if (!data || !window.confirm(`Delete “${project.name}”? This cannot be undone.`)) return;
    setSaving(true); setError("");
    try { await persist(data.projects.filter(item => item.slug !== project.slug)); if (originalSlug === project.slug) setDraft(null); setNotice("Project deleted."); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Could not delete project."); }
    finally { setSaving(false); }
  }

  async function toggleFeatured(project: Project) {
    if (!data) return;
    setSaving(true); setError(""); setNotice("");
    try {
      const projects = data.projects.map(item => item.slug === project.slug ? { ...item, featured: !item.featured } : item);
      await persist(projects);
      setNotice(project.featured ? `${project.name} removed from the landing page.` : `${project.name} is now featured on the landing page.`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Could not update featured status."); }
    finally { setSaving(false); }
  }

  async function uploadImages(event: ChangeEvent<HTMLInputElement>) {
    if (!draft || !event.target.files?.length) return;
    setUploading(true); setError("");
    const form = new FormData(); Array.from(event.target.files).forEach(file => form.append("images", file));
    try {
      const response = await fetch("/api/upload", { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: form });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || "Image upload failed.");
      setDraft(current => current ? { ...current, images: [...current.images, ...result.urls] } : current);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Image upload failed."); }
    finally { setUploading(false); event.target.value = ""; }
  }

  if (!data) return <main className="admin-login"><form className="glass" onSubmit={login}><Link className="brand" href="/"><span className="brand-mark">R</span><span>RAHUL<span className="muted">VERSE</span></span></Link><p className="kicker">Secure console</p><h1>Welcome back, Rahul.</h1><p>Enter your private admin token to manage projects, skills, screenshots, links, and messages.</p><input type="password" value={token} onChange={event => setToken(event.target.value)} placeholder="Admin access token" required/><button className="button primary">Enter dashboard <Icon name="arrow"/></button>{error && <p className="admin-error">{error}</p>}<small>Development token: rahulverse-local. Set ADMIN_TOKEN in .env.local before deployment.</small></form></main>;

  return <main className="admin-shell">
    <aside><Link className="brand" href="/"><span className="brand-mark">R</span><span>RAHULVERSE</span></Link><nav><button className={section === "overview" ? "active" : ""} onClick={() => { setSection("overview"); setDraft(null); }}>Overview</button><button className={section === "projects" ? "active" : ""} onClick={() => { setSection("projects"); setDraft(null); }}>Projects</button><button className={section === "skills" ? "active" : ""} onClick={() => { setSection("skills"); setDraft(null); setNotice(""); }}>Skills Galaxy</button><button className={section === "messages" ? "active" : ""} onClick={() => { setSection("messages"); setDraft(null); }}>Messages</button></nav><div className="admin-side-links"><Link href="/#skills">View skills ↗</Link><button onClick={() => { setData(null); setToken(""); }}>Sign out</button></div></aside>
    <section>
      <header><div><p className="kicker">Command center</p><h1>{draft ? (originalSlug ? "Edit project" : "New project") : section === "projects" ? "Project studio" : section === "skills" ? "Skills galaxy" : section === "messages" ? "Inbox" : "Good to see you."}</h1></div><div className="admin-avatar">RK</div></header>
      {error && <div className="admin-alert error">{error}</div>}{notice && <div className="admin-alert success">{notice}</div>}

      {section === "overview" && <><div className="admin-stats"><div className="glass"><span>Published projects</span><strong>{data.projects.length}</strong></div><div className="glass"><span>Skills in galaxy</span><strong>{data.skills.length}</strong></div><div className="glass"><span>Contact messages</span><strong>{data.messages.length}</strong></div></div><div className="admin-columns"><div><h2>Recent projects</h2><ProjectList projects={data.projects.slice(0, 5)} onEdit={edit} onDelete={deleteProject} onToggleFeatured={toggleFeatured}/></div><div><h2>Latest messages</h2><MessageList messages={data.messages.slice(0, 4)}/></div></div></>}

      {section === "projects" && !draft && <div className="admin-projects"><div className="admin-toolbar"><div><p>{data.projects.length} projects in your portfolio</p><small>Use Feature/Unfeature to control what appears on the homepage.</small></div><button className="button primary" onClick={() => edit()}>+ Add project</button></div><ProjectList projects={data.projects} onEdit={edit} onDelete={deleteProject} onToggleFeatured={toggleFeatured}/></div>}

      {section === "messages" && <div className="admin-messages-page"><h2>Messages from your contact form</h2><MessageList messages={data.messages}/></div>}

      {section === "skills" && <div className="skills-editor"><div className="admin-toolbar"><div><p>{data.skills.length} skills in your portfolio</p><small>Every saved skill is positioned automatically in the landing-page galaxy.</small></div><div className="skills-actions"><button className="button ghost" onClick={addSkill}>+ Add skill</button><button className="button primary" onClick={saveSkills} disabled={saving}>{saving ? "Saving…" : "Save skills"}</button></div></div><div className="skills-admin-list">{data.skills.map((skill, index) => <article className="glass skill-admin-card" key={skill.id}><div className="skill-order">{String(index + 1).padStart(2, "0")}</div><AdminField label="Skill name"><input value={skill.name} onChange={event => updateSkill(skill.id, { name: event.target.value })}/></AdminField><AdminField label="Category"><input value={skill.type} onChange={event => updateSkill(skill.id, { type: event.target.value })}/></AdminField><AdminField label="Confidence"><div className="skill-level-control"><input type="range" min="0" max="100" value={skill.level} onChange={event => updateSkill(skill.id, { level: Number(event.target.value) })}/><input type="number" min="0" max="100" value={skill.level} onChange={event => updateSkill(skill.id, { level: Number(event.target.value) })}/><span>%</span></div></AdminField><button className="skill-remove" onClick={() => setData({ ...data, skills: data.skills.filter(item => item.id !== skill.id) })} aria-label={`Remove ${skill.name}`}>×</button></article>)}</div></div>}

      {section === "projects" && draft && <form className="project-editor" onSubmit={saveProject}>
        <div className="editor-actions"><button type="button" className="button ghost" onClick={() => setDraft(null)}>← Back</button><button className="button primary" disabled={saving}>{saving ? "Saving…" : "Save project"}</button></div>
        <div className="editor-grid">
          <div className="editor-main glass">
            <h2>Project information</h2>
            <div className="form-row"><AdminField label="Project name"><input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value, slug: originalSlug ? draft.slug : slugify(event.target.value) })} required/></AdminField><AdminField label="URL slug"><input value={draft.slug} onChange={event => setDraft({ ...draft, slug: slugify(event.target.value) })} required/></AdminField></div>
            <div className="form-row"><AdminField label="Project type"><input value={draft.eyebrow} onChange={event => setDraft({ ...draft, eyebrow: event.target.value })}/></AdminField><AdminField label="Category"><input value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}/></AdminField></div>
            <AdminField label="Short description"><textarea rows={3} value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} required/></AdminField>
            <AdminField label="Full project story"><textarea rows={6} value={draft.longDescription} onChange={event => setDraft({ ...draft, longDescription: event.target.value })}/></AdminField>
            <div className="form-row three"><AdminField label="Year"><input value={draft.year} onChange={event => setDraft({ ...draft, year: event.target.value })}/></AdminField><AdminField label="Status"><input value={draft.status} onChange={event => setDraft({ ...draft, status: event.target.value })}/></AdminField><AdminField label="Difficulty"><select value={draft.difficulty} onChange={event => setDraft({ ...draft, difficulty: event.target.value })}><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></AdminField></div>
            <AdminField label="Technology stack (comma separated)"><input value={draft.stack.join(", ")} onChange={event => setDraft({ ...draft, stack: event.target.value.split(",").map(value => value.trim()).filter(Boolean) })}/></AdminField>
            <AdminField label="Features (one per line)"><textarea rows={5} value={draft.features.join("\n")} onChange={event => setDraft({ ...draft, features: event.target.value.split("\n").map(value => value.trim()).filter(Boolean) })}/></AdminField>
            <div className="form-row"><AdminField label="Challenge"><textarea rows={4} value={draft.challenge} onChange={event => setDraft({ ...draft, challenge: event.target.value })}/></AdminField><AdminField label="Solution"><textarea rows={4} value={draft.solution} onChange={event => setDraft({ ...draft, solution: event.target.value })}/></AdminField></div>
          </div>
          <aside className="editor-sidebar">
            <div className="glass editor-panel"><h2>Publish settings</h2><label className="feature-toggle"><input type="checkbox" checked={draft.featured} onChange={event => setDraft({ ...draft, featured: event.target.checked })}/><span><b>Featured project</b><small>Show this project on the homepage</small></span></label><AdminField label="Accent color"><select value={draft.accent} onChange={event => setDraft({ ...draft, accent: event.target.value as Project["accent"] })}><option value="violet">Violet</option><option value="cyan">Cyan</option><option value="amber">Amber</option></select></AdminField></div>
            <div className="glass editor-panel"><h2>Project links</h2><AdminField label="Live demo URL"><input type="url" value={draft.liveUrl} onChange={event => setDraft({ ...draft, liveUrl: event.target.value })} placeholder="https://..."/></AdminField><AdminField label="GitHub repository URL"><input type="url" value={draft.githubUrl} onChange={event => setDraft({ ...draft, githubUrl: event.target.value })} placeholder="https://github.com/..."/></AdminField></div>
            <div className="glass editor-panel"><h2>Project pictures</h2><p className="panel-note">The first picture is used as the cover. JPG, PNG, WebP or GIF; maximum 5 MB each.</p><label className="upload-button">{uploading ? "Uploading…" : "+ Upload pictures"}<input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple onChange={uploadImages} disabled={uploading}/></label><div className="image-manager">{draft.images.map((image, index) => <div key={image}><img src={image} alt={`Project upload ${index + 1}`}/><span>{index === 0 ? "Cover" : `Image ${index + 1}`}</span><div>{index > 0 && <button type="button" onClick={() => setDraft({ ...draft, images: [image, ...draft.images.filter(item => item !== image)] })}>Make cover</button>}<button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter(item => item !== image) })}>Remove</button></div></div>)}</div></div>
          </aside>
        </div>
      </form>}
    </section>
  </main>;
}

function AdminField({ label, children }: { label: string; children: React.ReactNode }) { return <label className="admin-field"><span>{label}</span>{children}</label>; }
function ProjectList({ projects, onEdit, onDelete, onToggleFeatured }: { projects: Project[]; onEdit: (project: Project) => void; onDelete: (project: Project) => void; onToggleFeatured: (project: Project) => void }) { return <div className="admin-list project-admin-list glass">{projects.length ? projects.map(project => <div key={project.slug}>{project.images?.[0] ? <img src={project.images[0]} alt=""/> : <span className="status-dot"/>}<div><b>{project.name}{project.featured && <em className="mini-featured">Featured</em>}</b><small>{project.category} · {project.status}</small></div><div className="row-actions"><button className={project.featured ? "unfeature" : "feature"} onClick={() => onToggleFeatured(project)}>{project.featured ? "Unfeature" : "Feature"}</button><Link href={`/projects/${project.slug}`} target="_blank">View</Link><button onClick={() => onEdit(project)}>Edit</button><button className="danger" onClick={() => onDelete(project)}>Delete</button></div></div>) : <p className="empty">No projects yet. Add your first project.</p>}</div>; }
function MessageList({ messages }: { messages: Message[] }) { return <div className="admin-list messages glass">{messages.length ? messages.map(message => <div key={message.id}><div><b>{message.subject}</b><small>{message.name} · {message.email} · {new Date(message.createdAt).toLocaleDateString()}</small><p>{message.message}</p></div></div>) : <p className="empty">No messages yet. The channel is open.</p>}</div>; }
