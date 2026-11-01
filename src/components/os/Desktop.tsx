"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Power } from "lucide-react";
import { Terminal } from "@/components/cli/Terminal";
import { AppWindow } from "./AppWindow";
import { Dock, type AppState } from "./Dock";
import { WindowChrome } from "./WindowChrome";
import { HomeBar, MobileHome, StatusBar } from "./MobileHome";
import {
  APPS,
  GithubActions,
  GithubApp,
  LinkedinActions,
  LinkedinApp,
  ResumeActions,
  ResumeApp,
  TrashApp,
  type AppId,
} from "./apps";
import { ChatApp } from "./ChatApp";
import { trackEvent } from "@/lib/analytics";
import { onOpenApp } from "@/lib/os-events";

/** Drop `?cmd=` so a relaunched terminal does not replay the last deep link. */
function clearDeepLink() {
  const url = new URL(window.location.href);
  url.searchParams.delete("cmd");
  window.history.replaceState(null, "", url);
}

/** An element's box, or null when it is not displayed (zero-sized). */
function shownRect(el: HTMLElement | null | undefined): DOMRect | null {
  const r = el?.getBoundingClientRect();
  return r?.width ? r : null;
}

/** Bottom of the window stack; the dock sits at z-40, above every window. */
const BASE_Z = 30;

const ALL_CLOSED: Record<AppId, AppState> = {
  terminal: "closed",
  resume: "closed",
  github: "closed",
  linkedin: "closed",
  chat: "closed",
  trash: "closed",
};

/** What each non-terminal app draws inside its window. */
const CONTENT: Record<Exclude<AppId, "terminal">, { body: React.ReactNode; actions?: React.ReactNode }> = {
  resume: { body: <ResumeApp />, actions: <ResumeActions /> },
  github: { body: <GithubApp />, actions: <GithubActions /> },
  linkedin: { body: <LinkedinApp />, actions: <LinkedinActions /> },
  chat: { body: <ChatApp /> },
  trash: { body: <TrashApp /> },
};

interface IconProps {
  icon: React.ElementType;
  label: string;
  /** Single click, like a link: visitors don't expect to double-click on a web page. */
  onOpen?: () => void;
  href?: string;
}

function DesktopIcon({ icon: Icon, label, onOpen, href }: IconProps) {
  const body = (
    <>
      <span className="h-12 w-12 rounded-xl bg-background/60 backdrop-blur-sm border border-border flex items-center justify-center group-hover:border-primary group-focus-visible:border-primary transition-colors">
        <Icon className="h-6 w-6 text-primary" />
      </span>
      <span className="text-xs text-center leading-tight px-1 rounded bg-background/60 backdrop-blur-sm">
        {label}
      </span>
    </>
  );
  const className =
    "group w-20 flex flex-col items-center gap-1 p-1 rounded-lg outline-none focus-visible:bg-secondary/60";

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={onOpen}>
      {body}
    </button>
  );
}

/** AhmadOS: a whole desktop built around the portfolio terminal. */
export function Desktop() {
  const [apps, setApps] = useState<Record<AppId, AppState>>({ ...ALL_CLOSED, terminal: "open" });
  // Window stacking order, back to front.
  const [stack, setStack] = useState<AppId[]>(["terminal"]);
  const [poweredOff, setPoweredOff] = useState(false);
  // Bumped to remount the terminal fresh; `bootNext` replays the boot log on that mount.
  const [launch, setLaunch] = useState(0);
  const [bootNext, setBootNext] = useState(false);
  const iconRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});
  const homeIconRefs = useRef<Partial<Record<AppId, HTMLButtonElement | null>>>({});

  const setApp = useCallback((id: AppId, state: AppState) => setApps((a) => ({ ...a, [id]: state })), []);

  const focus = useCallback(
    (id: AppId) => setStack((s) => (s[s.length - 1] === id ? s : [...s.filter((x) => x !== id), id])),
    []
  );

  // The front-most window that is actually showing.
  const activeApp = [...stack].reverse().find((id) => apps[id] === "open") ?? null;

  const relaunch = useCallback(
    (boot: boolean) => {
      clearDeepLink();
      setBootNext(boot);
      setLaunch((n) => n + 1);
      setApp("terminal", "open");
      focus("terminal");
    },
    [setApp, focus]
  );

  const open = useCallback(
    (id: AppId) => {
      if (id === "terminal" && apps.terminal === "closed") return relaunch(false);
      if (apps[id] === "closed") trackEvent("os_app_opened", { app: id });
      setApp(id, "open");
      focus(id);
    },
    [apps, relaunch, setApp, focus]
  );

  /** Dock click: minimize the front window, otherwise bring this one forward. */
  const toggleApp = useCallback(
    (id: AppId) => {
      trackEvent("os_app_clicked", { app: id, state: apps[id] });
      if (apps[id] === "open" && activeApp === id) setApp(id, "minimized");
      else open(id);
    },
    [apps, activeApp, open, setApp]
  );

  const close = useCallback(
    (id: AppId) => {
      trackEvent("os_app_closed", { app: id });
      if (id === "terminal") clearDeepLink();
      setApp(id, "closed");
    },
    [setApp]
  );

  useEffect(() => onOpenApp(open), [open]);

  /** Phone home bar: every open app goes to the background, like a phone's home gesture. */
  const goHome = () =>
    setApps((a) => {
      const next = { ...a };
      for (const id of Object.keys(next) as AppId[]) if (next[id] === "open") next[id] = "minimized";
      return next;
    });

  const restart = () => {
    setApps(ALL_CLOSED);
    relaunch(true);
  };

  const shutDown = () => {
    trackEvent("os_shut_down");
    setApps(ALL_CLOSED);
    setPoweredOff(true);
  };

  const powerOn = () => {
    setPoweredOff(false);
    relaunch(true);
  };

  const windowProps = (id: AppId) => ({
    minimized: apps[id] === "minimized",
    // The dock is hidden on phones, so fall back to the home-screen icon.
    getMinimizeTarget: () => shownRect(iconRefs.current[id]) ?? shownRect(homeIconRefs.current[id]),
    zIndex: BASE_Z + Math.max(0, stack.indexOf(id)),
    onFocus: () => focus(id),
    defaultRect: APPS[id].defaultRect,
  });

  const terminal = apps.terminal;

  return (
    <>
      {/* Desktop icons: always visible on wide screens, otherwise only once the terminal is out of the way. */}
      <div
        className={`absolute left-4 top-4 z-10 flex-col gap-3 ${
          terminal === "open" ? "hidden xl:flex" : "hidden sm:flex"
        }`}
      >
        <DesktopIcon icon={APPS.terminal.icon} label="ahmad.bat" onOpen={() => open("terminal")} />
        <DesktopIcon icon={APPS.resume.icon} label="resume.pdf" onOpen={() => open("resume")} />
        <DesktopIcon icon={APPS.github.icon} label="GitHub" onOpen={() => open("github")} />
        <DesktopIcon icon={APPS.linkedin.icon} label="LinkedIn" onOpen={() => open("linkedin")} />
        <DesktopIcon icon={APPS.chat.icon} label="Ask AI" onOpen={() => open("chat")} />
        <DesktopIcon icon={APPS.trash.icon} label="Recycle Bin" onOpen={() => open("trash")} />
      </div>

      {terminal !== "closed" && (
        <AppWindow key={launch} {...windowProps("terminal")}>
          {(frame) => (
            <Terminal
              bootOnMount={bootNext}
              controls={{
                onClose: () => close("terminal"),
                onMinimize: () => setApp("terminal", "minimized"),
                onToggleMaximize: frame.toggleMaximize,
                maximized: frame.maximized,
                onTitleBarPointerDown: frame.startMove,
              }}
            />
          )}
        </AppWindow>
      )}

      {(Object.keys(CONTENT) as (keyof typeof CONTENT)[]).map(
        (id) =>
          apps[id] !== "closed" && (
            <AppWindow key={id} {...windowProps(id)}>
              {(frame) => (
                <WindowChrome
                  title={APPS[id].title}
                  actions={CONTENT[id].actions}
                  controls={{
                    onClose: () => close(id),
                    onMinimize: () => setApp(id, "minimized"),
                    onToggleMaximize: frame.toggleMaximize,
                    maximized: frame.maximized,
                    onTitleBarPointerDown: frame.startMove,
                  }}
                >
                  {CONTENT[id].body}
                </WindowChrome>
              )}
            </AppWindow>
          )
      )}

      {terminal === "closed" && !poweredOff && (
        <p className="hidden sm:block text-sm text-muted-foreground text-center px-6 py-2 rounded-lg bg-background/60 backdrop-blur-sm animate-fade-in">
          ahmad.bat is not running. Click it on the desktop or click it in the dock.
        </p>
      )}

      <MobileHome onOpen={open} iconRefs={homeIconRefs} onRestart={restart} />
      <StatusBar appOpen={activeApp !== null} />
      <HomeBar appOpen={activeApp !== null} onHome={goHome} />

      <Dock
        apps={apps}
        activeApp={activeApp}
        onAppClick={toggleApp}
        iconRefs={iconRefs}
        onRestart={restart}
        onShutDown={shutDown}
      />

      {poweredOff && (
        <div className="fixed inset-0 z-[60] bg-black flex flex-col items-center justify-center gap-8 font-code animate-fade-in">
          <p className="text-orange-400 text-lg sm:text-2xl text-center px-6">
            It&apos;s now safe to close this tab.
          </p>
          <button
            type="button"
            onClick={powerOn}
            aria-label="Power on"
            className="h-14 w-14 rounded-full border-2 border-neutral-600 text-neutral-400 flex items-center justify-center hover:text-green-400 hover:border-green-400 transition-colors"
          >
            <Power className="h-6 w-6" />
          </button>
        </div>
      )}
    </>
  );
}
