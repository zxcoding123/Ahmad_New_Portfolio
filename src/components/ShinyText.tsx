"use client";

import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

interface ShinyTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  /** Seconds for one sweep of the shine. */
  speed?: number;
  /** Seconds to hold between sweeps. */
  delay?: number;
  color?: string;
  shineColor?: string;
  /** Gradient angle in degrees. */
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: "left" | "right";
  [key: string]: unknown;
}

export function ShinyText({
  children,
  as: Tag = "span",
  className = "",
  style,
  disabled = false,
  speed = 2,
  delay = 0,
  color = "#b5b5b5",
  shineColor = "#ffffff",
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = "left",
  ...rest
}: ShinyTextProps) {
  const ref = useRef<HTMLElement>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const dir = direction === "left" ? 1 : -1;
    const duration = speed * 1000;
    const hold = delay * 1000;

    // p=0 -> 150% (shine off right), p=100 -> -50% (shine off left)
    const apply = (p: number) => {
      const v = dir === 1 ? p : 100 - p;
      el.style.backgroundPosition = `${150 - v * 2}% center`;
    };

    apply(0);
    if (disabled) return;

    let elapsed = 0;
    let last: number | null = null;
    let raf = 0;

    let visible = false;
    const tick = (time: number) => {
      raf = 0;
      if (!visible || document.hidden || motionQuery.matches) {
        last = null;
        return;
      }
      raf = requestAnimationFrame(tick);
      if (pausedRef.current) {
        last = null;
        return;
      }
      if (last === null) {
        last = time;
        return;
      }
      elapsed += time - last;
      last = time;

      const cycle = duration + hold;
      if (yoyo) {
        const t = elapsed % (cycle * 2);
        if (t < duration) apply((t / duration) * 100);
        else if (t < cycle) apply(100);
        else if (t < cycle + duration) apply(100 - ((t - cycle) / duration) * 100);
        else apply(0);
      } else {
        const t = elapsed % cycle;
        apply(t < duration ? (t / duration) * 100 : 100);
      }
    };

    const syncAnimation = () => {
      if (visible && !document.hidden && !motionQuery.matches) {
        if (!raf) raf = requestAnimationFrame(tick);
      } else {
        cancelAnimationFrame(raf);
        raf = 0;
        last = null;
      }
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncAnimation();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", syncAnimation);
    motionQuery.addEventListener("change", syncAnimation);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      document.removeEventListener("visibilitychange", syncAnimation);
      motionQuery.removeEventListener("change", syncAnimation);
    };
  }, [disabled, speed, delay, yoyo, direction]);

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
        backgroundSize: "200% auto",
        WebkitBackgroundClip: "text",
        backgroundClip: "text",
        WebkitTextFillColor: "transparent",
        ...style,
      }}
      onMouseEnter={pauseOnHover ? () => (pausedRef.current = true) : undefined}
      onMouseLeave={pauseOnHover ? () => (pausedRef.current = false) : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}
