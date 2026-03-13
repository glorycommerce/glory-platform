import { SiteShell } from "@/components/site-shell";

export default function AiTryOnPage() {
  return (
    <SiteShell>
      <div className="rounded-3xl bg-[var(--surface)] p-8">
        <h1 className="text-3xl font-semibold">AI Try-On Studio</h1>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Upload a photo to preview outfits. Images are processed transiently
          and never stored.
        </p>
        <div className="mt-6 rounded-2xl border border-dashed border-black/10 p-6 text-sm text-[var(--muted)]">
          Upload component placeholder.
        </div>
      </div>
    </SiteShell>
  );
}
