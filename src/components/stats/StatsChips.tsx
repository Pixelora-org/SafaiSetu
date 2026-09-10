import Link from "next/link";
import type { Stat } from "@/lib/types";

export function StatsChips({ stats }: { stats: Stat[] }) {
  const shown = stats.slice(0, 4);
  return (
    <div className="flex max-w-full items-center gap-2 overflow-x-auto">
      {shown.map((stat) => (
        <div
          key={stat.key}
          className="shrink-0 rounded-full border border-paper/10 bg-ink/80 px-3 py-1.5 backdrop-blur"
        >
          <span className="font-serif text-sm text-marigold">
            {stat.value.toLocaleString("en-IN")}
          </span>
          <span className="ml-1.5 text-[11px] text-paper/70">{stat.label}</span>
        </div>
      ))}
      <Link
        href="/sources"
        className="shrink-0 rounded-full border border-paper/20 bg-ink/70 px-2.5 py-1.5 text-[10px] uppercase tracking-wide text-paper/70 backdrop-blur"
      >
        Sources
      </Link>
    </div>
  );
}
