import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { SiteShell } from "@/components/site-shell";
import { getCategoryContent } from "@/lib/category-content";
import { defaultSeo } from "@/lib/seo";
import { listCatalogProducts } from "@/lib/services/catalog";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

const PAGE_SIZE = 6;

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryContent(slug);

  return {
    title: category.label,
    alternates: {
      canonical: `${defaultSeo.url}/category/${slug}`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;
  const category = getCategoryContent(slug);
  const products = await listCatalogProducts({
    merchantSlug: "glory",
    categorySlug: slug,
    limit: 100,
  });

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const requestedPage = Number(resolvedSearchParams.page ?? "1");
  const currentPage =
    Number.isFinite(requestedPage) && requestedPage > 0
      ? Math.min(requestedPage, totalPages)
      : 1;
  const start = (currentPage - 1) * PAGE_SIZE;
  const paginatedProducts = products.slice(start, start + PAGE_SIZE);

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-[var(--surface)] shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,134,11,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(106,81,64,0.12),transparent_28%)]" />
          <div className="relative grid gap-8 p-6 md:grid-cols-[1.05fr_0.95fr] md:p-10">
            <div className="space-y-6 py-2">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                {category.eyebrow}
              </p>
              <div className="space-y-4">
                <h1 className="max-w-xl text-4xl font-semibold leading-tight md:text-5xl">
                  {category.label}
                </h1>
                <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
                  {category.description}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                {category.highlights.map((highlight) => (
                  <div key={highlight} className="pill-soft">
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#f7ecd9_0%,#d6bf97_100%)]">
              <Image
                src={category.image}
                alt={category.label}
                fill
                priority
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-contain object-center p-4"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-xs uppercase tracking-[0.28em] text-white/78">
                  Category Focus
                </p>
                <p className="mt-2 max-w-sm text-2xl font-semibold">
                  Curated imagery and product edits tuned for this collection.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
                Collection
              </p>
              <h2 className="text-2xl font-semibold">
                Page {currentPage} of {totalPages}
              </h2>
            </div>
            <p className="text-sm text-[var(--muted)]">
              {products.length} products available
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {paginatedProducts.map((item) => (
              <ProductCard
                key={item.id}
                title={item.name}
                subtitle={`${item.variants[0]?.stitching ?? "UNSTITCHED"} | ${
                  item.variants[0]?.color ?? "Standard"
                }`}
                price={`BDT ${item.variants[0]?.price?.toLocaleString?.() ?? 0}`}
                slug={item.slug}
                image={item.variants[0]?.images[0] ?? ""}
                tags={[item.variants[0]?.size ?? "Multi-size"]}
              />
            ))}
          </div>

          {totalPages > 1 ? (
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href={`/category/${slug}?page=${Math.max(currentPage - 1, 1)}`}
                className={`btn-secondary ${currentPage === 1 ? "pointer-events-none opacity-50" : ""}`}
              >
                Previous
              </Link>
              {Array.from({ length: totalPages }, (_, index) => {
                const page = index + 1;
                const active = page === currentPage;

                return (
                  <Link
                    key={page}
                    href={`/category/${slug}?page=${page}`}
                    className={active ? "btn-primary min-w-11" : "btn-secondary min-w-11"}
                  >
                    {page}
                  </Link>
                );
              })}
              <Link
                href={`/category/${slug}?page=${Math.min(currentPage + 1, totalPages)}`}
                className={`btn-secondary ${currentPage === totalPages ? "pointer-events-none opacity-50" : ""}`}
              >
                Next
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    </SiteShell>
  );
}
