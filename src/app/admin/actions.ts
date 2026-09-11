"use server";

import { currentUser } from "@clerk/nextjs/server";
import { adminEmails } from "@/lib/supabase/config";

export async function checkAdmin() {
  const user = await currentUser();
  
  if (!user) {
    return { configured: true, ok: false };
  }

  const email = user.emailAddresses[0]?.emailAddress?.toLowerCase() ?? "";
  const role = user.publicMetadata?.role as string | undefined;
  const ok = role === "admin" || adminEmails().includes(email);
  
  return { configured: true, ok, email };
}
