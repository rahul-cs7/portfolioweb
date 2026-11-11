import { NextResponse } from "next/server";
import { getContent, getMessages, getResume, saveContent } from "@/models/store";
import { isAdminRequest } from "@/controllers/adminAuth";
export async function GET(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const [content, messages, resume] = await Promise.all([getContent(), getMessages(), getResume()]);
  return NextResponse.json({ ...content, messages, resume });
}
export async function PUT(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const data = await request.json().catch(() => null);
  if (!data || !Array.isArray(data.projects) || !Array.isArray(data.skills)) return NextResponse.json({ error: "Invalid content" }, { status: 400 });
  await saveContent({ projects: data.projects, skills: data.skills });
  return NextResponse.json({ ok: true });
}
