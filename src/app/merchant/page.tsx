import { SiteShell } from "@/components/site-shell";

export default function MerchantPage() {
  return (
    <SiteShell>
      <div className="space-y-6">
        <div className="rounded-3xl bg-[var(--surface)] p-8">
          <h1 className="text-3xl font-semibold">Merchant Panel</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Manage inventory, staff accounts, discounts, and storefront banners.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            "Inventory & SKU",
            "Orders & payouts",
            "Coupons & offers",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-black/5 bg-[var(--surface)] p-5"
            >
              <p className="text-sm font-semibold">{item}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">
                Configure your store operations.
              </p>
            </div>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}
