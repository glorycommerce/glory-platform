import Link from "next/link";

type ProductCardProps = {
  title: string;
  price: string;
  subtitle: string;
  slug: string;
  tags?: string[];
};

export function ProductCard({ title, price, subtitle, slug, tags }: ProductCardProps) {
  return (
    <Link
      href={`/product/${slug}`}
      className="group flex h-full flex-col gap-4 rounded-2xl border border-black/5 bg-[var(--surface)] p-5 shadow-sm transition hover:-translate-y-1"
    >
      <div className="aspect-[4/5] w-full rounded-xl bg-[var(--surface-soft)]" />
      <div className="space-y-2">
        <p className="text-sm text-[var(--muted)]">{subtitle}</p>
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold">{price}</span>
          <span className="text-[var(--accent)]">View</span>
        </div>
        {tags && (
          <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
            {tags.map((tag) => (
              <span key={tag} className="rounded-full bg-black/5 px-2 py-1">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
