# Supabase Setup Guide for SafaiSetu

This guide walks you through setting up Supabase for SafaiSetu's submit → moderate → publish flow.

---

## Prerequisites

- Supabase account (free tier works): [supabase.com](https://supabase.com)
- Google Cloud Console project (for OAuth): [console.cloud.google.com](https://console.cloud.google.com)

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

⚠️ **Do NOT use the `service_role` key** — it bypasses RLS and should never be in client code.

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

## Step 5: Enable Google OAuth

### 5a. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or select existing)
3. Enable **Google+ API**:
   - Search for "Google+ API" in the API Library
   - Click **"Enable"**
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Configure OAuth consent screen if prompted:
   - User Type: **External**
   - App name: `SafaiSetu`
   - User support email: Your email
   - Developer contact: Your email
   - Save and continue through remaining steps
6. Create OAuth client ID:
   - Application type: **Web application**
   - Name: `SafaiSetu`
   - Authorized redirect URIs:
     - `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
     - Replace `YOUR-PROJECT-REF` with your Supabase project URL prefix
7. Click **"Create"**
8. Copy **Client ID** and **Client Secret**

### 5b. Configure Supabase Auth

1. In Supabase dashboard, go to **Authentication** → **Providers** (left sidebar)
2. Find **Google** in the list
3. Toggle **"Enable Google provider"** to ON
4. Paste your **Client ID** and **Client Secret** from Google Console
5. Add your site URL to **"Redirect URLs"**:
   - Development: `http://localhost:3000/auth/callback`
   - Production: `https://your-domain.com/auth/callback`
6. Click **"Save"**

---

## Step 6: Configure Local Environment

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` with your values:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-anon-key-here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ADMIN_EMAILS=your-email@gmail.com
   ```

3. Replace:
   - `YOUR-PROJECT-REF` → your Supabase project URL prefix
   - `your-anon-key-here` → your anon/public key from Step 2
   - `your-email@gmail.com` → the Google account you'll use for moderation

---

## Step 7: Set Admin Permissions

You need admin access to moderate submissions. Choose **one** method:

### Method A: Email Allowlist (easiest)
Already done if you set `ADMIN_EMAILS` in Step 6. Your Google account email will have admin access.

### Method B: User Metadata (more secure)
1. Sign in to SafaiSetu once with Google (http://localhost:3000/login)
2. In Supabase dashboard, go to **Authentication** → **Users**
3. Find your user in the list
4. Click the user → **Edit user** (pencil icon)
5. Scroll to **User Metadata** section
6. Add to **app_metadata** (JSON):
   ```json
   {
     "role": "admin"
   }
   ```
7. Click **"Save"**

---

## Step 8: Test the Flow Locally

### 8a. Start Dev Server
```bash
npm install
npm run dev
```
Open http://localhost:3000

### 8b. Submit a Cleanup
1. Go to http://localhost:3000/submit
2. Click **"Sign in to log a cleanup"** → sign in with Google
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

1. Push your code to GitHub (with `.env.local` in `.gitignore`)
2. Import the repo in [Vercel dashboard](https://vercel.com)
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
   - `NEXT_PUBLIC_SITE_URL` → your production URL (e.g., `https://safaisetu.vercel.app`)
   - `ADMIN_EMAILS` → your admin email(s)
4. Deploy
5. Update Google OAuth redirect URLs:
   - Go to Google Cloud Console → Credentials
   - Add production redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
6. Update Supabase redirect URLs:
   - Go to Supabase → Authentication → URL Configuration
   - Add: `https://your-domain.com/auth/callback`

---

## Troubleshooting

### "Auth is not wired yet" message
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in `.env.local`
- Restart dev server: `npm run dev`

### Google sign-in fails with "redirect_uri_mismatch"
- Go to Google Cloud Console → Credentials → OAuth client
- Add redirect URI: `https://YOUR-PROJECT-REF.supabase.co/auth/v1/callback`
- Wait 5 minutes for Google to propagate the change

### "Access denied" on /admin page
- Check that your email is in `ADMIN_EMAILS` in `.env.local`
- OR set `app_metadata.role = "admin"` in Supabase Auth → Users (see Step 7)
- Sign out and sign in again

### Uploaded image doesn't show in admin queue
- Check storage bucket policies are created (Step 3 migration)
- Verify `submissions` bucket exists and is private (Step 4)
- Check browser console for errors (F12 → Console)

### Approved pin doesn't appear on map
- Refresh the map page (F5)
- Toggle "Citizen action" layer OFF then ON
- Check Supabase logs: Database → Logs for errors

---

## What Gets Created When You Approve

When you click **"Approve"** in `/admin`:

1. **Submission status** → `moderation_status = 'approved'`
2. **New spot** created in `spots` table:
   - ID: `user-{submission-id}`
   - Category, status, lat/lng from submission
   - Photo URL: signed URL from storage
   - Source: `"user"`
3. **Submission linked** → `spot_id = user-{submission-id}`

When you click **"Feature"**:

4. **New feed item** created in `feed_items` table:
   - ID: `sub-{submission-id}`
   - Title from story (first 90 chars)
   - Image URL: signed URL from storage
   - Kind: `"user_upload"`
   - Published: `true`, Featured: `true`

---

## Required Secrets Summary

For the coordinator to collect from new Supabase project:

| Secret | Where to Find | Purpose |
|--------|--------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API → Project URL | Connect to Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Project Settings → API → anon/public key | Client-side auth |
| Google OAuth Client ID | Google Cloud Console → Credentials | Google sign-in |
| Google OAuth Client Secret | Google Cloud Console → Credentials | Google sign-in |

**NOT needed:**
- ❌ `service_role` key — RLS policies handle admin access
- ❌ Database password — only needed for direct DB access (not used by app)

---

## Next Steps

1. ✅ Supabase connected → users can submit cleanups
2. ✅ Admin can moderate → submissions publish to map + feed
3. 🔄 Add more content:
   - Seed weekend events in `events` table
   - Seed organizations in `organizations` table
   - Add curated feed stories in `feed_items` table
4. 🔒 Production hardening:
   - Add rate limiting to submission form
   - Enable Supabase Edge Functions for image compression
   - Set up monitoring alerts

---

## Support

- Supabase docs: [supabase.com/docs](https://supabase.com/docs)
- Supabase support: [supabase.com/dashboard/support](https://supabase.com/dashboard/support)
- SafaiSetu repo: Check README.md for project overview
