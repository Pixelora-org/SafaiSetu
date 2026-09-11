# Supabase Setup Guide for SafaiSetu (Database + Storage)

**⚠️ Auth is now handled by Clerk.** This guide is for Supabase database and storage setup only. For authentication setup, see `CLERK_SETUP.md`.

This guide walks you through setting up Supabase for SafaiSetu's database and storage needs.

---

## Prerequisites

- Supabase account (free tier works): [supabase.com](https://supabase.com)
- Clerk already configured (see `CLERK_SETUP.md`)

---

## Step 1: Create Supabase Project

1. Go to [supabase.com/dashboard](https://supabase.com/dashboard)
2. Click **"New project"**
3. Fill in:
   - **Name:** `safaisetu` (or your choice)
   - **Database Password:** Generate a strong password (save it securely)
   - **Region:** Choose closest to your users (e.g., `ap-south-1` for India)
4. Click **"Create new project"**
5. Wait 2-3 minutes for provisioning

---

## Step 2: Collect Environment Variables

Once your project is ready:

1. Go to **Project Settings** → **API** (left sidebar)
2. Copy these values (you'll need them later):
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API keys** → **anon/public** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

**Example:**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Do NOT use the `service_role` key** — RLS works via Clerk JWT integration (see `CLERK_SETUP.md`).

---

## Step 3: Run Database Migration

1. Go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Copy the entire contents of `supabase/migrations/20260908120000_init.sql` from this repo
4. Paste into the editor
5. Click **"Run"** (bottom right)
6. Verify success: You should see "Success. No rows returned"

**What this creates:**
- `profiles` table (user profiles)
- `organizations` table (org directory)
- `spots` table (map pins)
- `submissions` table (moderation queue)
- `feed_items` table (wall of fame)
- `events` table (weekend drives)
- `stats` table (live stats)
- Storage buckets: `submissions` (private), `feed-media` (public)
- RLS policies for all tables

---

## Step 4: Verify Storage Buckets

1. Go to **Storage** (left sidebar)
2. You should see two buckets:
   - **submissions** (private) — for user-uploaded photos/videos
   - **feed-media** (public) — for curated content

If buckets are missing:
1. Click **"New bucket"**
2. Create `submissions`:
   - Name: `submissions`
   - Public: **OFF** (unchecked)
   - File size limit: `20 MB`
   - Allowed MIME types: `image/*,video/*`
3. Create `feed-media`:
   - Name: `feed-media`
   - Public: **ON** (checked)
   - File size limit: `50 MB`

---

## Step 5: Configure Clerk JWT Integration

**IMPORTANT:** Supabase RLS policies depend on `auth.uid()` which requires Clerk JWT configuration.

Follow `CLERK_SETUP.md` Steps 2-3 to:
1. Create Clerk JWT template with Supabase claims
2. Configure Supabase to accept Clerk JWTs as third-party auth

Without this, submissions will fail with RLS errors.

---

## Step 6: Configure Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   # Clerk (see CLERK_SETUP.md)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Supabase (database + storage)
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   
   # Site URL
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   
   # Admin emails
   ADMIN_EMAILS=your-email@gmail.com
   ```

3. Replace:
   - Clerk keys → from Clerk Dashboard (see `CLERK_SETUP.md`)
   - `YOUR-PROJECT-REF` → your Supabase project URL prefix
   - `your-anon-key-here` → your anon/public key from Step 2
   - `your-email@gmail.com` → your admin email

---

## Step 7: Set Admin Permissions

See `CLERK_SETUP.md` Step 5 for admin setup via Clerk.

---

## Step 8: Test the Flow Locally

**Prerequisites:** Clerk must be configured (see `CLERK_SETUP.md`) before testing.

### 8a. Start Dev Server
```bash
npm install
npm run dev
```
Open http://localhost:3000

### 8b. Submit a Cleanup
1. Go to http://localhost:3000/submit
2. **Sign in with Clerk** (email/password or social)
3. Upload a test photo (any image < 20MB)
4. Drop a pin on the map (click anywhere)
5. Choose category (e.g., "River") and status (e.g., "Dirty")
6. Add a short story: "Test submission from Supabase setup"
7. Click **"Submit for review"**
8. You should see: "In the queue."

### 8c. Moderate the Submission
1. Go to http://localhost:3000/admin
2. You should see your test submission with the photo
3. Click **"Approve"** → submission is published to map
4. OR click **"Feature"** → submission appears on map + feed

### 8d. Verify on Map
1. Go to http://localhost:3000/map
2. Toggle **"Citizen action"** layer (orange chip)
3. You should see your pin on the map
4. Click the pin → drawer shows your story and photo

### 8e. Verify on Feed (if featured)
1. Go to http://localhost:3000/feed
2. Scroll to find your submission
3. You should see your story in the vertical scroller

---

## Step 9: Deploy to Vercel

See `CLERK_SETUP.md` for complete deployment guide including:
1. Setting environment variables in Vercel
2. Configuring Clerk for production
3. No additional Supabase configuration needed (JWT issuer stays the same)

---

## Troubleshooting

### "Auth is not wired yet" message
- Check that all env vars are set in `.env.local` (Clerk + Supabase)
- Restart dev server: `npm run dev`

### RLS errors or "new row violates row-level security policy"
- **Cause:** Clerk JWT integration not configured
- **Fix:** Follow `CLERK_SETUP.md` Steps 2-3 to set up JWT template

### Uploaded image doesn't show in admin queue
- Check storage bucket policies are created (Step 3 migration)
- Verify `submissions` bucket exists and is private (Step 4)
- Check browser console for errors (F12 → Console)

---

## What Gets Created When You Approve

(Same as before — see original SUPABASE_SETUP.md for details)

---

## Required Secrets Summary

For the coordinator to collect:

| Secret | Where to Find | Purpose |
|--------|--------------|---------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk Dashboard → API Keys | Authentication |
| `CLERK_SECRET_KEY` | Clerk Dashboard → API Keys | Server auth |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Dashboard → API | Database connection |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase Dashboard → API | Database access |

**NOT needed:**
- ❌ Google OAuth credentials (Clerk handles auth)
- ❌ `service_role` key — RLS via Clerk JWT is cleaner

---

## Next Steps

1. ✅ Supabase DB + Storage configured
2. ✅ Clerk auth wired (see `CLERK_SETUP.md`)
3. 🔄 Test submit → moderate → publish flow
4. 🔄 Add more content (feed stories, events, orgs)

---

## Support

- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Supabase support: [supabase.com/dashboard/support](https://supabase.com/dashboard/support)
- SafaiSetu repo: Check README.md for project overview
