import type { Metadata } from "next";
import { MeClient } from "@/components/me/MeClient";

export const metadata: Metadata = { title: "Your submissions" };

export default function MePage() {
  return <MeClient />;
}
