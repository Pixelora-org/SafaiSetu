# SafaiSetu

A live, map-centered hub for India's civic cleanup movement. Phase 0: the map, an honest stats ticker, a seeded wall of fame, a submission queue, organisations, and this-weekend drives.

The homepage **is** the map. Content is the hook. Local proof and a weekend reason to act are why people come back.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Public pages (map, feed, orgs, sources) work from the in-repo seed — no cloud account required.

## What ships in Phase 0

- National CPCB river-stretch layer (approximate centroids, labeled as such) plus dense pins for Madhya Pradesh, Mumbai, and Bengaluru
- Stats ticker with dated citations on `/sources`
- Reels-style `/feed` seeded with real stories (Bittu Tabahi / Ajnar, Afroz Shah / Versova, The Ugly Indian, PotHoleRaja, Namami Gange)
- Auth-gated `/submit` when Supabase is connected; same wizard in local demo mode otherwise
- `/admin` moderation (approve / reject / feature)
- Organisation directory and a thin this-weekend strip
- Share cards at `/api/og/[id]`

## Connect Supabase (auth, storage, live writes)

1. Create a project, enable Google auth, add the callback `{SITE_URL}/auth/callback`.
2. Copy `.env.example` to `.env.local` and fill `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `ADMIN_EMAILS`.
3. Run `supabase/migrations/20260908120000_init.sql` in the SQL editor.
4. In Authentication → Users, set your user's `app_metadata` to `{ "role": "admin" }` so moderation writes pass RLS.

Until that is done, `/submit` stores a pending item on this device and `/admin` can review it there.

## Deploy on Vercel

The app is a standard Next.js project. Import the Git repo in Vercel, set the env vars above for production, and add the production URL to the Google OAuth redirect list and `NEXT_PUBLIC_SITE_URL`.

## Credibility rules

- Ticker numbers come from `src/data/stats.ts` (or the `stats` table). No invented health figures.
- Government pins are CPCB 2025 stretch centroids, not station-grade GPS.
- No Instagram scraping. YouTube ingest is Phase 1.
