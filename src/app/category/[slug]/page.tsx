import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import { defaultSeo } from "@/lib/seo";
import { listCatalogProducts } from "@/lib/services/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug.replace(/-/g, " "),
    alternates: {
      canonical: `${defaultSeo.url}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const products = await listCatalogProducts({
    merchantSlug: "glory",
    categorySlug: slug,
    limit: 24,
  });

  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="rounded-3xl bg-[var(--surface)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Category
          </p>
          <h1 className="text-3xl font-semibold">{slug}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Explore categories and subcategories with filters for size,
            stitching, and color.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              title={item.name}
              subtitle={`${item.variants[0]?.stitching ?? "UNSTITCHED"} | ${
                item.variants[0]?.color ?? "Standard"
              }`}
              price={`BDT ${item.variants[0]?.price?.toLocaleString?.() ?? 0}`}
              slug={item.slug}
              tags={[item.variants[0]?.size ?? "Multi-size"]}
            />
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
