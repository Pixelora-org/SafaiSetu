import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { FeedScroller } from "@/components/feed/FeedScroller";

export const metadata: Metadata = { title: "Wall of fame" };

export default async function FeedPage() {
  const { feed } = await getPublicData();
  return <FeedScroller items={feed} />;
}
