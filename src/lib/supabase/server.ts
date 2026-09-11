import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { auth } from "@clerk/nextjs/server";
import { isSupabaseConfigured } from "./config";

/**
 * Create a Supabase client for server components that uses Clerk's JWT.
 * 
 * Requires Clerk JWT template configured with Supabase claims:
 * - sub: {{user.id}}
 * - email: {{user.primary_email_address}}
 * - role: "authenticated"
 * 
 * See CLERK_SETUP.md for configuration steps.
 */
export async function createClient() {
  if (!isSupabaseConfigured()) return null;

  const { getToken } = await auth();
  
  // Get Clerk token with Supabase template
  const token = await getToken({ template: "supabase" });

  if (!token) {
    // User not signed in - return client with anon key for public data
    return createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    );
  }

  // Return client with Clerk JWT for authenticated access
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    },
  );
}
