import type { FeedItem } from "@/lib/types";

export const FEED_ITEMS: FeedItem[] = [
  {
    id: "story-bittu",
    kind: "curated_embed",
    title: "One student. One river. Months of unglamorous work.",
    story:
      "Surendra Singh Choudhary — Bittu Tabahi — started pulling plastic, bottles and algae out of the Ajnar in Biaora on Republic Day 2026. He used his own savings, caught skin infections, and kept going after friends dropped off. The before-and-after reached Boyan Slat, who offered him a job at The Ocean Cleanup. This is the spark SafaiSetu exists to turn into a map, not a lottery.",
    place: "Ajnar River, Biaora",
    state: "Madhya Pradesh",
    sourceLabel: "The Times of India / The Better India",
    embedUrl:
      "https://timesofindia.indiatimes.com/life-style/people/i-dont-know-why-people-throw-garbage-in-the-river-how-20-year-old-viral-sensation-bittu-tabahi-single-handedly-cleaned-mps-ajnar-river-despite-no-funding-and-health-risks/articleshow/133761756.cms",
    spotId: "mp-ajnar-biaora",
    publishedAt: "2026-08-01",
    featured: true,
  },
  {
    id: "story-afroz",
    kind: "youtube",
    title: "Versova was a dump. Then a lawyer started showing up every weekend.",
    story:
      "Afroz Shah began cleaning Versova Beach in 2015 by himself. Volunteers followed. The UN named it the world's largest beach cleanup. The work is not finished — it is a weekly habit. That habit is the product.",
    place: "Versova Beach, Mumbai",
    state: "Maharashtra",
    sourceLabel: "Great Big Story",
    youtubeVideoId: "JtGsdiYdObQ",
    spotId: "mum-versova",
    orgSlug: "afroz-shah-foundation",
    publishedAt: "2018-01-01",
    featured: true,
  },
  {
    id: "story-tui",
    kind: "youtube",
    title: "The Ugly Indian does not talk. They fix the spot.",
    story:
      "Anonymous Bangalore volunteers who treat a 15-year dump as a weekend problem. No branding, no speeches, no credit. Kaam chalu, mooh bandh. If the feed made you angry, this is who to copy.",
    place: "MG Road, Bengaluru",
    state: "Karnataka",
    sourceLabel: "The Ugly Indian",
    youtubeVideoId: "abl1Z-sTcYY",
    spotId: "blr-tui-mgroad",
    orgSlug: "the-ugly-indian",
    publishedAt: "2012-02-01",
    featured: true,
  },
  {
    id: "story-pothole",
    kind: "curated_embed",
    title: "Potholes are civic cleanup too. Someone already built the report button.",
    story:
      "PotHoleRaja exists so you do not have to invent a pothole tracker. See a crater, report it, track it. If you fill one yourself, log it here so the map learns the road is no longer a trap.",
    place: "Bengaluru and beyond",
    state: "Karnataka",
    sourceLabel: "PotHoleRaja",
    embedUrl: "https://www.potholeraja.com/",
    orgSlug: "potholeraja",
    publishedAt: "2024-01-01",
    featured: true,
  },
  {
    id: "story-gange",
    kind: "curated_embed",
    title: "Namami Gange is a government door, not a hashtag.",
    story:
      "If a reel made you want to help the Ganga, there is already a national mission with volunteer channels and state committees. Use it. Freelancing a holy river alone is how people burn out.",
    place: "Ganga basin",
    state: "Uttar Pradesh",
    sourceLabel: "National Mission for Clean Ganga",
    embedUrl: "https://nmcg.nic.in/",
    orgSlug: "namami-gange",
    publishedAt: "2025-01-01",
    featured: true,
  },
];
