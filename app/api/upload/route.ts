import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

function allowed(request: Request) {
  const token = process.env.ADMIN_TOKEN || (process.env.NODE_ENV !== "production" ? "rahulverse-local" : "");
  return Boolean(token) && request.headers.get("authorization") === `Bearer ${token}`;
}

const imageTypes: Record<string, string> = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif" };

export async function POST(request: Request) {
  if (!allowed(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const form = await request.formData();
  const files = form.getAll("images").filter((item): item is File => item instanceof File);
  if (!files.length) return NextResponse.json({ error: "Choose at least one image." }, { status: 400 });
  if (files.length > 8) return NextResponse.json({ error: "Upload up to 8 images at a time." }, { status: 400 });
  const uploadDir = path.join(process.cwd(), "public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });
  const urls: string[] = [];
  for (const file of files) {
    const extension = imageTypes[file.type];
    if (!extension || file.size > 5 * 1024 * 1024) return NextResponse.json({ error: "Use JPG, PNG, WebP, or GIF images under 5 MB." }, { status: 400 });
    const safeBase = file.name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 48) || "project";
    const filename = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeBase}${extension}`;
    await fs.writeFile(path.join(uploadDir, filename), Buffer.from(await file.arrayBuffer()));
    urls.push(`/uploads/${filename}`);
  }
  return NextResponse.json({ urls });
}
