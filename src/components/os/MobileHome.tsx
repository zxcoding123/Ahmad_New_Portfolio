"use client";

import React from "react";
import { useTheme } from "next-themes";
import { BatteryFull, Calendar, Mail, Moon, RotateCcw, Signal, Sun, Wifi } from "lucide-react";
import { APPS, type AppId } from "./apps";
import { Clock, formatDate, formatTime, useNow } from "./clock";
import { trackEvent } from "@/lib/analytics";
import { SITE, SOCIALS } from "@/data/site";

/** Phone-style app tile colours, keyed by home-screen item. */
const TILE: Record<string, string> = {
  terminal: "bg-neutral-900 text-green-400 border border-neutral-700",
  resume: "bg-red-500 text-white",
  github: "bg-neutral-800 text-white",
  linkedin: "bg-[#0A66C2] text-white",
  trash: "bg-neutral-400 text-white dark:bg-neutral-600",
  mail: "bg-sky-500 text-white",
  calendar: "bg-white text-red-500 border border-neutral-200",
  theme: "bg-indigo-500 text-white",
  restart: "bg-amber-500 text-white",
};

/** Short home-screen labels; window titles are too long to fit under an icon. */
const LABEL: Record<AppId, string> = {
  terminal: "ahmad.bat",
  resume: "Resume",
  github: "GitHub",
  linkedin: "LinkedIn",
  trash: "Bin",
};

const DOCK_APPS: AppId[] = ["terminal", "resume", "github", "linkedin"];

interface TileProps {
  tile: string;
  icon: React.ElementType;
  label: string;
  /** Dock tiles show no caption, but keep the label as their accessible name. */
  hideLabel?: boolean;
  onClick?: () => void;
  href?: string;
  buttonRef?: (el: HTMLButtonElement | null) => void;
}

function Tile({ tile, icon: Icon, label, hideLabel, onClick, href, buttonRef }: TileProps) {
  const body = (
    <>
      <span
        className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-md transition-transform group-active:scale-90 ${TILE[tile]}`}
      >
        <Icon className="h-7 w-7" />
      </span>
      {!hideLabel && (
        <span className="text-[11px] leading-tight text-foreground truncate max-w-full drop-shadow-sm">{label}</span>
      )}
    </>
  );
  const className = "group flex flex-col items-center gap-1 min-w-0 outline-none focus-visible:opacity-70";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} aria-label={label}>
        {body}
      </a>
    );
  }
  return (
    <button ref={buttonRef} type="button" onClick={onClick} className={className} aria-label={label}>
      {body}
    </button>
  );
}

interface MobileHomeProps {
  onOpen: (id: AppId) => void;
  /** Home-screen icons, so apps shrink back into them when you go home. */
  iconRefs: React.MutableRefObject<Partial<Record<AppId, HTMLButtonElement | null>>>;
  onRestart: () => void;
}

/** The phone home screen: a clock widget, an app grid and a dock. Hidden from `sm` up. */
export function MobileHome({ onOpen, iconRefs, onRestart }: MobileHomeProps) {
  const now = useNow();
  const { resolvedTheme, setTheme } = useTheme();
  const dark = resolvedTheme === "dark";

  const app = (id: AppId, label = true) => (
    <Tile
      key={id}
      tile={id}
      icon={APPS[id].icon}
      label={LABEL[id]}
      hideLabel={!label}
      onClick={() => onOpen(id)}
      buttonRef={(el) => {
        iconRefs.current[id] = el;
      }}
    />
  );

  return (
    <div className="sm:hidden fixed inset-0 z-10 flex flex-col px-5 pt-[calc(var(--status-bar)+1.5rem)] pb-[calc(var(--home-bar)+0.5rem)] font-code">
      <section className="rounded-3xl bg-background/60 backdrop-blur-md border border-border p-5 shadow-lg">
        <p className="text-4xl font-bold tabular-nums">{now ? formatTime(now) : " "}</p>
        <p className="text-sm text-muted-foreground">{now ? formatDate(now) : " "}</p>
        <p className="mt-3 text-sm font-bold">{SITE.name}</p>
        <p className="text-xs text-muted-foreground">{SITE.role}</p>
      </section>

      <div className="grid grid-cols-4 gap-x-3 gap-y-5 mt-8">
        {app("trash")}
        <Tile
          tile="mail"
          icon={Mail}
          label="Email"
          href={`mailto:${SOCIALS.email}`}
        />
        <Tile tile="calendar" icon={Calendar} label="Book call" href={SOCIALS.calendly} />
        <Tile
          tile="theme"
          icon={dark ? Sun : Moon}
          label={dark ? "Light" : "Dark"}
          onClick={() => setTheme(dark ? "light" : "dark")}
        />
        <Tile tile="restart" icon={RotateCcw} label="Restart" onClick={onRestart} />
      </div>

      <nav
        aria-label="Home screen dock"
        className="mt-auto grid grid-cols-4 gap-3 rounded-3xl bg-background/60 backdrop-blur-md border border-border p-3 shadow-lg"
      >
        {DOCK_APPS.map((id) => app(id, false))}
      </nav>
    </div>
  );
}

/** Phone status bar. Matches the app's title bar while one is open, see-through on the home screen. */
export function StatusBar({ appOpen }: { appOpen: boolean }) {
  return (
    <div
      className={`sm:hidden fixed top-0 inset-x-0 z-[45] h-[var(--status-bar)] px-5 flex items-center justify-between font-code text-xs font-bold transition-colors ${
        appOpen ? "bg-secondary" : "bg-transparent"
      }`}
    >
      <Clock />
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <Signal className="h-3.5 w-3.5" />
        <Wifi className="h-3.5 w-3.5" />
        <BatteryFull className="h-4 w-4" />
      </span>
    </div>
  );
}

/** The bar along the bottom of the screen: a tap or a swipe up on it goes to the home screen. */
export function HomeBar({ appOpen, onHome }: { appOpen: boolean; onHome: () => void }) {
  const goHome = () => {
    trackEvent("os_home_clicked");
    onHome();
  };

  return (
    <div
      className={`sm:hidden fixed bottom-0 inset-x-0 z-[45] h-[var(--home-bar)] flex items-center justify-center transition-colors ${
        appOpen ? "bg-background" : "bg-transparent"
      }`}
    >
      <button
        type="button"
        aria-label="Go to home screen"
        // Capturing the pointer keeps the release on this button even when a swipe ends above it.
        onPointerDown={(e) => e.currentTarget.setPointerCapture(e.pointerId)}
        onPointerUp={goHome}
        // Keyboard activation; pointer presses are handled on release above.
        onClick={(e) => e.detail === 0 && goHome()}
        className="h-full w-40 flex items-center justify-center touch-none"
      >
        <span className="h-1.5 w-32 rounded-full bg-foreground/70" />
      </button>
    </div>
  );
}
