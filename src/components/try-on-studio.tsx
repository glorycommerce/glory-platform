"use client";

import { useMemo, useState } from "react";
import type { CatalogProduct } from "@/lib/types";

type TryOnStudioProps = {
  products: CatalogProduct[];
};

type TryOnResponse = {
  status: string;
  message?: string;
  resultImageUrl?: string;
  inputImageUrl?: string;
  product?: { slug: string; name: string };
  variant?: {
    id: string;
    sku: string;
    color: string | null;
    size: string | null;
    stitching: string;
  };
};

const MAX_FILE_SIZE = 8 * 1024 * 1024;

export function TryOnStudio({ products }: TryOnStudioProps) {
  const [selectedProductSlug, setSelectedProductSlug] = useState(products[0]?.slug ?? "");
  const [selectedVariantId, setSelectedVariantId] = useState(products[0]?.variants[0]?.id ?? "");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [localPreviewUrl, setLocalPreviewUrl] = useState("");
  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [error, setError] = useState("");
  const [generating, setGenerating] = useState(false);

  const selectedProduct = useMemo(
    () => products.find((product) => product.slug === selectedProductSlug) ?? null,
    [products, selectedProductSlug]
  );

  const selectedVariant =
    selectedProduct?.variants.find((variant) => variant.id === selectedVariantId) ?? null;

  function clearGeneratedState() {
    setError("");
    setResult(null);
  }

  function setPreviewFromFile(file: File | null) {
    if (localPreviewUrl) {
      URL.revokeObjectURL(localPreviewUrl);
    }

    if (!file) {
      setSelectedFile(null);
      setLocalPreviewUrl("");
      return;
    }

    setSelectedFile(file);
    setLocalPreviewUrl(URL.createObjectURL(file));
  }

  function handleFileChange(file: File | undefined) {
    clearGeneratedState();

    if (!file) {
      setPreviewFromFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setError("Please upload an image smaller than 8MB.");
      return;
    }

    setPreviewFromFile(file);
  }

  function handleProductChange(productSlug: string) {
    const nextProduct = products.find((product) => product.slug === productSlug) ?? null;
    setSelectedProductSlug(productSlug);
    setSelectedVariantId(nextProduct?.variants[0]?.id ?? "");
    clearGeneratedState();
  }

  async function handleGenerate() {
    clearGeneratedState();

    if (!selectedFile) {
      setError("Upload a photo first.");
      return;
    }

    if (!selectedProduct || !selectedVariant) {
      setError("Select a product and variant first.");
      return;
    }

    setGenerating(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("productSlug", selectedProduct.slug);
    formData.append("variantId", selectedVariant.id);

    const tryOnResponse = await fetch("/api/ai/tryon", {
      method: "POST",
      body: formData,
    });
    const tryOnPayload = (await tryOnResponse.json().catch(() => null)) as
      | (TryOnResponse & { message?: string })
      | null;

    setGenerating(false);

    if (!tryOnResponse.ok) {
      setError(tryOnPayload?.message ?? "Unable to generate the try-on preview.");
      return;
    }

    setResult(tryOnPayload);
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm md:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <p className="text-xs uppercase tracking-[0.32em] text-[var(--muted)]">AI Try-On</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">
            Preview outfits before checkout.
          </h1>
          <p className="max-w-xl text-base leading-7 text-[var(--muted)] md:text-lg">
            Upload a clear full-body or upper-body photo, choose a product variant, and generate
            a styled try-on preview. Images are sent directly for processing in this flow and are
            not persisted by the app after generation.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="pill-soft">Single product preview</div>
            <div className="pill-soft">Catalog-grounded variant selection</div>
            <div className="pill-soft">Direct processing flow</div>
          </div>
        </div>
        <div className="rounded-[1.75rem] bg-[var(--surface-soft)] p-6">
          <p className="text-sm font-semibold">Best results</p>
          <div className="mt-4 grid gap-3 text-sm text-[var(--muted)]">
            <div className="rounded-2xl bg-white/80 p-4">
              Use a well-lit photo with a visible outfit silhouette.
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              Pick a variant with a clear product image.
            </div>
            <div className="rounded-2xl bg-white/80 p-4">
              Avoid heavy occlusion or multiple people in the frame.
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm">
          <div className="space-y-4">
            <label className="block space-y-2">
              <span className="text-sm font-medium">Upload your photo</span>
              <input
                type="file"
                accept="image/*"
                className="block w-full rounded-2xl border border-dashed border-black/15 bg-[var(--surface-soft)] px-4 py-5 text-sm"
                onChange={(event) => handleFileChange(event.target.files?.[0])}
              />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Choose a product</span>
              <select
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                value={selectedProductSlug}
                onChange={(event) => handleProductChange(event.target.value)}
              >
                {products.map((product) => (
                  <option key={product.id} value={product.slug}>
                    {product.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium">Choose a variant</span>
              <select
                className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none"
                value={selectedVariantId}
                onChange={(event) => {
                  setSelectedVariantId(event.target.value);
                  clearGeneratedState();
                }}
              >
                {selectedProduct?.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {[variant.color, variant.size, variant.stitching].filter(Boolean).join(" • ") ||
                      variant.sku}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="rounded-2xl bg-[var(--surface-soft)] p-5">
            <p className="text-sm font-semibold">Selected garment</p>
            {selectedVariant?.images[0] ? (
              <div className="mt-4 space-y-3">
                <div className="flex h-56 items-center justify-center overflow-hidden rounded-2xl bg-white/70 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedVariant.images[0]}
                    alt={selectedProduct?.name ?? "Selected garment"}
                    className="h-full w-full object-contain"
                  />
                </div>
                <p className="text-sm text-[var(--muted)]">
                  {selectedProduct?.name} •{" "}
                  {[selectedVariant.color, selectedVariant.size, selectedVariant.stitching]
                    .filter(Boolean)
                    .join(" • ")}
                </p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-[var(--muted)]">
                This variant does not have a usable product image yet.
              </p>
            )}
          </div>

          {error ? (
            <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
          ) : null}

          <button
            className="btn-primary w-full"
            type="button"
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? "Generating Try-On..." : "Generate Try-On"}
          </button>
        </div>

        <div className="space-y-6 rounded-[2rem] bg-[var(--surface)] p-8 shadow-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Input</p>
              <div className="mt-3 overflow-hidden rounded-[1.5rem] bg-[var(--surface-soft)]">
                {localPreviewUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={localPreviewUrl}
                    alt="Uploaded preview"
                    className="h-[20rem] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[20rem] items-center justify-center px-6 text-center text-sm text-[var(--muted)]">
                    Your uploaded image preview will appear here.
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.28em] text-[var(--muted)]">Result</p>
              <div className="mt-3 overflow-hidden rounded-[1.5rem] bg-[var(--surface-soft)]">
                {result?.resultImageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={result.resultImageUrl}
                    alt="Generated try-on result"
                    className="h-[20rem] w-full object-cover"
                  />
                ) : (
                  <div className="flex h-[20rem] items-center justify-center px-6 text-center text-sm text-[var(--muted)]">
                    Your generated try-on preview will appear here after processing.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
            <p className="text-sm font-semibold">Generation Status</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              {result?.message
                ? result.message
                : generating
                  ? "Processing your image and selected garment..."
                  : "Choose a product and upload a photo to begin."}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
