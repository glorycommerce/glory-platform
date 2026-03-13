import Image from "next/image";
import Link from "next/link";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className='min-h-screen bg-[var(--background)] text-[var(--foreground)]'>
      <header className='sticky top-0 z-20 border-b border-black/5 bg-[var(--background)]/92 backdrop-blur'>
        <div className='mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-6 py-4'>
          <Link href='/' className='shrink-0'>
            <Image
              src='/glory_transparent.svg'
              alt='Glory'
              width={180}
              height={68}
              className='h-11 w-auto object-contain md:h-12'
              priority
            />
          </Link>
          <nav className='hidden items-center gap-6 text-sm font-medium text-[var(--muted)] md:flex'>
            <Link
              className='transition hover:text-[var(--foreground)]'
              href='/'
            >
              Home
            </Link>
            <Link
              className='transition hover:text-[var(--foreground)]'
              href='/category/womens-dresses'
            >
              Dresses
            </Link>
            <Link
              className='transition hover:text-[var(--foreground)]'
              href='/category/hijabs'
            >
              Hijabs
            </Link>
            <Link
              className='transition hover:text-[var(--foreground)]'
              href='/category/accessories'
            >
              Accessories
            </Link>
          </nav>
          <div className='flex items-center gap-3'>
            <Link className='btn-secondary px-5 py-2.5' href='/account'>
              Account
            </Link>
            <Link
              className='btn-primary px-5 py-2.5 !text-white'
              href='/category/womens-dresses'
            >
              Collection
            </Link>
          </div>
        </div>
      </header>
      <main className='mx-auto w-full max-w-6xl px-6 py-10'>{children}</main>
      <footer className='border-t border-black/5 bg-[var(--surface)]'>
        <div className='mx-auto grid w-full max-w-6xl gap-8 px-6 py-10 text-sm md:grid-cols-[1.15fr_0.8fr_0.8fr_1fr]'>
          <div>
            <Link href='/' className='inline-flex'>
              <Image
                src='/glory_transparent.svg'
                alt='Glory'
                width={210}
                height={78}
                className='h-14 w-auto object-contain'
              />
            </Link>
            <p className='mt-4 max-w-sm text-[var(--muted)]'>
              A multi-merchant fashion commerce platform built for Bangladesh
              and beyond.
            </p>
            <div className='mt-4 flex flex-wrap gap-3 text-xs text-[var(--muted)]'>
              <span className='rounded-full bg-black/5 px-3 py-1'>COD</span>
              <span className='rounded-full bg-black/5 px-3 py-1'>
                SSLCommerz
              </span>
              <span className='rounded-full bg-black/5 px-3 py-1'>
                AI Styling
              </span>
            </div>
          </div>
          <div className='space-y-3 text-[var(--muted)]'>
            <p className='text-sm font-semibold text-[var(--foreground)]'>
              Company
            </p>
            <Link href='/affiliate' className='block'>
              Affiliate Program
            </Link>
            <Link href='/merchant' className='block'>
              Merchant Program
            </Link>
            <Link href='/account' className='block'>
              Account
            </Link>
          </div>
          <div className='space-y-3 text-[var(--muted)]'>
            <p className='text-sm font-semibold text-[var(--foreground)]'>
              Platform
            </p>
            <Link href='/category/womens-dresses' className='block'>
              New Arrivals
            </Link>
            <Link href='/ai/try-on' className='block'>
              AI Try-On
            </Link>
            <Link href='/category/womens-dresses' className='block'>
              Collections
            </Link>
          </div>
          <Link
            href='/affiliate'
            className='group rounded-3xl border border-[var(--accent)]/18 bg-[linear-gradient(135deg,rgba(184,134,11,0.12)_0%,rgba(255,253,248,0.96)_100%)] p-5 shadow-[0_10px_24px_rgba(140,101,19,0.08)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(140,101,19,0.12)]'
          >
            <p className='text-[10px] uppercase tracking-[0.24em] text-[var(--muted)]'>
              Partner Program
            </p>
            <p className='mt-2 text-base font-semibold text-[var(--foreground)]'>
              Earn by selling our products
            </p>
            <p className='mt-2 text-sm text-[var(--accent-strong)] transition group-hover:text-[var(--accent)]'>
              Affiliate Program
            </p>
          </Link>
        </div>
      </footer>
    </div>
  );
}
