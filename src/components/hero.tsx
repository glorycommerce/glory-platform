import Link from "next/link";

export function Hero() {
  return (
    <section className="grid gap-8 rounded-3xl bg-[var(--surface)] p-10 shadow-sm md:grid-cols-[1.3fr_0.7fr]">
      <div className="space-y-6">
        <p className="text-xs uppercase tracking-[0.35em] text-[var(--muted)]">
          Glory Collections
        </p>
        <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
          Modest fashion, modern commerce, and AI styling in one place.
        </h1>
        <p className="text-base text-[var(--muted)] md:text-lg">
          Explore curated dresses and hijabs, unlock exclusive bundles, and
          preview your look with AI try-on. Built for Glory and merchant
          partners.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white"
            href="/category/womens-dresses"
          >
            Shop New Arrivals
          </Link>
          <Link
            className="rounded-full border border-black/10 px-6 py-3 text-sm"
            href="/ai/try-on"
          >
            AI Try-On Studio
          </Link>
        </div>
        <div className="flex flex-wrap gap-6 text-xs text-[var(--muted)]">
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">20%</p>
            <p>Launch discount</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">24h</p>
            <p>Flash timer</p>
          </div>
          <div>
            <p className="text-lg font-semibold text-[var(--foreground)]">COD</p>
            <p>Pay on delivery</p>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 rounded-2xl bg-[var(--surface-soft)] p-6">
        <p className="text-sm font-semibold">Today’s Highlights</p>
        <div className="flex-1 rounded-2xl border border-dashed border-black/10 bg-white/50 p-4">
          <p className="text-sm text-[var(--muted)]">
            Slot reserved for hero banner / brand partner creative.
          </p>
        </div>
        <div className="rounded-2xl bg-[var(--accent)]/10 p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
            Merchant Spotlight
          </p>
          <p className="mt-2 text-sm font-semibold">
            Apply for a subdomain storefront in minutes.
          </p>
        </div>
      </div>
    </section>
  );
}
