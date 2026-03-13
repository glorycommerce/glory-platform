"use client";

import { useState } from "react";

export function AffiliateCopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <button type="button" className="btn-secondary" onClick={handleCopy}>
      {copied ? "Copied" : "Copy Link"}
    </button>
  );
}
