"use client";

import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const params = useSearchParams();
  const next = params.get("next") ?? "/";
  const [error, setError] = useState("");

  async function google() {
    const supabase = createClient();
    if (!supabase) {
      setError("Connect Supabase to enable Google login. Submissions still work in demo mode.");
      return;
    }
    const origin = window.location.origin;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (authError) setError(authError.message);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-serif text-4xl">Sign in to log a cleanup.</h1>
      <p className="mt-3 text-sm leading-6 text-paper/70">
        The map, feed and organisations stay public. A Google account is only so a pin can be
        attributed and moderated.
      </p>
      {!isSupabaseConfigured() ? (
        <p className="mt-4 rounded-xl border border-marigold/40 bg-marigold/10 p-3 text-sm text-marigold">
          Auth is not wired yet. You can still use /submit in demo mode on this device.
        </p>
      ) : null}
      <button
        type="button"
        onClick={google}
        className="mt-8 w-full rounded-full bg-marigold py-3 font-medium text-ink"
      >
        Continue with Google
      </button>
      {error ? <p className="mt-3 text-sm text-danger">{error}</p> : null}
    </main>
  );
}
