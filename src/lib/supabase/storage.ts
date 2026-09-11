import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Get a signed URL for a private storage path (submissions bucket).
 * Returns null if the path is empty or starts with "data:" (local demo).
 */
export async function getSignedMediaUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("data:")) return path; // Local demo base64
  if (path.startsWith("http")) return path; // Already a URL

  // Get signed URL valid for 1 hour
  const { data, error } = await supabase.storage
    .from("submissions")
    .createSignedUrl(path, 3600);

  if (error) {
    console.error("Failed to get signed URL:", error);
    return null;
  }

  return data?.signedUrl ?? null;
}

/**
 * Get a public URL for a public storage path (feed-media bucket).
 */
export function getPublicMediaUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
): string | null {
  if (!path) return null;
  if (path.startsWith("data:")) return path;
  if (path.startsWith("http")) return path;

  const { data } = supabase.storage.from("feed-media").getPublicUrl(path);
  return data?.publicUrl ?? null;
}
