"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSignedMediaUrl } from "@/lib/supabase/storage";
import { readLocalSubmissions, writeLocalSubmissions } from "@/lib/local-submissions";
import { checkAdmin } from "@/app/admin/actions";
import type { Submission } from "@/lib/types";

export function AdminQueue() {
  const [rows, setRows] = useState<Submission[]>([]);
  const [allowed, setAllowed] = useState(false);
  const [message, setMessage] = useState("");
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  async function load() {
    const access = await checkAdmin();
    setAllowed(access.ok);
    if (!access.ok) return;
    if (!isSupabaseConfigured()) {
      setRows(readLocalSubmissions());
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    const { data } = await supabase
      .from("submissions")
      .select("*")
      .order("created_at", { ascending: false });
    
    const submissions = (data ?? []).map((row) => ({
      id: row.id,
      userId: row.user_id,
      displayName: row.display_name,
      category: row.category,
      status: row.status,
      lat: row.lat,
      lng: row.lng,
      city: row.city,
      story: row.story,
      mediaType: row.media_type,
      mediaUrl: row.media_path,
      moderationStatus: row.moderation_status,
      featured: row.featured,
      createdAt: row.created_at,
      spotId: row.spot_id,
    }));
    
    setRows(submissions);

    // Fetch signed URLs for media display
    const urlMap: Record<string, string> = {};
    for (const sub of submissions) {
      if (sub.mediaUrl && !sub.mediaUrl.startsWith("data:")) {
        const signedUrl = await getSignedMediaUrl(supabase, sub.mediaUrl);
        if (signedUrl) urlMap[sub.id] = signedUrl;
      } else if (sub.mediaUrl) {
        urlMap[sub.id] = sub.mediaUrl; // Local base64
      }
    }
    setMediaUrls(urlMap);
  }

  useEffect(() => {
    void load();
  }, []);

  async function setStatus(id: string, moderationStatus: Submission["moderationStatus"], featured = false) {
    if (!isSupabaseConfigured()) {
      const next = readLocalSubmissions().map((row) =>
        row.id === id ? { ...row, moderationStatus, featured } : row,
      );
      writeLocalSubmissions(next);
      setRows(next);
      setMessage("Updated on this device.");
      return;
    }
    const supabase = createClient();
    if (!supabase) return;
    const { error } = await supabase
      .from("submissions")
      .update({ moderation_status: moderationStatus, featured })
      .eq("id", id);
    if (error) {
      setMessage(error.message);
      return;
    }
    if (moderationStatus === "approved") {
      const row = rows.find((r) => r.id === id);
      if (row) {
        // Get signed URL for the media to store in spots table
        const mediaUrl = await getSignedMediaUrl(supabase, row.mediaUrl);
        
        // Update submission with spot_id
        await supabase
          .from("submissions")
          .update({ spot_id: `user-${id}` })
          .eq("id", id);

        // Create spot on map
        await supabase.from("spots").upsert({
          id: `user-${id}`,
          name: row.story.slice(0, 80) || "Citizen report",
          category: row.category,
          status: row.status,
          source: "user",
          lat: row.lat,
          lng: row.lng,
          state: "Unknown",
          city: row.city,
          photo_url: mediaUrl,
          source_citation: {
            label: "Citizen submission",
            url: "/sources",
            date: new Date().toISOString().slice(0, 10),
          },
        });

        // Create feed item if featured
        if (featured) {
          await supabase.from("feed_items").upsert({
            id: `sub-${id}`,
            kind: "user_upload",
            title: row.story.slice(0, 90) || "A cleanup logged on SafaiSetu",
            story: row.story,
            place: row.city ?? "",
            state: "Unknown",
            source_label: row.displayName,
            image_url: mediaUrl,
            spot_id: `user-${id}`,
            featured: true,
            published: true,
            submission_id: id,
          });
        }
      }
    }
    setMessage("Saved.");
    await load();
  }

  if (!allowed) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16">
        <h1 className="font-serif text-3xl">Admin</h1>
        <p className="mt-3 text-sm text-paper/70">
          Sign in with an admin Google account. Set ADMIN_EMAILS or app_metadata.role = admin.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-serif text-3xl">Moderation</h1>
      <p className="mt-2 text-sm text-paper/60">
        Approve publishes a map pin. Feature also drops it on the wall of fame.
      </p>
      {message ? <p className="mt-3 text-sm text-river-bright">{message}</p> : null}
      <ul className="mt-6 space-y-4">
        {rows.map((row) => (
          <li key={row.id} className="rounded-2xl border border-paper/10 p-4">
            <p className="text-xs uppercase tracking-wide text-marigold">
              {row.moderationStatus} {row.featured ? "· featured" : ""}
            </p>
            <p className="mt-1 text-sm">
              {row.displayName} · {row.category} · {row.status} · {row.city}
            </p>
            <p className="mt-2 text-sm text-paper/75">{row.story}</p>
            {mediaUrls[row.id] ? (
              row.mediaType === "video" ? (
                <video src={mediaUrls[row.id]} className="mt-3 max-h-48 rounded-lg" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrls[row.id]} alt="" className="mt-3 max-h-48 rounded-lg" />
              )
            ) : null}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setStatus(row.id, "approved")}
                className="rounded-full bg-cleaned px-3 py-1 text-sm text-paper"
              >
                Approve
              </button>
              <button
                type="button"
                onClick={() => setStatus(row.id, "approved", true)}
                className="rounded-full bg-marigold px-3 py-1 text-sm text-ink"
              >
                Feature
              </button>
              <button
                type="button"
                onClick={() => setStatus(row.id, "rejected")}
                className="rounded-full bg-danger/80 px-3 py-1 text-sm"
              >
                Reject
              </button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
