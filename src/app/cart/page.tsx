import { SiteShell } from "@/components/site-shell";

export default function CartPage() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-[var(--surface)] p-8">
        <h1 className="text-3xl font-semibold">Your Cart</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Cart, coupons, and point redemption will be managed here.
        </p>
      </div>
    </SiteShell>
  );
}
