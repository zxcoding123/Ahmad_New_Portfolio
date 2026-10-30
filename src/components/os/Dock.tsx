"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { Moon, Power, RotateCcw, Sun } from "lucide-react";
import { APPS, type AppId } from "./apps";
import { Clock } from "./clock";

export type AppState = "open" | "minimized" | "closed";

interface DockProps {
  apps: Record<AppId, AppState>;
  /** The window in front, which gets the highlighted icon. */
  activeApp: AppId | null;
  onAppClick: (id: AppId) => void;
  /** Dock icons, so minimized windows know where to shrink to. */
  iconRefs: React.MutableRefObject<Partial<Record<AppId, HTMLButtonElement | null>>>;
  onRestart: () => void;
  onShutDown: () => void;
}

const MENU_ITEM =
  "w-full flex items-center gap-2 px-3 py-2 text-sm text-left rounded hover:bg-accent hover:text-accent-foreground transition-colors";

function verb(state: AppState, active: boolean) {
  if (state === "closed") return "Open";
  if (state === "minimized") return "Restore";
  return active ? "Minimize" : "Show";
}

/** The taskbar: start menu, one icon per running app (the terminal is pinned), and a clock. */
export function Dock({ apps, activeApp, onAppClick, iconRefs, onRestart, onShutDown }: DockProps) {
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

  const ids = Object.keys(APPS) as AppId[];
  const docked = ids.filter((id) => id === "terminal" || apps[id] !== "closed");

  return (
    <nav
      aria-label="Taskbar"
      className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 hidden sm:flex items-center gap-1 rounded-2xl border border-border bg-background/70 backdrop-blur-md shadow-xl px-2 py-1.5 font-code"
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
            className="absolute bottom-full left-0 mb-3 w-64 rounded-xl border border-border bg-background/95 backdrop-blur-md shadow-2xl p-2 animate-fade-in"
          >
            <p className="px-3 pt-1 pb-2 text-xs text-muted-foreground border-b border-border mb-1">
              AhmadOS · {ids.length} programs installed
            </p>
            {ids.map((id) => {
              const { icon: Icon, title } = APPS[id];
              return (
                <button key={id} role="menuitem" type="button" className={MENU_ITEM} onClick={choose(() => onAppClick(id))}>
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {verb(apps[id], activeApp === id)} {title}
                  </span>
                </button>
              );
            })}
            <span className="block h-px bg-border my-1" aria-hidden="true" />
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

      {docked.map((id) => {
        const { icon: Icon, title } = APPS[id];
        const state = apps[id];
        const active = activeApp === id && state === "open";
        const label = `${verb(state, active)} ${title}`;
        return (
          <button
            key={id}
            ref={(el) => {
              iconRefs.current[id] = el;
            }}
            type="button"
            aria-label={label}
            title={label}
            onClick={() => onAppClick(id)}
            className={`relative h-10 w-10 rounded-xl flex items-center justify-center transition-colors animate-fade-in ${
              active ? "bg-secondary" : "hover:bg-secondary"
            }`}
          >
            <Icon className="h-6 w-6 text-primary" />
            {state !== "closed" && (
              <span
                aria-hidden="true"
                className={`absolute bottom-0.5 h-1 rounded-full bg-primary transition-all ${
                  active ? "w-4" : "w-1"
                }`}
              />
            )}
          </button>
        );
      })}

      <span className="h-6 w-px bg-border mx-1" aria-hidden="true" />

      <Clock className="px-2 text-xs text-muted-foreground" />
    </nav>
  );
}
