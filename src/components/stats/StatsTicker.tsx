import Link from "next/link";
import type { Stat } from "@/lib/types";

export function StatsTicker({ stats }: { stats: Stat[] }) {
  return (
    <div className="ticker flex gap-8 overflow-hidden whitespace-nowrap border-y border-paper/10 bg-ink/80 px-4 py-2 text-xs backdrop-blur">
      <div className="flex min-w-full animate-[ticker_32s_linear_infinite] gap-8">
        {[...stats, ...stats].map((stat, i) => (
          <span key={`${stat.key}-${i}`} className="flex items-baseline gap-2">
            <span className="font-serif text-lg text-marigold">
              {stat.value.toLocaleString("en-IN")}
            </span>
            <span className="text-paper/70">{stat.label}</span>
            {stat.live ? (
              <span className="text-[10px] uppercase tracking-wide text-river-bright">live</span>
            ) : (
              <span className="text-[10px] text-paper/40">{stat.asOf}</span>
            )}
          </span>
        ))}
      </div>
      <Link
        href="/sources"
        className="shrink-0 self-center rounded-full border border-paper/20 px-2 py-0.5 text-[10px] uppercase tracking-wide text-paper/70"
      >
        Sources
      </Link>
    </div>
  );
}
