import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[var(--accent)]/10" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Glory
              </p>
              <p className="text-lg font-semibold">Commerce Studio</p>
            </div>
          </div>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/category/womens-dresses">Dresses</Link>
            <Link href="/category/hijabs">Hijabs</Link>
            <Link href="/category/custom">Custom</Link>
            <Link href="/affiliate">Affiliate</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              className="rounded-full border border-black/10 px-4 py-2 text-sm"
              href="/account"
            >
              Account
            </Link>
            <Link
              className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm text-white"
              href="/cart"
            >
              Cart
            </Link>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl px-6 py-10">{children}</main>
      <footer className="border-t border-black/5 bg-[var(--surface)]">
        <div className="mx-auto grid w-full max-w-6xl gap-6 px-6 py-10 text-sm md:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">Glory</p>
            <p className="mt-2 text-[var(--muted)]">
              A multi-merchant fashion commerce platform built for Bangladesh and
              beyond.
            </p>
          </div>
          <div className="space-y-2 text-[var(--muted)]">
            <p>Terms & Policy</p>
            <p>Merchant Program</p>
            <p>Support</p>
          </div>
          <div className="space-y-2 text-[var(--muted)]">
            <p>SSLCommerz, COD, EMI</p>
            <p>Rewards & Leaderboard</p>
            <p>AI Sales Assistant</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
