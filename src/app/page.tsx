import { getPublicData } from "@/lib/data";
import { LandingPage } from "@/components/landing/LandingPage";

export default async function HomePage() {
  const data = await getPublicData();
  return <LandingPage {...data} />;
}
