import { FEED_ITEMS, ORGANIZATIONS, EVENTS, SEED_SPOTS, liveStats } from "@/data";
import { createClient } from "@/lib/supabase/server";
import type {
  FeedItem,
  Organization,
  Spot,
  Stat,
  WeekendEvent,
  Submission,
} from "@/lib/types";

export type PublicData = {
  spots: Spot[];
  feed: FeedItem[];
  orgs: Organization[];
  events: WeekendEvent[];
  stats: Stat[];
};

function weekAgoIso() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString();
}

function mapSpot(row: Record<string, unknown>): Spot {
  return {
    id: String(row.id),
    name: String(row.name),
    nameHi: (row.name_hi as string) ?? undefined,
    category: row.category as Spot["category"],
    status: row.status as Spot["status"],
    source: row.source as Spot["source"],
    lat: Number(row.lat),
    lng: Number(row.lng),
    state: String(row.state),
    city: (row.city as string) ?? undefined,
    description: (row.description as string) ?? undefined,
    cpcbPriority: (row.cpcb_priority as Spot["cpcbPriority"]) ?? undefined,
    sourceCitation: (row.source_citation as Spot["sourceCitation"]) ?? {
      label: "SafaiSetu",
      url: "/sources",
      date: "",
    },
    photoUrl: (row.photo_url as string) ?? undefined,
    updatedAt: String(row.updated_at ?? new Date().toISOString()),
    feedItemId: (row.feed_item_id as string) ?? undefined,
  };
}

function mapFeed(row: Record<string, unknown>): FeedItem {
  return {
    id: String(row.id),
    kind: row.kind as FeedItem["kind"],
    title: String(row.title),
    story: String(row.story ?? ""),
    place: String(row.place ?? ""),
    state: String(row.state ?? ""),
    sourceLabel: String(row.source_label ?? ""),
    youtubeVideoId: (row.youtube_video_id as string) ?? undefined,
    embedUrl: (row.embed_url as string) ?? undefined,
    imageUrl: (row.image_url as string) ?? undefined,
    spotId: (row.spot_id as string) ?? undefined,
    orgSlug: (row.org_slug as string) ?? undefined,
    publishedAt: String(row.published_at),
    featured: Boolean(row.featured),
  };
}

function mapOrg(row: Record<string, unknown>): Organization {
  return {
    id: String(row.id),
    slug: String(row.slug),
    name: String(row.name),
    tagline: String(row.tagline ?? ""),
    description: String(row.description ?? ""),
    city: String(row.city ?? ""),
    coverage: (row.coverage as string[]) ?? [],
    website: (row.website as string) ?? undefined,
    howToJoin: String(row.how_to_join ?? ""),
    verified: Boolean(row.verified),
    category: row.category as Organization["category"],
  };
}

function mapEvent(row: Record<string, unknown>): WeekendEvent {
  return {
    id: String(row.id),
    title: String(row.title),
    orgSlug: String(row.org_slug ?? ""),
    orgName: String(row.org_name ?? ""),
    startsAt: String(row.starts_at),
    city: String(row.city ?? ""),
    state: String(row.state ?? ""),
    lat: Number(row.lat),
    lng: Number(row.lng),
    whatToBring: String(row.what_to_bring ?? ""),
    confirmNote: String(row.confirm_note ?? ""),
    website: (row.website as string) ?? undefined,
  };
}

export async function getPublicData(): Promise<PublicData> {
  const supabase = await createClient();
  if (!supabase) {
    return {
      spots: SEED_SPOTS,
      feed: FEED_ITEMS,
      orgs: ORGANIZATIONS,
      events: EVENTS,
      stats: liveStats(SEED_SPOTS, 0),
    };
  }

  const [{ data: dbSpots }, { data: dbFeed }, { data: dbOrgs }, { data: dbEvents }, week] =
    await Promise.all([
      supabase.from("spots").select("*"),
      supabase.from("feed_items").select("*").eq("published", true).order("published_at", { ascending: false }),
      supabase.from("organizations").select("*"),
      supabase.from("events").select("*").order("starts_at"),
      supabase
        .from("submissions")
        .select("id", { count: "exact", head: true })
        .eq("moderation_status", "approved")
        .gte("created_at", weekAgoIso()),
    ]);

  const spots = dbSpots?.length ? dbSpots.map(mapSpot) : SEED_SPOTS;
  const feed = dbFeed?.length ? dbFeed.map(mapFeed) : FEED_ITEMS;
  const orgs = dbOrgs?.length ? dbOrgs.map(mapOrg) : ORGANIZATIONS;
  const events = dbEvents?.length ? dbEvents.map(mapEvent) : EVENTS;
  const weekCount = week.count ?? 0;

  return {
    spots,
    feed,
    orgs,
    events,
    stats: liveStats(spots, weekCount),
  };
}

export async function getSpot(id: string) {
  const { spots } = await getPublicData();
  return spots.find((s) => s.id === id) ?? null;
}

export async function getFeedItem(id: string) {
  const { feed } = await getPublicData();
  return feed.find((f) => f.id === id) ?? null;
}

export async function getOrg(slug: string) {
  const { orgs } = await getPublicData();
  return orgs.find((o) => o.slug === slug) ?? null;
}

export async function getUserSubmissions(): Promise<Submission[]> {
  const supabase = await createClient();
  if (!supabase) return [];
  const { data: claims } = await supabase.auth.getClaims();
  const userId = claims?.claims?.sub as string | undefined;
  if (!userId) return [];
  const { data } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  return (data as Submission[]) ?? [];
}
