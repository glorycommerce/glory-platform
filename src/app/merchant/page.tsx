import Link from "next/link";
import { MerchantApplicationForm } from "@/components/merchant-application-form";
import { SiteShell } from "@/components/site-shell";

export default function MerchantPage() {
  return (
    <SiteShell>
      <div className="space-y-8">
        <section className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-5">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Merchant Program
            </p>
            <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
              Launch your storefront on Glory.
            </h1>
            <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
              Apply to join the platform, operate your own branded catalog, and manage inventory,
              pricing, and store operations from one commerce workspace.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link className="btn-primary" href="#merchant-application">
                Start Application
              </Link>
              <Link className="btn-secondary" href="/account">
                Sign In
              </Link>
            </div>
          </div>
          <div className="grid gap-4">
            {[
              ["Inventory", "Sync products, variants, stock, and campaign availability."],
              ["Orders", "Track payouts, coupon impact, and order operations in one panel."],
              ["Branding", "Run your own storefront theme, promos, and collection storytelling."],
            ].map(([title, body]) => (
              <div key={title} className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                <p className="text-lg font-semibold">{title}</p>
                <p className="mt-2 text-sm text-[var(--muted)]">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {[
            ["Step 1", "Submit business details and compliance documents."],
            ["Step 2", "Our team reviews your application and storefront slug."],
            ["Step 3", "Approved merchants go live with products and operations tools."],
          ].map(([title, body]) => (
            <div key={title} className="rounded-[1.75rem] bg-[var(--surface)] p-6 shadow-sm">
              <p className="text-lg font-semibold">{title}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{body}</p>
            </div>
          ))}
        </section>

        <section
          id="merchant-application"
          className="rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm"
        >
          <div className="max-w-3xl space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">
              Application Form
            </p>
            <h2 className="text-3xl font-semibold">Apply to become a merchant partner</h2>
            <p className="text-sm leading-6 text-[var(--muted)]">
              Submit your business details, desired storefront slug, and required document links.
              Applications are reviewed before activation.
            </p>
          </div>
          <div className="mt-8">
            <MerchantApplicationForm />
          </div>
        </section>
      </div>
    </SiteShell>
  );
}
