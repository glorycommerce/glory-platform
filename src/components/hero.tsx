import Image from "next/image";
import Link from "next/link";
import { PRODUCT_PLACEHOLDER_IMAGE } from "@/lib/product-image";

export function Hero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[var(--surface)] shadow-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(215,120,84,0.14),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.08),transparent_35%)]" />
      <div className="relative grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10">
        <div className="space-y-6 py-2 md:py-6">
          <div className="inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Eid Edit 2026
          </div>
          <div className="space-y-4">
            <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-6xl">
              Elevated modest fashion with a storefront built to convert.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
              Shop signature dresses and hijabs, launch merchant campaigns, and
              let AI styling guide the next purchase without slowing down the
              brand experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white"
              href="/category/womens-dresses"
            >
              Shop Collection
            </Link>
            <Link
              className="rounded-full border border-black/10 bg-white/70 px-6 py-3 text-sm"
              href="/ai/try-on"
            >
              Try AI Styling
            </Link>
          </div>
          <div className="grid gap-3 pt-2 text-sm md:grid-cols-3">
            <div className="rounded-2xl border border-black/5 bg-white/70 p-4">
              <p className="text-2xl font-semibold">120+</p>
              <p className="mt-1 text-[var(--muted)]">fresh arrivals curated weekly</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/70 p-4">
              <p className="text-2xl font-semibold">24h</p>
              <p className="mt-1 text-[var(--muted)]">dispatch support in Dhaka</p>
            </div>
            <div className="rounded-2xl border border-black/5 bg-white/70 p-4">
              <p className="text-2xl font-semibold">AI</p>
              <p className="mt-1 text-[var(--muted)]">style search and try-on flow</p>
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="relative min-h-[340px] overflow-hidden rounded-[1.75rem]">
            <Image
              src={PRODUCT_PLACEHOLDER_IMAGE}
              alt="Featured collection"
              fill
              priority
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs uppercase tracking-[0.3em] text-white/70">
                Signature Drop
              </p>
              <p className="mt-2 text-2xl font-semibold">
                Soft tailoring, fluid silhouettes
              </p>
              <p className="mt-2 max-w-sm text-sm text-white/85">
                Designed for festive dressing, everyday ease, and merchant-led
                seasonal campaigns.
              </p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
            <div className="rounded-2xl border border-black/5 bg-white/70 p-5">
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Merchant Spotlight
              </p>
              <p className="mt-2 text-lg font-semibold">
                Launch a branded storefront in minutes.
              </p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Inventory sync, discounts, AI search, and local payment support
                are already wired in.
              </p>
            </div>
            <div className="rounded-2xl bg-[var(--accent)] px-5 py-5 text-white">
              <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                Limited Offer
              </p>
              <p className="mt-2 text-lg font-semibold">
                Up to 20% off selected edits
              </p>
              <p className="mt-2 text-sm text-white/80">
                Combine launch pricing with COD and flash campaigns for faster
                checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
