"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import { readLocalSubmissions } from "@/lib/local-submissions";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { getSignedMediaUrl } from "@/lib/supabase/storage";
import type { Submission } from "@/lib/types";

export function MeClient() {
  const { user, isSignedIn } = useUser();
  const [rows, setRows] = useState<Submission[]>([]);
  const [email, setEmail] = useState<string | null>(null);
  const [mediaUrls, setMediaUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setRows(readLocalSubmissions());
      setEmail("demo@local");
      return;
    }
    
    if (!isSignedIn || !user) {
      setEmail(null);
      return;
    }

    const supabase = createClient();
    if (!supabase) return;
    
    void (async () => {
      setEmail(user.emailAddresses[0]?.emailAddress ?? null);
      const userId = user.id;
      
      const { data: list } = await supabase
        .from("submissions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      
      const submissions = (list ?? []).map((row) => ({
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
      }));
      
      setRows(submissions);

      // Fetch signed URLs for media display
      const urlMap: Record<string, string> = {};
      for (const sub of submissions) {
        if (sub.mediaUrl && !sub.mediaUrl.startsWith("data:")) {
          const signedUrl = await getSignedMediaUrl(supabase, sub.mediaUrl);
          if (signedUrl) urlMap[sub.id] = signedUrl;
        } else if (sub.mediaUrl) {
          urlMap[sub.id] = sub.mediaUrl;
        }
      }
      setMediaUrls(urlMap);
    })();
  }, [isSignedIn, user]);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-serif text-3xl">Your submissions</h1>
      <p className="mt-2 text-sm text-paper/60">{email ?? "Not signed in"}</p>
      <ul className="mt-6 space-y-3">
        {rows.length === 0 ? (
          <li className="text-sm text-paper/60">
            Nothing yet. <Link href="/submit" className="text-marigold">Log a cleanup</Link>.
          </li>
        ) : (
          rows.map((row) => (
            <li key={row.id} className="rounded-xl border border-paper/10 p-4">
              <p className="text-xs uppercase tracking-wide text-marigold">{row.moderationStatus}</p>
              <p className="mt-1 font-medium">
                {row.category} · {row.status}
              </p>
              <p className="mt-1 text-sm text-paper/70">{row.story || "No story"}</p>
              {mediaUrls[row.id] ? (
                row.mediaType === "video" ? (
                  <video src={mediaUrls[row.id]} className="mt-2 max-h-32 rounded-lg" controls />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={mediaUrls[row.id]} alt="" className="mt-2 max-h-32 rounded-lg" />
                )
              ) : null}
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
