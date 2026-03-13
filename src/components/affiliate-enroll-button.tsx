"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function AffiliateEnrollButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function handleEnroll() {
    setPending(true);
    setError("");

    const response = await fetch("/api/affiliate/enroll", {
      method: "POST",
    });
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;

    setPending(false);

    if (!response.ok) {
      setError(payload?.error ?? "Unable to activate your affiliate account.");
      return;
    }

    router.refresh();
  }

  return (
    <div className="space-y-3">
      <button type="button" className="btn-primary" onClick={handleEnroll} disabled={pending}>
        {pending ? "Activating..." : "Become an Affiliate"}
      </button>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}
