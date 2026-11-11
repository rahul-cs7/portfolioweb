import { NextResponse } from "next/server";
import { addVisit, getVisits } from "@/models/store";

export async function GET() { return NextResponse.json({ visits: await getVisits() }); }
export async function POST() { await addVisit(); return NextResponse.json({ ok: true }); }
