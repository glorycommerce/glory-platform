import { AccountAuthPanel } from "@/components/account-auth-panel";
import { AccountSignOutButton } from "@/components/account-sign-out-button";
import { SiteShell } from "@/components/site-shell";
import { getAccountDashboard } from "@/lib/account";
import { getAuthSession } from "@/lib/auth";

type AccountPageProps = {
  searchParams: Promise<{
    mode?: string;
    token?: string;
    error?: string;
  }>;
};

function getInitialMode(mode?: string, token?: string) {
  if (token) {
    return "reset" as const;
  }

  if (mode === "signup" || mode === "forgot") {
    return mode;
  }

  return "signin" as const;
}

function mapAuthError(error?: string) {
  if (error === "CredentialsSignin") {
    return "The email or password is incorrect.";
  }

  return "";
}

export default async function AccountPage({ searchParams }: AccountPageProps) {
  const [session, params] = await Promise.all([getAuthSession(), searchParams]);

  if (!session?.user?.id) {
    return (
      <SiteShell>
        <AccountAuthPanel
          initialMode={getInitialMode(params.mode, params.token)}
          initialError={mapAuthError(params.error)}
          resetToken={params.token}
        />
      </SiteShell>
    );
  }

  const dashboard = await getAccountDashboard(session.user.id);
  const customerName = dashboard.user?.name || session.user.name || "Customer";

  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Account Overview
            </p>
            <h1 className="text-4xl font-semibold">Welcome back, {customerName}.</h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)]">
              Review recent orders, track loyalty points, and keep your account details ready
              for a faster checkout.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="pill-soft">{dashboard.points} points available</div>
              <div className="pill-soft">{dashboard.orders.length} recent orders</div>
              <div className="pill-soft">{session.user.role.toLowerCase()} profile</div>
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-[1.75rem] bg-[var(--surface-soft)] p-6">
            <p className="text-sm font-semibold">Profile Summary</p>
            <div className="rounded-2xl bg-white/80 p-4 text-sm">
              <p className="font-medium">{customerName}</p>
              <p className="mt-1 text-[var(--muted)]">{dashboard.user?.email ?? session.user.email}</p>
            </div>
            <div className="rounded-2xl bg-white/80 p-4 text-sm text-[var(--muted)]">
              Member since {dashboard.user?.createdAt.toLocaleDateString() ?? "Recently"}
            </div>
            <AccountSignOutButton />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[1.75rem] bg-[var(--surface)] p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                  Recent Orders
                </p>
                <h2 className="mt-2 text-2xl font-semibold">Latest activity</h2>
              </div>
              <div className="pill-soft">Orders</div>
            </div>

            <div className="mt-6 space-y-4">
              {dashboard.orders.length === 0 ? (
                <div className="rounded-2xl bg-[var(--surface-soft)] p-5 text-sm text-[var(--muted)]">
                  No orders yet. Your first purchase will appear here.
                </div>
              ) : (
                dashboard.orders.map((order) => (
                  <div key={order.id} className="rounded-2xl border border-black/5 bg-white p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold">Order {order.id.slice(-8).toUpperCase()}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                          {order.status} • {order.paymentStatus}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">BDT {order.total.toLocaleString()}</p>
                    </div>
                    <p className="mt-3 text-sm text-[var(--muted)]">
                      {order.items.map((item) => item.variant.product.name).join(", ")}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="grid gap-6">
            <div className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Loyalty
              </p>
              <p className="mt-3 text-3xl font-semibold">{dashboard.points}</p>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Reward points available for future offers and campaign perks.
              </p>
            </div>
            <div className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">
                Saved Details
              </p>
              <div className="mt-4 grid gap-3">
                <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
                  Addresses will appear here once checkout is connected.
                </div>
                <div className="rounded-2xl bg-[var(--surface-soft)] p-4 text-sm text-[var(--muted)]">
                  Saved payment methods can be added in a later release.
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
