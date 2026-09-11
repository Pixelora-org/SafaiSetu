import type { Metadata } from "next";
import { Figtree, Newsreader, Noto_Sans_Devanagari } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { NavBar } from "@/components/layout/NavBar";
import "./globals.css";

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

const deva = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: {
    default: "SafaiSetu — India's civic cleanup map",
    template: "%s · SafaiSetu",
  },
  description:
    "A live, map-centered hub for India's civic cleanup movement. See where it's bad nearby, who is already cleaning it, and where to go this weekend.",
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: "SafaiSetu — India's civic cleanup map",
    description:
      "Live map of dirty spots, citizen cleanups, organisations, and weekend drives.",
    type: "website",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${figtree.variable} ${newsreader.variable} ${deva.variable} h-full antialiased`}
      >
        <body className="flex h-full flex-col overflow-hidden bg-ink text-paper">
          <NavBar />
          <div className="ss-app-main relative min-h-0 flex-1 overflow-y-auto">{children}</div>
        </body>
      </html>
    </ClerkProvider>
  );
}
