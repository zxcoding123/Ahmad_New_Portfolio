"use client";

import React, { forwardRef, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Power, RotateCcw, Sun, TerminalSquare } from "lucide-react";

export type AppState = "open" | "minimized" | "closed";

interface DockProps {
  app: AppState;
  onAppClick: () => void;
  onRestart: () => void;
  onShutDown: () => void;
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 15_000);
    return () => window.clearInterval(id);
  }, []);

  // Rendered client-side only: the server's clock is not the visitor's.
  if (!now) return <span className="w-16" />;
  return (
    <time
      dateTime={now.toISOString()}
      title={now.toLocaleDateString(undefined, { weekday: "long", month: "long", day: "numeric" })}
      className="px-2 text-xs tabular-nums text-muted-foreground whitespace-nowrap"
    >
      {now.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" })}
    </time>
  );
}

const MENU_ITEM =
  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded hover:bg-accent hover:text-accent-foreground transition-colors";

/** The taskbar. Forwards a ref to the app icon so minimized windows know where to shrink to. */
export const Dock = forwardRef<HTMLButtonElement, DockProps>(function Dock(
  { app, onAppClick, onRestart, onShutDown },
  appIconRef
) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const choose = (action: () => void) => () => {
    setMenuOpen(false);
    action();
  };

  const running = app !== "closed";
  const label =
    app === "open" ? "Minimize ahmad.bat" : app === "minimized" ? "Restore ahmad.bat" : "Open ahmad.bat";

  return (
    <nav
      aria-label="Taskbar"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-2xl border border-border bg-background/70 backdrop-blur-md shadow-xl px-2 py-1.5 font-code"
    >
      <div ref={menuRef} className="relative">
        <button
          type="button"
          aria-label="Start menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((o) => !o)}
          className="h-10 w-10 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
        >
          <Image src="/logo.png" alt="" width={24} height={24} className="rounded" />
        </button>

        {menuOpen && (
          <div
            role="menu"
            className="absolute bottom-full left-0 mb-3 w-56 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl p-2 animate-fade-in"
          >
            <p className="px-3 pt-1 pb-2 text-xs text-muted-foreground border-b border-border mb-1">
              AhmadOS · 1 program installed
            </p>
            <button role="menuitem" type="button" className={MENU_ITEM} onClick={choose(onAppClick)}>
              <TerminalSquare className="h-4 w-4" /> {app === "open" ? "Minimize" : "Open"} ahmad.bat
            </button>
            <button
              role="menuitem"
              type="button"
              className={MENU_ITEM}
              onClick={choose(() => setTheme(resolvedTheme === "dark" ? "light" : "dark"))}
            >
              {resolvedTheme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              {resolvedTheme === "dark" ? "Light" : "Dark"} mode
            </button>
            <button role="menuitem" type="button" className={MENU_ITEM} onClick={choose(onRestart)}>
              <RotateCcw className="h-4 w-4" /> Restart
            </button>
            <button role="menuitem" type="button" className={MENU_ITEM} onClick={choose(onShutDown)}>
              <Power className="h-4 w-4" /> Shut down
            </button>
          </div>
        )}
      </div>

      <span className="h-6 w-px bg-border mx-1" aria-hidden="true" />

      <button
        ref={appIconRef}
        type="button"
        aria-label={label}
        title={label}
        onClick={onAppClick}
        className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
          app === "open" ? "bg-secondary" : "hover:bg-secondary"
        }`}
      >
        <TerminalSquare className="h-6 w-6 text-primary" />
        {running && (
          <span
            aria-hidden="true"
            className={`absolute bottom-0.5 h-1 rounded-full bg-primary transition-all ${
              app === "open" ? "w-4" : "w-1"
            }`}
          />
        )}
      </button>

      <span className="h-6 w-px bg-border mx-1" aria-hidden="true" />

      <Clock />
    </nav>
  );
});
