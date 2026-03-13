import { SiteShell } from "@/components/site-shell";
import { ProductCard } from "@/components/product-card";
import { listCatalogProducts } from "@/lib/services/catalog";

type StorePageProps = {
  params: Promise<{ store: string }>;
};

export default async function StorefrontPage({ params }: StorePageProps) {
  const { store } = await params;
  const products = await listCatalogProducts({ merchantSlug: store, limit: 12 });

  return (
    <SiteShell>
      <div className="space-y-6">
        <section className="rounded-3xl bg-[var(--surface)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Merchant Storefront
          </p>
          <h1 className="mt-3 text-3xl font-semibold">{store} storefront</h1>
          <p className="mt-3 text-sm text-[var(--muted)]">
            This subdomain maps to merchant products, banners, coupons, and AI
            sales assistant settings.
          </p>
        </section>
        <section className="grid gap-6 md:grid-cols-3">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.name}
              subtitle={`${item.variants[0]?.stitching ?? "UNSTITCHED"} | ${
                item.variants[0]?.color ?? "Standard"
              }`}
              price={`BDT ${item.variants[0]?.price?.toLocaleString?.() ?? 0}`}
              slug={item.slug}
              image={item.variants[0]?.images[0] ?? ""}
            />
          ))}
        </section>
      </div>
    </SiteShell>
  );
}
