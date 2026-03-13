import { SiteShell } from "@/components/site-shell";
import type { Metadata } from "next";
import { defaultSeo } from "@/lib/seo";
import { getCatalogProductBySlug } from "@/lib/services/catalog";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;

  return {
    title: slug.replace(/-/g, " "),
    alternates: {
      canonical: `${defaultSeo.url}/product/${slug}`,
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getCatalogProductBySlug(slug, "glory");
  const primary = product?.variants[0];
  const totalStock =
    product?.variants.reduce((sum, variant) => sum + variant.stock, 0) ?? 0;

  return (
    <SiteShell>
      <div className="grid gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="aspect-[4/5] rounded-3xl bg-[var(--surface-soft)]" />
        <div className="space-y-6 rounded-3xl bg-[var(--surface)] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            Product
          </p>
          <h1 className="text-3xl font-semibold">{product?.name ?? slug}</h1>
          <p className="text-sm text-[var(--muted)]">
            {product?.description ??
              "Size, stitching, and color variations are configurable per variant."}
          </p>
          <div className="space-y-3 text-sm">
            <p>Price: BDT {primary?.price?.toLocaleString?.() ?? "N/A"}</p>
            <p>Stock: {totalStock} available</p>
            <p>Stitching: Stitched or Unstitched</p>
          </div>
          <button className="w-full rounded-full bg-[var(--accent)] px-6 py-3 text-sm text-white">
            Add to Cart
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
