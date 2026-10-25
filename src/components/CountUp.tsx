"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  value: number;
  /** Milliseconds from 0 to `value`. */
  duration?: number;
  className?: string;
}

/** A number that counts up from zero with an ease-out, or jumps straight there under reduced motion. */
export function CountUp({ value, duration = 900, className }: CountUpProps) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(value);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setShown(Math.round(value * (1 - Math.pow(1 - t, 3))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return <span className={className}>{shown.toLocaleString("en-US")}</span>;
}
