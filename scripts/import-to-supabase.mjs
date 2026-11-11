import fs from "node:fs/promises";
import path from "node:path";

const base = process.env.SUPABASE_URL?.replace(/\/$/, "");
const key = process.env.SUPABASE_SECRET_KEY;
if (!base || !key) throw new Error("Set SUPABASE_URL and SUPABASE_SECRET_KEY before importing.");

async function request(route, options = {}) {
  const response = await fetch(`${base}${route}`, {
    ...options, headers: { apikey: key, ...options.headers },
  });
  const body = await response.text();
  if (!response.ok) throw new Error(`${route}: ${response.status} ${body.slice(0, 300)}`);
  return body ? JSON.parse(body) : undefined;
}

async function readData(name) {
  return JSON.parse(await fs.readFile(path.join("data", `${name}.json`), "utf8"));
}

async function getState(id) {
  const rows = await request(`/rest/v1/portfolio_state?id=eq.${id}&select=payload`);
  return rows[0]?.payload;
}

async function insertState(id, payload) {
  await request("/rest/v1/portfolio_state?on_conflict=id", {
    method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify([{ id, payload }]),
  });
}

const localContent = await readData("content");
const localMessages = await readData("messages");
const localAnalytics = await readData("analytics");
await insertState("content", localContent);
await insertState("analytics", localAnalytics);

if (localMessages.length) {
  await request("/rest/v1/portfolio_messages?on_conflict=id", {
    method: "POST", headers: { "Content-Type": "application/json", Prefer: "resolution=ignore-duplicates,return=minimal" },
    body: JSON.stringify(localMessages.map(message => ({ id: message.id, created_at: message.createdAt, payload: message }))),
  });
}

const content = await getState("content");
let imageCount = 0;
for (const project of content.projects) {
  for (let i = 0; i < (project.images || []).length; i++) {
    const image = project.images[i];
    if (!image.startsWith("/uploads/")) continue;
    const filename = path.basename(image);
    const bytes = await fs.readFile(path.join("public", "uploads", filename));
    const extension = path.extname(filename).toLowerCase();
    const type = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif" }[extension];
    if (!type) throw new Error(`Unsupported image: ${filename}`);
    const route = `/storage/v1/object/project-images/imported/${encodeURIComponent(filename)}`;
    const response = await fetch(`${base}${route}`, {
      method: "POST", headers: { apikey: key, "Content-Type": type }, body: bytes,
    });
    if (!response.ok && response.status !== 409) throw new Error(`Image upload failed: ${filename}: ${response.status} ${await response.text()}`);
    project.images[i] = `${base}/storage/v1/object/public/project-images/imported/${encodeURIComponent(filename)}`;
    imageCount++;
  }
}

if (imageCount) {
  await request("/rest/v1/portfolio_state?id=eq.content", {
    method: "PATCH", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ payload: content }),
  });
}

let resumeImported = false;
if (!await getState("resume")) {
  const bytes = await fs.readFile(path.join("public", "original-resume.pdf"));
  const route = "/storage/v1/object/portfolio-resumes/imported/resume.pdf";
  const response = await fetch(`${base}${route}`, {
    method: "POST", headers: { apikey: key, "Content-Type": "application/pdf" }, body: bytes,
  });
  if (!response.ok && response.status !== 409) {
    throw new Error(`Résumé upload failed: ${response.status} ${await response.text()}`);
  }
  await insertState("resume", {
    url: `${base}/storage/v1/object/public/portfolio-resumes/imported/resume.pdf`,
    filename: "resume.pdf",
    updatedAt: null,
  });
  resumeImported = true;
}

console.log(`Import complete: ${content.projects.length} projects, ${localMessages.length} local messages, ${imageCount} images, résumé ${resumeImported ? "imported" : "already stored"}. Existing Supabase changes were preserved.`);
