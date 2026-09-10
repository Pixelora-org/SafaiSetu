import type { Metadata } from "next";
import { getPublicData } from "@/lib/data";
import { HomeClient } from "../home-client";

export const metadata: Metadata = { title: "Live map" };

export default async function MapPage() {
  const data = await getPublicData();
  return <HomeClient {...data} />;
}
