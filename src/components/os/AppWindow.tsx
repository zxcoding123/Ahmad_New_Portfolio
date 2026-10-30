"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

export interface Rect {
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

const PHONE_FULLSCREEN = "fixed inset-x-0 top-[var(--status-bar)] bottom-[var(--home-bar)]";

const clamp =(n: number, min: number, max: number) => Math.min(Math.max(n, min), max);

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
  /** Stacking order among windows; higher is in front. */
  zIndex: number;
  /** Called whenever the visitor interacts with the window, to raise it. */
  onFocus: () => void;
  /**
   * Where a window opened after page load first appears. Without it the
   * window sits in page flow like the terminal does on first paint.
   */
  defaultRect?: () => Rect;
  children: (frame: WindowFrame) => React.ReactNode;
}

/**
 * A draggable, resizable window. Without `defaultRect` it starts in normal
 * page flow (centred by the page) and switches to fixed positioning the first
 * time it is moved or resized, so the server-rendered layout is exactly what
 * it always was.
 */
export function AppWindow({
  minimized,
  getMinimizeTarget,
  zIndex,
  onFocus,
  defaultRect,
  children,
}: AppWindowProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [rect, setRect] = useState<Rect | null>(() =>
    defaultRect && canManage() ? keepOnScreen(defaultRect()) : null
  );
  const [maximized, setMaximized] = useState(false);
  const [gesturing, setGesturing] = useState(false);
  const [minimizeTransform, setMinimizeTransform] = useState<string>();
  const onFocusRef = useRef(onFocus);
  onFocusRef.current = onFocus;
  const defaultRectRef = useRef(defaultRect);

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
        delete document.body.dataset.windowGesture;
        setGesturing(false);
      };

      document.body.style.userSelect = "none";
      // Lets CSS stop iframes from swallowing the pointer mid-drag.
      document.body.dataset.windowGesture = "";
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onEnd);
      window.addEventListener("pointercancel", onEnd);
    },
    [rect, maximized]
  );

  const toggleMaximize = useCallback(() => {
    // Phone apps are already full screen.
    if (!canManage()) return;
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

  // A shrinking browser window must not strand the window off screen.
  useEffect(() => {
    const onResize = () => {
      if (!canManage()) {
        setRect(null);
        setMaximized(false);
        return;
      }
      const initial = defaultRectRef.current;
      setRect((r) => (r ? keepOnScreen(r) : initial ? keepOnScreen(initial()) : r));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Clicks inside an iframe never reach this page; focus moving into it is the only sign.
  useEffect(() => {
    const onBlur = () =>
      window.setTimeout(() => {
        if (document.activeElement instanceof HTMLIFrameElement && ref.current?.contains(document.activeElement)) {
          onFocusRef.current();
        }
      });
    window.addEventListener("blur", onBlur);
    return () => window.removeEventListener("blur", onBlur);
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
      onPointerDownCapture={onFocus}
      onFocusCapture={onFocus}
      style={{ ...style, zIndex, transform: minimizeTransform }}
      className={`os-window ${
        placed
          ? "fixed"
          : // Phones: every app fills the screen between the status bar and the home bar.
            `${PHONE_FULLSCREEN} ${defaultRect ? "" : "sm:relative sm:inset-auto sm:w-full sm:h-[75vh] sm:max-h-[700px] sm:max-w-5xl"}`
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
