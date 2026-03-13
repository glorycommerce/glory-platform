import { SiteShell } from "@/components/site-shell";

export default function AffiliatePage() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-[var(--surface)] p-8">
        <h1 className="text-3xl font-semibold">Affiliate Program</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Track referral links, commissions, and payout schedules.
        </p>
      </div>
    </SiteShell>
  );
}
