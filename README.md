# RahulVerse

A cinematic full-stack portfolio for Rahul Kumar, built with Next.js, React, TypeScript, Canvas, and Supabase.

## Run locally

1. Create a Supabase project and run [`supabase/schema.sql`](supabase/schema.sql) in its SQL Editor.
2. Copy `.env.example` to `.env.local`. Set `SUPABASE_URL` to the project URL and `SUPABASE_SECRET_KEY` to a **secret** (`sb_secret_...`) key from Settings → API Keys. Set a private `ADMIN_TOKEN`.
3. Run the one-time import below to copy the existing JSON data, project screenshots, and résumé into Supabase. It preserves any content already saved there.

```bash
node --env-file=.env.local scripts/import-to-supabase.mjs
npm run dev
```

Open `http://localhost:3000`. The admin console is at `/admin`.

For Vercel, set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `ADMIN_TOKEN`, and `NEXT_PUBLIC_SITE_URL` in the project environment settings, then redeploy. Keep the secret key on the server; never prefix it with `NEXT_PUBLIC_`. The local fallback admin token is `rahulverse-local` only when `ADMIN_TOKEN` is absent in development.

## Included

- Responsive cinematic landing experience with an animated canvas cosmos
- Story, skill galaxy, experience, education, research, project, résumé, and contact sections
- Featured-project landing section, filterable `/projects` archive, and dynamic case-study pages
- Interactive terminal (`whoami`, `skills`, `projects`, `contact`, `resume`)
- Dark/light themes, reduced-motion support, semantic navigation, and structured SEO data
- Contact endpoint with validation and honeypot spam protection
- Token-protected admin editor for creating, updating, featuring, and deleting projects
- Admin Skills Galaxy editor for skill names, categories, confidence levels, additions, and removals
- Project screenshot uploads plus live-demo and GitHub repository links
- Lightweight visitor analytics endpoint
- Sitemap, robots rules, Open Graph metadata, and downloadable résumé

## Content

Project content, contact messages, visit counts, and the current résumé record live in Supabase Postgres. Uploaded project images live in the public `project-images` Storage bucket; the résumé PDF lives in `portfolio-resumes`. The files under `data/`, `public/uploads/`, and `public/original-resume.pdf` are import sources for existing content. The app seeds missing database rows from the JSON files on first access; the import command transfers existing files into Storage.

From `/admin`, select **Projects** to add or edit a project. Enable **Featured project** to show it on the landing page; every saved project appears in the `/projects` archive. The first uploaded picture becomes the project cover.

Select **Skills Galaxy** to update the skills shown on the landing page. Saving the editor updates Supabase and the public galaxy immediately.

Select **Résumé** to view the current PDF or upload a replacement up to 4 MB. Both `/resume` and the older `/resume.pdf` link open the latest uploaded file immediately.

The contact form saves messages in Supabase. It does not send an email notification.

## Project structure

This uses an MVC-style layout within Next.js App Router:

```text
app/          Next.js pages and thin API route entries
controllers/  Request validation, admin authorization, and API handlers
models/       Supabase access, saved data, types, and static portfolio content
views/        React UI grouped into admin, home, projects, and shared components
data/         Initial JSON data used for one-time seeding
supabase/     Database and Storage schema
scripts/      One-time data import
```

For example, `/api/content` enters through `app/api/content/route.ts`, uses `controllers/contentController.ts` for authorization and request handling, and reads or writes through `models/store.ts`. The admin interface is in `views/admin/AdminDashboard.tsx`.

## Checks

```bash
npm run lint
npm run build
npm audit --omit=dev
```
