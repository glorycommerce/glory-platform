import { SiteShell } from "@/components/site-shell";

export default function CheckoutPage() {
  return (
    <SiteShell>
      <div className="grid gap-6 md:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-[var(--surface)] p-8">
          <h1 className="text-3xl font-semibold">Checkout</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            SSLCommerz, COD, Advance, and EMI flows will be configured here.
          </p>
        </div>
        <div className="rounded-3xl bg-[var(--surface-soft)] p-6">
          <p className="text-sm font-semibold">Order Summary</p>
          <p className="mt-2 text-sm text-[var(--muted)]">Total: BDT 4,520</p>
        </div>
      </div>
    </SiteShell>
  );
}
