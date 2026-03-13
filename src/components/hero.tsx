import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className='relative overflow-hidden rounded-[2rem] bg-[var(--surface)] shadow-sm'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(184,134,11,0.16),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(106,81,64,0.14),transparent_30%)]' />
      <div className='relative grid gap-8 p-6 md:grid-cols-[1.1fr_0.9fr] md:p-10'>
        <div className='space-y-6 py-2 md:py-6'>
          <div className='inline-flex rounded-full border border-black/10 bg-white/70 px-4 py-2 text-xs uppercase tracking-[0.3em] text-[var(--muted)]'>
            Eid Collection 2026
          </div>
          <div className='space-y-4'>
            <h1 className='max-w-xl text-4xl font-semibold leading-tight md:text-6xl'>
              Modest fashion, redefined.
            </h1>
            <p className='max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg'>
              Signature styles, AI-guided shopping, and seamless campaigns.
            </p>
          </div>
          <div className='flex flex-wrap gap-3'>
            <Link className='btn-primary' href='/category/womens-dresses'>
              Shop Collection
            </Link>
            <Link className='btn-secondary' href='/ai/try-on'>
              Try AI Styling
            </Link>
          </div>
          <div className='grid gap-3 pt-2 text-sm md:grid-cols-3'>
            <div className='rounded-2xl border border-black/5 bg-white/70 p-4'>
              <p className='text-2xl font-semibold'>120+</p>
              <p className='mt-1 text-[var(--muted)]'>
                fresh arrivals curated weekly
              </p>
            </div>
            <div className='rounded-2xl border border-black/5 bg-white/70 p-4'>
              <p className='text-2xl font-semibold'>24h</p>
              <p className='mt-1 text-[var(--muted)]'>
                dispatch support in Dhaka
              </p>
            </div>
            <div className='rounded-2xl border border-black/5 bg-white/70 p-4'>
              <p className='text-2xl font-semibold'>AI</p>
              <p className='mt-1 text-[var(--muted)]'>
                style search and try-on flow
              </p>
            </div>
          </div>
        </div>
        <div className='grid gap-4'>
          <div className='relative min-h-[340px] overflow-hidden rounded-[1.75rem] bg-[linear-gradient(180deg,#f8efe0_0%,#dfcda7_100%)]'>
            <Image
              src='/hero-glory-editorial.svg'
              alt='Featured collection'
              fill
              priority
              sizes='(min-width: 768px) 45vw, 100vw'
              className='object-contain object-center p-4'
            />
            <div className='absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent' />
            <div className='absolute inset-x-0 bottom-0 p-6 text-white'>
              <p className='text-xs uppercase tracking-[0.3em] text-white/70'>
                Signature Drop
              </p>
              <p className='mt-2 text-2xl font-semibold'>
                Soft tailoring, fluid silhouettes
              </p>
              <p className='mt-2 max-w-sm text-sm text-white/85'>
                Designed for festive dressing, everyday ease, and merchant-led
                seasonal campaigns.
              </p>
            </div>
          </div>
          <div className='grid gap-4 md:grid-cols-[1fr_1fr]'>
            <div className='rounded-2xl border border-black/5 bg-white/70 p-5'>
              <p className='text-xs uppercase tracking-[0.2em] text-[var(--muted)]'>
                Merchant Spotlight
              </p>
              <p className='mt-2 text-lg font-semibold'>
                Launch a branded storefront in minutes.
              </p>
              <p className='mt-2 text-sm text-[var(--muted)]'>
                Inventory sync, discounts, AI search, and local payment support
                are already wired in.
              </p>
            </div>
            <div className='rounded-2xl bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-5 py-5 text-white'>
              <p className='text-xs uppercase tracking-[0.2em] text-white/70'>
                Limited Offer
              </p>
              <p className='mt-2 text-lg font-semibold'>
                Up to 20% off selected edits
              </p>
              <p className='mt-2 text-sm text-white/80'>
                Combine launch pricing with COD and flash campaigns for faster
                checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
