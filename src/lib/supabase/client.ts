import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { useAuth } from "@clerk/nextjs";
import { useMemo } from "react";
import { isSupabaseConfigured } from "./config";

/**
 * Create a Supabase client for client components that uses Clerk's JWT.
 * 
 * Requires Clerk JWT template configured with Supabase claims.
 * See CLERK_SETUP.md for configuration steps.
 */
export function createClient() {
  if (!isSupabaseConfigured()) return null;

  const { getToken } = useAuth();

  return useMemo(() => {
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        global: {
          fetch: async (url, options = {}) => {
            // Get Clerk token with Supabase template
            const clerkToken = await getToken({ template: "supabase" });

            // Inject Clerk JWT into Supabase requests
            const headers = new Headers(options.headers);
            if (clerkToken) {
              headers.set("Authorization", `Bearer ${clerkToken}`);
            }

            return fetch(url, {
              ...options,
              headers,
            });
          },
        },
      },
    );
  }, [getToken]);
}
