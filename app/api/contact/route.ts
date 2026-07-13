import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.company) return NextResponse.json({ ok: true });
  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().slice(0, 180);
  const subject = String(body.subject || "").trim().slice(0, 160);
  const message = String(body.message || "").trim().slice(0, 4000);
  if (name.length < 2 || !emailPattern.test(email) || subject.length < 3 || message.length < 10) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const file = path.join(process.cwd(), "data/messages.json");
  const messages = JSON.parse(await fs.readFile(file, "utf8").catch(() => "[]"));
  messages.unshift({ id: crypto.randomUUID(), name, email, subject, message, createdAt: new Date().toISOString(), status: "new" });
  await fs.writeFile(file, JSON.stringify(messages.slice(0, 500), null, 2));
  return NextResponse.json({ ok: true });
}
