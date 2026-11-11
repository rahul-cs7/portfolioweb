import { NextResponse } from "next/server";
import { supabaseRequest, supabaseUrl } from "@/models/supabase";
import { isAdminRequest } from "@/controllers/adminAuth";

const imageTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

export async function POST(request: Request) {
  if (!isAdminRequest(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const files = form.getAll("images").filter((item): item is File => item instanceof File);
  if (!files.length) return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
  if (files.length !== 1) return NextResponse.json({ error: "Upload one image per request." }, { status: 400 });
  const urls: string[] = [];
  for (const file of files) {
    const extension = imageTypes[file.type];
    if (!extension || file.size > 4 * 1024 * 1024) return NextResponse.json({ error: "Use JPG, PNG, WebP, or GIF images under 4 MB." }, { status: 400 });
    const safeBase = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "project";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBase}${extension}`;
    await supabaseRequest(`/storage/v1/object/project-images/${filename}`, {
      method: "POST", headers: { "Content-Type": file.type, "cache-control": "3600" }, body: file,
    });
    urls.push(supabaseUrl(`/storage/v1/object/public/project-images/${filename}`));
  }
  return NextResponse.json({ urls });
}
