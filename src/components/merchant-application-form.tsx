"use client";

import { useState } from "react";

const initialValues = {
  businessName: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  slug: "",
  nidUrl: "",
  tinUrl: "",
  tradeLicenseUrl: "",
  acceptedTerms: false,
  acceptedPolicy: false,
};

export function MerchantApplicationForm() {
  const [values, setValues] = useState(initialValues);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError("");
    setSuccess("");

    const response = await fetch("/api/merchant/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const payload = (await response.json().catch(() => null)) as
      | { message?: string; error?: string }
      | null;

    setPending(false);

    if (!response.ok) {
      setError(payload?.message ?? payload?.error ?? "Unable to submit application.");
      return;
    }

    setSuccess(payload?.message ?? "Application submitted.");
    setValues(initialValues);
  }

  function updateField<Key extends keyof typeof initialValues>(key: Key, value: (typeof initialValues)[Key]) {
    setValues((current) => ({ ...current, [key]: value }));
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p> : null}
      {success ? (
        <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium">Business Name</span>
          <input className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.businessName} onChange={(e) => updateField("businessName", e.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Contact Name</span>
          <input className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.contactName} onChange={(e) => updateField("contactName", e.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Contact Email</span>
          <input type="email" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.contactEmail} onChange={(e) => updateField("contactEmail", e.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Contact Phone</span>
          <input className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.contactPhone} onChange={(e) => updateField("contactPhone", e.target.value)} required />
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium">Desired Store Slug</span>
        <input className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.slug} onChange={(e) => updateField("slug", e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))} placeholder="your-brand-name" required />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="block space-y-2">
          <span className="text-sm font-medium">NID Document URL</span>
          <input type="url" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.nidUrl} onChange={(e) => updateField("nidUrl", e.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">TIN Document URL</span>
          <input type="url" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.tinUrl} onChange={(e) => updateField("tinUrl", e.target.value)} required />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">Trade License URL</span>
          <input type="url" className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 outline-none" value={values.tradeLicenseUrl} onChange={(e) => updateField("tradeLicenseUrl", e.target.value)} required />
        </label>
      </div>

      <label className="flex items-start gap-3 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm">
        <input type="checkbox" className="mt-1" checked={values.acceptedTerms} onChange={(e) => updateField("acceptedTerms", e.target.checked)} required />
        <span>I confirm that the submitted business information is accurate.</span>
      </label>
      <label className="flex items-start gap-3 rounded-2xl bg-[var(--surface-soft)] px-4 py-3 text-sm">
        <input type="checkbox" className="mt-1" checked={values.acceptedPolicy} onChange={(e) => updateField("acceptedPolicy", e.target.checked)} required />
        <span>I agree to the merchant onboarding policy and compliance review.</span>
      </label>

      <button className="btn-primary w-full" type="submit" disabled={pending}>
        {pending ? "Submitting..." : "Submit Merchant Application"}
      </button>
    </form>
  );
}
