import { NextResponse } from "next/server";
import { addMessage } from "@/models/store";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body || body.company) return NextResponse.json({ ok: true });
  const name = String(body.name || "").trim().slice(0, 80);
  const email = String(body.email || "").trim().slice(0, 180);
  const subject = String(body.subject || "").trim().slice(0, 160);
  const message = String(body.message || "").trim().slice(0, 4000);
  if (name.length < 2 || !emailPattern.test(email) || subject.length < 3 || message.length < 10) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  await addMessage({ id: crypto.randomUUID(), name, email, subject, message, createdAt: new Date().toISOString(), status: "new" });
  return NextResponse.json({ ok: true });
}
