import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";

const file = path.join(process.cwd(), "data/analytics.json");
export async function GET() { return NextResponse.json(JSON.parse(await fs.readFile(file, "utf8"))); }
export async function POST() { const data = JSON.parse(await fs.readFile(file, "utf8")); data.visits += 1; await fs.writeFile(file, JSON.stringify(data, null, 2)); return NextResponse.json({ ok: true }); }
