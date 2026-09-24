"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-10-15T08:00:00+07:00").getTime();

function getRemaining() {
  const diff = Math.max(0, EVENT_DATE - Date.now());
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  // Starts null so server and first client render match exactly (avoids a
  // hydration mismatch from the live clock); the real countdown fills in
  // right after mount.
  const [remaining, setRemaining] = useState<ReturnType<typeof getRemaining> | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setRemaining(getRemaining()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const units: Array<[string, number]> = [
    ["Ngày", remaining?.days ?? 0],
    ["Giờ", remaining?.hours ?? 0],
    ["Phút", remaining?.minutes ?? 0],
    ["Giây", remaining?.seconds ?? 0],
  ];

  return (
    <div className="countdown-row">
      {units.map(([label, value]) => (
        <div className="countdown-unit" key={label}>
          <span className="countdown-value">{String(value).padStart(2, "0")}</span>
          <span className="countdown-label">{label}</span>
        </div>
      ))}
    </div>
  );
}
