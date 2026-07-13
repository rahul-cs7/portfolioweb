import type { MetadataRoute } from "next";
import fs from "node:fs/promises";
import path from "node:path";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> { const base=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";const content=JSON.parse(await fs.readFile(path.join(process.cwd(),"data/content.json"),"utf8"));const urls=["","/projects",...content.projects.map((project:{slug:string})=>`/projects/${project.slug}`)];return urls.map(url=>({url:`${base}${url}`,lastModified:new Date(),changeFrequency:"monthly",priority:url?0.8:1})); }
