# Deployment Checklist

This repo has two separate deployable apps:

- `frontend`: React + Vite app for Vercel
- `backend`: Express API for Render

## Frontend on Vercel

Use these Vercel project settings:

- Root Directory: `frontend`
- Framework Preset: `Vite`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`
- Node.js Version: `24.x`

This repo also has a root `vercel.json` that can build `frontend` if you accidentally leave Vercel's Root Directory at the repository root. The cleaner setup is still `frontend`.

Add this Vercel environment variable after the Render backend is live:

```text
VITE_API_BASE_URL=https://your-render-backend.onrender.com/api
```

Replace `your-render-backend` with the real Render service host.

## Backend on Render

Use these Render service settings:

- Environment: `Node`
- Root Directory: `backend`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/api/health`
- Node Version: `24`

Required Render environment variables:

```text
NODE_ENV=production
MONGO_URI=mongodb+srv://...
JWT_SECRET=use-a-long-random-secret
CORS_ORIGINS=https://my-portfolio-five-tau-30.vercel.app
```

Optional Render environment variables:

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
UPLOAD_DIR=/opt/render/project/src/uploads
```

`UPLOAD_DIR` only preserves uploaded files if you attach a Render persistent disk mounted at that same path. Without a disk, Render's filesystem changes are temporary.

## Deployment Order

1. Deploy the backend to Render first.
2. Open `https://your-render-backend.onrender.com/api/health` and confirm it returns JSON with `status: "ok"`.
3. Add the deployed Vercel frontend URL to Render's `CORS_ORIGINS`.
4. Add the deployed Render backend API URL to Vercel's `VITE_API_BASE_URL`.
5. Redeploy both services after changing environment variables.
6. Test the public portfolio page, admin bootstrap/login, image uploads, and contact form.

## Common Problems

- `Found invalid or discontinued Node.js Version: "18.x"` means a deployment config still points at Node 18. This repo now uses Node 24 in package metadata and version files.
- `CORS not allowed` means the exact Vercel URL is missing from `CORS_ORIGINS`.
- Frontend API calls going to `https://your-site.vercel.app/api` means `VITE_API_BASE_URL` is missing in Vercel.
- Admin login not staying logged in usually means the backend is not running with `NODE_ENV=production`, the frontend URL is not allowed by CORS, or the browser is blocking cross-site cookies.
- Uploaded files disappearing after redeploy means the backend is using Render's ephemeral filesystem without a persistent disk or cloud storage.
