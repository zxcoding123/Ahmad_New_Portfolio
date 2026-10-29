"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Which edge(s) a resize handle drags; "move" is the title bar. */
type Gesture = "move" | "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const MIN_W = 360;
const MIN_H = 260;
/** How much of the window must stay on screen so it can always be grabbed back. */
const KEEP_VISIBLE = 120;

const HANDLES: { gesture: Gesture; className: string }[] = [
  { gesture: "n", className: "-top-1 left-3 right-3 h-2 cursor-ns-resize" },
  { gesture: "s", className: "-bottom-1 left-3 right-3 h-2 cursor-ns-resize" },
  { gesture: "e", className: "-right-1 top-3 bottom-3 w-2 cursor-ew-resize" },
  { gesture: "w", className: "-left-1 top-3 bottom-3 w-2 cursor-ew-resize" },
  { gesture: "ne", className: "-top-1 -right-1 h-4 w-4 cursor-nesw-resize" },
  { gesture: "sw", className: "-bottom-1 -left-1 h-4 w-4 cursor-nesw-resize" },
  { gesture: "nw", className: "-top-1 -left-1 h-4 w-4 cursor-nwse-resize" },
  { gesture: "se", className: "-bottom-1 -right-1 h-4 w-4 cursor-nwse-resize" },
];

const clamp = (n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

/** Phones get a fixed window: dragging fights page scroll and there is no room to resize. */
const canManage = () => window.matchMedia("(min-width: 640px)").matches;

function keepOnScreen(r: Rect): Rect {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const w = Math.min(r.w, vw);
  const h = Math.min(r.h, vh);
  return {
    w,
    h,
    x: clamp(r.x, KEEP_VISIBLE - w, vw - KEEP_VISIBLE),
    y: clamp(r.y, 0, vh - 48),
  };
}

function applyGesture(start: Rect, gesture: Gesture, dx: number, dy: number): Rect {
  if (gesture === "move") {
    return keepOnScreen({ ...start, x: start.x + dx, y: start.y + dy });
  }

  let { x, y, w, h } = start;
  if (gesture.includes("e")) w = Math.max(MIN_W, start.w + dx);
  if (gesture.includes("s")) h = Math.max(MIN_H, start.h + dy);
  if (gesture.includes("w")) {
    w = Math.max(MIN_W, start.w - dx);
    x = start.x + start.w - w;
  }
  if (gesture.includes("n")) {
    h = Math.max(MIN_H, start.h - dy);
    y = start.y + start.h - h;
    // Dragging the top edge past the top of the screen would hide the title bar.
    if (y < 0) {
      h += y;
      y = 0;
    }
  }
  return { x, y, w, h };
}

export interface WindowFrame {
  maximized: boolean;
  toggleMaximize: () => void;
  startMove: (e: React.PointerEvent<HTMLElement>) => void;
}

interface AppWindowProps {
  minimized: boolean;
  /** Where the window shrinks to when minimized — the app's dock icon. */
  getMinimizeTarget: () => DOMRect | null;
  children: (frame: WindowFrame) => React.ReactNode;
}

/**
 * A draggable, resizable window. It starts in normal page flow (centred by
 * the page) and switches to fixed positioning the first time it is moved or
 * resized, so the server-rendered layout is exactly what it always was.
 */
export function AppWindow({ minimized, getMinimizeTarget, children }: AppWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(null);
  const [maximized, setMaximized] = useState(false);
  const [gesturing, setGesturing] = useState(false);
  const [minimizeTransform, setMinimizeTransform] = useState<string>();

  const measure = (): Rect => {
    const r = ref.current!.getBoundingClientRect();
    return { x: r.left, y: r.top, w: r.width, h: r.height };
  };

  const beginGesture = useCallback(
    (e: React.PointerEvent<HTMLElement>, gesture: Gesture) => {
      if (e.button !== 0 || !canManage()) return;
      if (gesture === "move" && (e.target as HTMLElement).closest("button, a, input")) return;
      e.preventDefault();

      let start = rect ?? measure();
      if (maximized) {
        if (gesture !== "move") return;
        // Dragging a maximized window restores it under the pointer, like every desktop OS.
        const ratio = e.clientX / window.innerWidth;
        start = { ...start, x: e.clientX - start.w * ratio, y: 0 };
        setMaximized(false);
      }
      setRect(start);
      setGesturing(true);

      const originX = e.clientX;
      const originY = e.clientY;
      const onMove = (ev: PointerEvent) =>
        setRect(applyGesture(start, gesture, ev.clientX - originX, ev.clientY - originY));
      const onEnd = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onEnd);
        window.removeEventListener("pointercancel", onEnd);
        document.body.style.userSelect = "";
        setGesturing(false);
      };

      document.body.style.userSelect = "none";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [rect, maximized]
  );

  const toggleMaximize = useCallback(() => {
    if (maximized) {
      setMaximized(false);
      return;
    }
    // Pin the current box first so the next frame can animate from it.
    if (!rect && canManage()) setRect(measure());
    requestAnimationFrame(() => setMaximized(true));
  }, [maximized, rect]);

  // Shrink toward the dock icon. Measured before paint so it never flashes.
  useLayoutEffect(() => {
    if (!minimized) {
      setMinimizeTransform(undefined);
      return;
    }
    const target = getMinimizeTarget();
    if (!ref.current || !target) {
      setMinimizeTransform("scale(0.6)");
      return;
    }
    const r = ref.current.getBoundingClientRect();
    const dx = target.left + target.width / 2 - (r.left + r.width / 2);
    const dy = target.top + target.height / 2 - (r.top + r.height / 2);
    setMinimizeTransform(`translate(${dx}px, ${dy}px) scale(0.06)`);
    // Only the minimize transition matters; the target is read at that moment.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [minimized]);

  // A shrinking browser window must not strand the terminal off screen.
  useEffect(() => {
    const onResize = () => {
      if (!canManage()) {
        setRect(null);
        return;
      }
      setRect((r) => (r ? keepOnScreen(r) : r));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const placed = maximized || rect !== null;
  const style: React.CSSProperties = maximized
    ? { left: 0, top: 0, width: "100%", height: "calc(100dvh - var(--dock-space))" }
    : rect
      ? { left: rect.x, top: rect.y, width: rect.w, height: rect.h }
      : {};

  return (
    <div
      ref={ref}
      data-state={minimized ? "minimized" : "open"}
      data-gesturing={gesturing || undefined}
      data-placed={placed || undefined}
      data-occludes-background={!minimized || undefined}
      aria-hidden={minimized || undefined}
      style={{ ...style, transform: minimizeTransform }}
      className={`os-window z-30 ${
        placed ? "fixed" : "relative w-full h-[75vh] max-h-[700px] max-w-5xl"
      }`}
    >
      {children({ maximized, toggleMaximize, startMove: (e) => beginGesture(e, "move") })}

      {!maximized &&
        HANDLES.map(({ gesture, className }) => (
          <div
            key={gesture}
            aria-hidden="true"
            onPointerDown={(e) => beginGesture(e, gesture)}
            className={`absolute hidden sm:block touch-none ${className}`}
          />
        ))}
    </div>
  );
}
