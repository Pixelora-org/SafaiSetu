import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { WeekendStrip } from "@/components/weekend/WeekendStrip";

export const metadata: Metadata = { title: "This weekend" };

export default async function EventsPage() {
  const { events } = await getPublicData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="mt-3 mb-8 max-w-xl text-sm leading-6 text-paper/70">
        Real drives, times in IST. Confirm with the organiser. RSVP comes in Phase 2.
      </p>
      <WeekendStrip events={events} variant="page" />
    </main>
  );
}
