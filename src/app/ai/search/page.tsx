import { SiteShell } from "@/components/site-shell";

export default function AiSearchPage() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-[var(--surface)] p-8">
        <h1 className="text-3xl font-semibold">AI Visual Search</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upload an image or describe what you need. We match inventory using
          vector search and suggest close alternatives.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-6 text-sm text-[var(--muted)]">
          Image search component placeholder.
        </div>
      </div>
    </SiteShell>
  );
}
