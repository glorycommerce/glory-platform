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
    <div className="rounded-2xl bg-[var(--accent)] px-5 py-4 text-white">
      <p className="text-xs uppercase tracking-[0.3em] text-white/70">
        Flash Sale Ends
      </p>
      <p className="mt-2 text-2xl font-semibold">
        {hours}:{minutes}:{seconds}
      </p>
    </div>
  );
}
