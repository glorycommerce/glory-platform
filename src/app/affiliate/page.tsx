import Link from "next/link";
import { AffiliateCopyButton } from "@/components/affiliate-copy-button";
import { AffiliateEnrollButton } from "@/components/affiliate-enroll-button";
import { SiteShell } from "@/components/site-shell";
import { getAffiliateDashboard } from "@/lib/affiliate";
import { getAuthSession } from "@/lib/auth";
import { defaultSeo } from "@/lib/seo";

export default async function AffiliatePage() {
  const session = await getAuthSession();
  const dashboard = session?.user?.id ? await getAffiliateDashboard(session.user.id) : null;

  if (!session?.user?.id) {
    return (
      <SiteShell>
        <div className="space-y-8">
          <section className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
                Partner Program
              </p>
              <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
                Earn by selling our products.
              </h1>
              <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
                Join Glory as an affiliate partner, share curated collections, and earn
                commission from successful referred orders.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link className="btn-primary" href="/account?mode=signup">
                  Create Affiliate Account
                </Link>
                <Link className="btn-secondary" href="/account">
                  Sign In
                </Link>
              </div>
            </div>
            <div className="grid gap-4">
              {[
                ["5%", "Base commission on approved referred orders"],
                ["Weekly", "Performance checks and payout review windows"],
                ["Ready", "Shareable links for product and category campaigns"],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                  <p className="text-2xl font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-3">
            {[
              ["Apply", "Create or sign in to your customer account."],
              ["Share", "Use your unique affiliate code across campaigns and product links."],
              ["Earn", "Track referral conversions, commissions, and payout history."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-sm">
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </section>
        </div>
      </SiteShell>
    );
  }

  if (!dashboard) {
    return (
      <SiteShell>
        <div className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Affiliate Enrollment
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Activate your partner account.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              You are signed in. Activate your affiliate profile to receive a referral code,
              track commissions, and manage payouts from one dashboard.
            </p>
            <AffiliateEnrollButton />
          </div>
          <div className="rounded-[1.75rem] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold">What happens next</p>
            <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
              <div className="rounded-2xl bg-white/80 p-4">A unique affiliate code is generated.</div>
              <div className="rounded-2xl bg-white/80 p-4">Your dashboard will unlock referral metrics.</div>
              <div className="rounded-2xl bg-white/80 p-4">Payout history appears as commission data grows.</div>
            </div>
          </div>
        </div>
      </SiteShell>
    );
  }

  const referralLink = `${defaultSeo.url}/?ref=${dashboard.profile.code}`;

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Affiliate Dashboard
            </p>
            <h1 className="text-4xl font-semibold leading-tight">
              Earn by selling our products.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              Manage your referral code, review conversions, and monitor commission payouts from
              one place.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="pill-soft">Code: {dashboard.profile.code}</div>
              <div className="pill-soft">
                {dashboard.profile.commissionPercent}% commission
              </div>
            </div>
          </div>
          <div className="rounded-[1.75rem] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold">Referral Link</p>
            <p className="mt-3 rounded-2xl bg-white/80 px-4 py-3 text-sm text-[var(--muted)]">
              {referralLink}
            </p>
            <div className="mt-4">
              <AffiliateCopyButton value={referralLink} />
            </div>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-4">
          {[
            ["Referrals", dashboard.stats.totalReferrals.toString()],
            ["Commission Earned", `BDT ${dashboard.stats.totalCommission.toLocaleString()}`],
            ["Paid Out", `BDT ${dashboard.stats.totalPaid.toLocaleString()}`],
            ["Outstanding", `BDT ${dashboard.stats.outstanding.toLocaleString()}`],
          ].map(([label, value]) => (
            <div key={label} className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{label}</p>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        <section className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
          <div className="rounded-[1.75rem] bg-[var(--surface)] p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Recent Referrals
            </p>
            <div className="mt-6 space-y-4">
              {dashboard.profile.referrals.length === 0 ? (
                <div className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                  No referrals recorded yet. Share your code to start tracking conversions.
                </div>
              ) : (
                dashboard.profile.referrals.map((referral) => (
                  <div key={referral.id} className="rounded-2xl border border-black/5 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          Order {referral.order.id.slice(-8).toUpperCase()}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          {referral.order.status} • {referral.createdAt.toLocaleDateString()}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        BDT {referral.commission.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="rounded-[1.75rem] bg-[var(--surface)] p-8 shadow-sm">
            <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
              Payout History
            </p>
            <div className="mt-6 space-y-4">
              {dashboard.profile.payouts.length === 0 ? (
                <div className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                  No payouts yet. Eligible affiliate earnings will appear here after review.
                </div>
              ) : (
                dashboard.profile.payouts.map((payout) => (
                  <div key={payout.id} className="rounded-2xl border border-black/5 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">
                          BDT {payout.amount.toLocaleString()}
                        </p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          {payout.paidAt ? "Paid" : "Pending"} •{" "}
                          {(payout.paidAt ?? payout.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
