import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { OrgCard } from "@/components/orgs/OrgCard";

export const metadata: Metadata = { title: "Organisations" };

export default async function OrgsPage() {
  const { orgs, events } = await getPublicData();
  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-xs uppercase tracking-wide text-marigold">Directory</p>
      <h1 className="font-serif mt-1 text-4xl">Go with people who already do this.</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-paper/70">
        The feed is the spark. These groups are the Saturday. Pick one, confirm the time, show up.
      </p>
      <ul className="mt-8 space-y-4">
        {orgs.map((org) => (
          <li key={org.id}>
            <OrgCard
              org={org}
              nextEvent={events.find((event) => event.orgSlug === org.slug)}
            />
          </li>
        ))}
      </ul>
    </main>
  );
}
