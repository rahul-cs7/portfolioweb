import { NextResponse } from "next/server";
import { saveResume } from "@/models/store";
import { supabaseRequest, supabaseUrl } from "@/models/supabase";
import { isAdminRequest } from "@/controllers/adminAuth";

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const file = form.get("resume");
  if (!(file instanceof File)) return NextResponse.json({ error: "Choose a PDF résumé." }, { status: 400 });
  if (file.size === 0 || file.size > 4 * 1024 * 1024) {
    return NextResponse.json({ error: "The PDF must be under 4 MB." }, { status: 400 });
  }
  const bytes = await file.arrayBuffer();
  if (new TextDecoder().decode(bytes.slice(0, 5)) !== "%PDF-") {
    return NextResponse.json({ error: "That file is not a valid PDF." }, { status: 400 });
  }
  const filename = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-").slice(0, 100) || "resume.pdf";
  const objectName = `${Date.now()}-${crypto.randomUUID()}.pdf`;
  await supabaseRequest(`/storage/v1/object/portfolio-resumes/${objectName}`, {
    method: "POST",
    headers: { "Content-Type": "application/pdf", "cache-control": "3600" },
    body: bytes,
  });
  const resume = {
    url: supabaseUrl(`/storage/v1/object/public/portfolio-resumes/${objectName}`),
    filename,
    updatedAt: new Date().toISOString(),
  };
  await saveResume(resume);
  return NextResponse.json(resume);
}
