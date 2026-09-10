"use server";

import { createClient } from "@/lib/supabase/server";
import { adminEmails } from "@/lib/supabase/config";

export async function checkAdmin() {
  const supabase = await createClient();
  if (!supabase) return { configured: false, ok: true };
  const { data } = await supabase.auth.getClaims();
  const email = String(data?.claims?.email ?? "").toLowerCase();
  const role = (data?.claims?.app_metadata as { role?: string } | undefined)?.role;
  const ok = role === "admin" || adminEmails().includes(email);
  return { configured: true, ok, email };
}
