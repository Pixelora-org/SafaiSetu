"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { CATEGORIES, STATUSES } from "@/lib/categories";
import { INDIA_CENTER } from "@/lib/geo";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createClient } from "@/lib/supabase/client";
import { upsertLocalSubmission } from "@/lib/local-submissions";
import type { Category, SpotStatus } from "@/lib/types";

const LocationPicker = dynamic(
  () => import("./LocationPicker").then((m) => m.LocationPicker),
  { ssr: false },
);

type Step = 1 | 2 | 3 | 4 | 5;

export function SubmitWizard() {
  const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [step, setStep] = useState<Step>(1);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [lat, setLat] = useState(INDIA_CENTER.lat);
  const [lng, setLng] = useState(INDIA_CENTER.lng);
  const [picked, setPicked] = useState(false);
  const [category, setCategory] = useState<Category>("river");
  const [status, setStatus] = useState<SpotStatus>("dirty");
  const [story, setStory] = useState("");
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  const mediaType = useMemo<"photo" | "video">(() => {
    if (file?.type.startsWith("video")) return "video";
    return "photo";
  }, [file]);

  function onFile(next: File | null) {
    setFile(next);
    if (!next) {
      setPreview("");
      return;
    }
    setPreview(URL.createObjectURL(next));
  }

  function gps() {
    navigator.geolocation?.getCurrentPosition((pos) => {
      setLat(pos.coords.latitude);
      setLng(pos.coords.longitude);
      setPicked(true);
    });
  }

  async function submit() {
    setError("");
    if (!file || !picked) {
      setError("A photo or short video and a map pin are required.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Keep media under 20MB for v1.");
      return;
    }
    setPending(true);

    try {
      // Handle demo mode (no Supabase)
      if (!isSupabaseConfigured()) {
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        upsertLocalSubmission({
          id: crypto.randomUUID(),
          displayName: user?.fullName ?? "You",
          category,
          status,
          lat,
          lng,
          city,
          story,
          mediaType,
          mediaUrl: dataUrl,
          moderationStatus: "pending",
          featured: false,
          createdAt: new Date().toISOString(),
        });
        setStep(5);
        return;
      }

      // Check Clerk authentication
      if (!isSignedIn || !user) {
        router.push("/login");
        return;
      }

      const supabase = createClient();
      if (!supabase) throw new Error("Supabase is not configured.");
      
      const userId = user.id;
      const path = `${userId}/${crypto.randomUUID()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from("submissions")
        .upload(path, file, { upsert: false });
      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("submissions").insert({
        user_id: userId,
        display_name: user.fullName ?? user.emailAddresses[0]?.emailAddress ?? "Citizen",
        category,
        status,
        lat,
        lng,
        city,
        story,
        media_type: mediaType,
        media_path: path,
        moderation_status: "pending",
      });
      if (insertError) throw insertError;
      setStep(5);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not submit.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-lg px-4 py-10">
      <p className="text-xs uppercase tracking-wide text-marigold">Log a cleanup</p>
      <h1 className="font-serif mt-1 text-3xl">Show the work.</h1>
      <p className="mt-2 text-sm text-paper/60">
        Photo or video, a pin, a category, a short story. It sits in a moderation queue before the
        map and feed.
      </p>
      {!isSupabaseConfigured() ? (
        <p className="mt-3 rounded-xl border border-marigold/40 bg-marigold/10 px-3 py-2 text-xs text-marigold">
          Demo mode: this stays on your device until Supabase is connected. Same flow, local queue.
        </p>
      ) : !isSignedIn ? (
        <p className="mt-3 rounded-xl border border-river/40 bg-river/10 px-3 py-2 text-xs text-river-bright">
          Sign in required to submit cleanups to the live map. Your submission will be reviewed before publishing.
        </p>
      ) : null}

      {step === 1 && (
        <section className="mt-6 space-y-4">
          <label className="block rounded-2xl border border-dashed border-paper/25 p-6 text-center">
            <input
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {preview ? (
              mediaType === "video" ? (
                <video src={preview} className="mx-auto max-h-64 rounded-lg" controls />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="Preview" className="mx-auto max-h-64 rounded-lg" />
              )
            ) : (
              <span>Tap to add a photo or a video under 30 seconds.</span>
            )}
          </label>
          <button
            type="button"
            disabled={!file}
            onClick={() => setStep(2)}
            className="w-full rounded-full bg-marigold py-2.5 font-medium text-ink disabled:opacity-40"
          >
            Next — pin it
          </button>
        </section>
      )}

      {step === 2 && (
        <section className="mt-6 space-y-3">
          <p className="text-sm text-paper/70">
            We store the spot, not a trail from your house. Drop a pin on the dirty or cleaned place.
          </p>
          <button
            type="button"
            onClick={gps}
            className="rounded-full bg-river px-3 py-1.5 text-sm"
          >
            Use my location
          </button>
          <LocationPicker
            lat={lat}
            lng={lng}
            onPick={(nextLat, nextLng) => {
              setLat(nextLat);
              setLng(nextLng);
              setPicked(true);
            }}
          />
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (optional)"
            className="w-full rounded-xl border border-paper/15 bg-ink-soft px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(1)} className="flex-1 rounded-full border border-paper/20 py-2">
              Back
            </button>
            <button
              type="button"
              disabled={!picked}
              onClick={() => setStep(3)}
              className="flex-1 rounded-full bg-marigold py-2 text-ink disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </section>
      )}

      {step === 3 && (
        <section className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  category === cat.id ? "bg-marigold text-ink" : "bg-paper/10"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {STATUSES.map((row) => (
              <button
                key={row.id}
                type="button"
                onClick={() => setStatus(row.id)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  status === row.id ? "bg-paper text-ink" : "bg-paper/10"
                }`}
              >
                {row.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(2)} className="flex-1 rounded-full border border-paper/20 py-2">
              Back
            </button>
            <button type="button" onClick={() => setStep(4)} className="flex-1 rounded-full bg-marigold py-2 text-ink">
              Next
            </button>
          </div>
        </section>
      )}

      {step === 4 && (
        <section className="mt-6 space-y-4">
          <textarea
            value={story}
            onChange={(e) => setStory(e.target.value)}
            rows={5}
            placeholder="What did you find? What did you do? Keep it short."
            className="w-full rounded-xl border border-paper/15 bg-ink-soft px-3 py-2 text-sm"
          />
          {error ? <p className="text-sm text-danger">{error}</p> : null}
          <div className="flex gap-2">
            <button type="button" onClick={() => setStep(3)} className="flex-1 rounded-full border border-paper/20 py-2">
              Back
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={submit}
              className="flex-1 rounded-full bg-marigold py-2 text-ink disabled:opacity-40"
            >
              {pending ? "Sending…" : "Submit for review"}
            </button>
          </div>
        </section>
      )}

      {step === 5 && (
        <section className="mt-8 rounded-2xl border border-paper/10 p-6">
          <h2 className="font-serif text-2xl">In the queue.</h2>
          <p className="mt-2 text-sm leading-6 text-paper/75">
            Nothing goes live until a human looks at it. That is slow on purpose. Check /me for
            status, or keep mapping.
          </p>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={() => router.push("/me")} className="rounded-full bg-marigold px-4 py-2 text-ink">
              My submissions
            </button>
            <button type="button" onClick={() => router.push("/map")} className="rounded-full border border-paper/20 px-4 py-2">
              Back to map
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
