import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FEED_ITEMS } from "@/data/feed";
import { getFeedItem, getPublicData } from "@/lib/data";
import { siteUrl } from "@/lib/supabase/config";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return FEED_ITEMS.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getFeedItem(id);
  if (!item) return { title: "Story" };
  const url = `${siteUrl()}/stories/${item.id}`;
  return {
    title: item.title,
    description: item.story,
    openGraph: {
      title: item.title,
      description: item.place,
      url,
      images: [{ url: `/api/og/${item.id}`, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: item.title,
      images: [`/api/og/${item.id}`],
    },
  };
}

export default async function StoryPage({ params }: Props) {
  const { id } = await params;
  const item = await getFeedItem(id);
  if (!item) notFound();
  const { orgs } = await getPublicData();
  const org = orgs.find((o) => o.slug === item.orgSlug);

  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <p className="text-xs uppercase tracking-wide text-marigold">
        {item.place} · {item.state}
      </p>
      <h1 className="font-serif mt-2 text-4xl leading-tight">{item.title}</h1>
      <p className="mt-2 text-sm text-paper/50">Source: {item.sourceLabel}</p>
      {item.youtubeVideoId ? (
          <div className="relative mt-6 aspect-video overflow-hidden rounded-2xl bg-black">
          <iframe
            title={item.title}
            src={`https://www.youtube.com/embed/${item.youtubeVideoId}`}
            className="absolute inset-0 h-full w-full border-0"
            allow="encrypted-media; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : null}
      <p className="mt-6 text-base leading-7 text-paper/85">{item.story}</p>
      {item.embedUrl ? (
        <a
          href={item.embedUrl}
          className="mt-4 inline-block text-sm text-river-bright underline"
          target="_blank"
          rel="noreferrer"
        >
          Read the original reporting
        </a>
      ) : null}
      <div className="mt-8 flex flex-wrap gap-2">
        <Link href="/feed" className="rounded-full bg-paper/10 px-4 py-2 text-sm">
          Back to feed
        </Link>
        <Link href="/map" className="rounded-full bg-marigold px-4 py-2 text-sm text-ink">
          Open the map
        </Link>
        {org ? (
          <Link href={`/orgs/${org.slug}`} className="rounded-full border border-paper/20 px-4 py-2 text-sm">
            {org.name}
          </Link>
        ) : null}
      </div>
    </main>
  );
}
