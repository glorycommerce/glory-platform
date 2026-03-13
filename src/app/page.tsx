import { BannerSlot } from "@/components/banner-slot";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { PromoTimer } from "@/components/promo-timer";
import { SiteShell } from "@/components/site-shell";
import { listCatalogProducts } from "@/lib/services/catalog";

export default async function HomePage() {
  const featured = await listCatalogProducts({ merchantSlug: "glory", limit: 6 });
  return (
    <SiteShell>
      <div className="space-y-12">
        <Hero />

        <section className="grid gap-6 md:grid-cols-[2fr_1fr]">
          <div className="grid gap-6 rounded-3xl bg-[var(--surface)] p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                  Categories
                </p>
                <h2 className="text-2xl font-semibold">Shop by style</h2>
              </div>
              <p className="text-sm text-[var(--muted)]">Updated daily</p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                "Women’s Dresses",
                "Hijabs & Scarves",
                "Co-ords & Sets",
              ].map((label) => (
                <div
                  key={label}
                  className="rounded-2xl border border-black/5 bg-[var(--surface-soft)] p-4"
                >
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-[var(--muted)]">
                    Explore new drops
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <PromoTimer />
            <BannerSlot title="Hero Ad Slot" size="1200 × 480" />
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Featured
              </p>
              <h2 className="text-2xl font-semibold">Limited-edition picks</h2>
            </div>
            <p className="text-sm text-[var(--muted)]">See all</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((item) => (
              <ProductCard
                key={item.id}
                title={item.name}
                subtitle={`${item.variants[0]?.stitching ?? "UNSTITCHED"} • ${
                  item.variants[0]?.color ?? "Standard"
                }`}
                price={`BDT ${item.variants[0]?.price?.toLocaleString?.() ?? 0}`}
                slug={item.slug}
                tags={[
                  item.variants[0]?.size ?? "Multi-size",
                  item.activeDiscountPercent
                    ? `${item.activeDiscountPercent}% off`
                    : "Live",
                ]}
              />
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_1fr_1fr]">
          <BannerSlot title="Left Promo Slot" size="300 × 600" />
          <div className="rounded-3xl bg-[var(--surface)] p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
              AI Styling
            </p>
            <h3 className="mt-3 text-2xl font-semibold">
              Upload your photo and preview your look.
            </h3>
            <p className="mt-3 text-sm text-[var(--muted)]">
              AI try-on and visual search are ready for Gemini integration. We
              process images transiently for privacy.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="rounded-full bg-[var(--accent)]/10 px-4 py-2 text-xs">
                Try-on
              </div>
              <div className="rounded-full bg-[var(--accent)]/10 px-4 py-2 text-xs">
                Visual Search
              </div>
              <div className="rounded-full bg-[var(--accent)]/10 px-4 py-2 text-xs">
                Sales Assistant
              </div>
            </div>
          </div>
          <BannerSlot title="Right Promo Slot" size="300 × 600" />
        </section>
      </div>
    </SiteShell>
  );
}
