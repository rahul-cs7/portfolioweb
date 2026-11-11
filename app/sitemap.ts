import type { MetadataRoute } from "next";
import { getContent } from "@/models/store";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";const content=await getContent();const urls=["","/projects",...content.projects.map(project=>`/projects/${project.slug}`)];return urls.map(url=>({url:`${base}${url}`,lastModified:new Date(),changeFrequency:"monthly",priority:url?0.8:1})); }
