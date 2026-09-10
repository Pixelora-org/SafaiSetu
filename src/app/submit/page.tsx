import type { Metadata } from "next";
import { SubmitWizard } from "@/components/submit/SubmitWizard";

export const metadata: Metadata = { title: "Log a cleanup" };

export default function SubmitPage() {
  return <SubmitWizard />;
}
