"use client";

import { useEffect, useState } from "react";

/**
 * The visitor's current time, ticking every 15s. Null until mounted: the
 * server's clock is not the visitor's, so nothing time-based is prerendered.
 */
export function useNow(): Date | null {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  return now;
}

export const formatTime = (d: Date) => d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });

export const formatDate = (d: Date) =>
  d.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" });

export function Clock({ className = "" }: { className?: string }) {
  const now = useNow();

  if (!now) return <span className="w-16" />;
  return (
    <time dateTime={now.toISOString()} title={formatDate(now)} className={`tabular-nums whitespace-nowrap ${className}`}>
      {formatTime(now)}
    </time>
  );
}
