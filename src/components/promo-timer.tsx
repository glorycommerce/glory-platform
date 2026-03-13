"use client";

import { useEffect, useState } from "react";

export function PromoTimer() {
  const [remaining, setRemaining] = useState(6 * 60 * 60);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const hours = String(Math.floor(remaining / 3600)).padStart(2, "0");
  const minutes = String(Math.floor((remaining % 3600) / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");

  return (
    <div className="rounded-[1.5rem] bg-[linear-gradient(135deg,var(--accent)_0%,var(--accent-strong)_100%)] px-5 py-4 text-white shadow-[0_18px_36px_rgba(140,101,19,0.18)]">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
        Flash Sale Ends
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
}
