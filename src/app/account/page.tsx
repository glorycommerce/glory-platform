import { SiteShell } from "@/components/site-shell";

export default function AccountPage() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-[var(--surface)] p-8">
        <h1 className="text-3xl font-semibold">Account</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Sign up, login, order history, and loyalty points live here.
        </p>
      </div>
    </SiteShell>
  );
}
