"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { copy } from "@/lib/messages";

const LINKS = [
  { href: "/map", label: "Map" },
  { href: "/feed", label: copy.feed },
  { href: "/orgs", label: copy.orgs },
  { href: "/submit", label: copy.submit },
];

export function NavBar() {
  const pathname = usePathname();
  const { isSignedIn } = useUser();
  const hide = pathname === "/feed";
  const onMap = pathname === "/map";

  if (hide) return null;

  return (
    <header className="relative z-50 flex shrink-0 items-center justify-between border-b border-paper/10 bg-ink/95 px-4 py-3 backdrop-blur">
      <Link href="/" className="font-serif text-lg tracking-tight text-paper">
        {copy.brand}
        <span className="font-deva ml-2 text-sm text-river-bright">{copy.brandHi}</span>
      </Link>
      <nav className="flex items-center gap-3 text-sm">
        {LINKS.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-full px-3 py-1.5 ${
                active
                  ? "bg-marigold text-ink"
                  : onMap
                    ? "text-paper/90 hover:bg-paper/10"
                    : "text-paper/80 hover:bg-paper/10 hover:text-paper"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
        {isSignedIn ? (
          <UserButton
            appearance={{
              elements: {
                avatarBox: "w-8 h-8",
              },
            }}
          />
        ) : (
          <Link
            href="/login"
            className="rounded-full border border-paper/20 px-3 py-1.5 text-paper/80 hover:bg-paper/10"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
