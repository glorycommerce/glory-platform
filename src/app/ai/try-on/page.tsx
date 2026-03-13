import { SiteShell } from "@/components/site-shell";
import { TryOnStudio } from "@/components/try-on-studio";
import { listCatalogProducts } from "@/lib/services/catalog";

export default async function AiTryOnPage() {
  const products = await listCatalogProducts({ merchantSlug: "glory", limit: 12 });

  return (
    <SiteShell>
      <TryOnStudio products={products} />
    </SiteShell>
  );
}
