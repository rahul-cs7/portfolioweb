import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const contentFile = path.join(process.cwd(), "data/content.json");
const messagesFile = path.join(process.cwd(), "data/messages.json");
function allowed(request: Request) {
  const token = process.env.ADMIN_TOKEN || (process.env.NODE_ENV !== "production" ? "rahulverse-local" : "");
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}
export async function GET(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [content, messages] = await Promise.all([fs.readFile(contentFile, "utf8"), fs.readFile(messagesFile, "utf8")]);
  return NextResponse.json({ ...JSON.parse(content), messages: JSON.parse(messages) });
}
export async function PUT(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json();
  if (!Array.isArray(data.projects) || !Array.isArray(data.skills)) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  await fs.writeFile(contentFile, JSON.stringify({ skills: data.skills, projects: data.projects }, null, 2));
  return NextResponse.json({ ok: true });
}
