import { NextResponse } from "next/server";
import { getResume } from "@/models/store";

export async function GET(request: Request) {
  const resume = await getResume();
  return NextResponse.redirect(new URL(resume.url, request.url), 307);
}
