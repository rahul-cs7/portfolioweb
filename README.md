# RahulVerse

A cinematic full-stack portfolio for Rahul Kumar, built with Next.js, React, TypeScript, Canvas, and a file-backed content API.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open `http://localhost:3000`. The admin console is at `/admin`.

The local fallback admin token is `rahulverse-local`. Set a strong `ADMIN_TOKEN` in `.env.local` before deployment.

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

Project content lives in `data/content.json`. Contact messages are written to `data/messages.json` and can be read through the protected admin API. Uploaded project images are stored in `public/uploads`.

From `/admin`, select **Projects** to add or edit a project. Enable **Featured project** to show it on the landing page; every saved project appears in the `/projects` archive. The first uploaded picture becomes the project cover.

Select **Skills Galaxy** to update the skills shown on the landing page. Saving the editor updates `data/content.json` and the public galaxy immediately.

For multi-instance or serverless production deployments, replace the JSON persistence layer with MongoDB/Postgres, move uploads to Cloudinary/S3, and connect the contact route to an email provider. The API boundaries are already isolated for that migration.

## Checks

```bash
npm run lint
npm run build
npm audit --omit=dev
```
