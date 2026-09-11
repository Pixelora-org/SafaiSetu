import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-lg px-4 py-20 text-center">
      <p className="font-deva text-river-bright">सफाईसेतु</p>
      <h1 className="font-serif mt-2 text-4xl">This pin is not on the map yet.</h1>
      <p className="mt-3 text-sm text-paper/70">Head back and pick a river, a dump, or a story.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-marigold px-4 py-2 text-ink">
        Back home
      </Link>
    </main>
  );
}
