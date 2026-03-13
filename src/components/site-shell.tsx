import Image from "next/image";
import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[var(--background)]/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="Glory"
              width={44}
              height={44}
              className="h-11 w-11 rounded-full object-cover"
              priority
            />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                Glory
              </p>
              <p className="text-lg font-semibold">Commerce Studio</p>
            </div>
          </Link>
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
        <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-[1.3fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt="Glory"
                width={52}
                height={52}
                className="h-[52px] w-[52px] rounded-full object-cover"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">
                  Glory
                </p>
                <p className="text-lg font-semibold">Commerce Studio</p>
              </div>
            </Link>
            <p className="mt-4 max-w-sm text-[var(--muted)]">
              A multi-merchant fashion commerce platform built for Bangladesh and
              beyond.
            </p>
            <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]">
              <span className="rounded-full bg-black/5 px-3 py-1">COD</span>
              <span className="rounded-full bg-black/5 px-3 py-1">SSLCommerz</span>
              <span className="rounded-full bg-black/5 px-3 py-1">AI Styling</span>
            </div>
          </div>
          <div className="space-y-3 text-[var(--muted)]">
            <p className="text-sm font-semibold text-[var(--foreground)]">Company</p>
            <Link href="/affiliate" className="block">
              Affiliate Program
            </Link>
            <Link href="/merchant" className="block">
              Merchant Program
            </Link>
            <Link href="/account" className="block">
              Account
            </Link>
          </div>
          <div className="space-y-3 text-[var(--muted)]">
            <p className="text-sm font-semibold text-[var(--foreground)]">Platform</p>
            <Link href="/category/womens-dresses" className="block">
              New Arrivals
            </Link>
            <Link href="/ai/try-on" className="block">
              AI Try-On
            </Link>
            <Link href="/cart" className="block">
              Cart & Checkout
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
