# CollabFlow

A clean, collaborative project-management dashboard built with Next.js, React, TypeScript, and Tailwind CSS. The sample workspace includes a project board, team navigation, issue search and status filters, a progress indicator, and a working create-issue flow.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## GitHub

This folder is a standalone repository. Create an empty GitHub repository, then run these commands from this directory:

```bash
git init
git add .
git commit -m "Build CollabFlow project management app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/collabflow.git
git push -u origin main
```

The current version is a front-end demo with local in-memory issue state. Add authentication and a database such as Supabase or PostgreSQL before using it for persistent team data.
