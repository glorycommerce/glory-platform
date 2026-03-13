import Image from "next/image";
import Link from "next/link";
import { BannerSlot } from "@/components/banner-slot";
import { Hero } from "@/components/hero";
import { ProductCard } from "@/components/product-card";
import { PromoTimer } from "@/components/promo-timer";
import { SiteShell } from "@/components/site-shell";
import { HOME_CATEGORIES } from "@/lib/category-content";
import { listCatalogProducts } from "@/lib/services/catalog";

export default async function HomePage() {
  const featured = await listCatalogProducts({ merchantSlug: "glory", limit: 6 });
  const categoryCards = HOME_CATEGORIES;

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
              {categoryCards.map((item) => (
                <div
                  key={item.label}
                  className="group relative min-h-[9.5rem] overflow-hidden rounded-2xl border border-black/5 bg-[var(--surface-soft)]"
                >
                  <Image
                    src={item.image}
                    alt={item.label}
                    fill
                    sizes="(min-width: 768px) 22vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/10 to-transparent" />
                  <div className="relative flex h-full flex-col justify-end p-4 text-white">
                    <div className="max-w-[13rem]">
                      <p className="text-sm font-semibold leading-5">{item.label}</p>
                      <p className="mt-1 text-xs leading-5 text-white/85">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-4">
            <PromoTimer />
            <BannerSlot title="Hero Ad Slot" />
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
                image={item.variants[0]?.images[0] ?? ""}
                tags={[
                  item.variants[0]?.size ?? "Multi-size",
                  item.activeDiscountPercent
                    ? `${item.activeDiscountPercent}% off`
                    : "Live",
                ]}
              />
            ))}
          </div>
          <div className="flex justify-center">
            <Link className="btn-secondary" href="/category/womens-dresses">
              See More
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_1fr_1fr]">
          <BannerSlot title="Left Promo Slot" />
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
              <div className="pill-soft">Try-on</div>
              <div className="pill-soft">Visual Search</div>
              <div className="pill-soft">Sales Assistant</div>
            </div>
          </div>
          <BannerSlot title="Right Promo Slot" />
        </section>
      </div>
    </SiteShell>
  );
}
