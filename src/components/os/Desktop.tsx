"use client";

import React, { useCallback, useRef, useState } from "react";
import { FileText, Github, Linkedin, Power, TerminalSquare, Trash2 } from "lucide-react";
import { Terminal } from "@/components/cli/Terminal";
import { AppWindow } from "./AppWindow";
import { Dock, type AppState } from "./Dock";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { RESUME, SOCIALS } from "@/data/site";

/** Drop `?cmd=` so a relaunched terminal does not replay the last deep link. */
function clearDeepLink() {
  const url = new URL(window.location.href);
  url.searchParams.delete("cmd");
  window.history.replaceState(null, "", url);
}

interface IconProps {
  icon: React.ElementType;
  label: string;
  /** Runs on double-click with a mouse, or a single tap on touch. */
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
    <button
      type="button"
      className={className}
      onDoubleClick={onOpen}
      onPointerUp={(e) => e.pointerType !== "mouse" && onOpen?.()}
      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), onOpen?.())}
    >
      {body}
    </button>
  );
}

/** AhmadOS: a whole desktop whose only installed program is the portfolio. */
export function Desktop() {
  const [app, setApp] = useState<AppState>("open");
  const [poweredOff, setPoweredOff] = useState(false);
  // Bumped to remount the terminal fresh; `bootNext` replays the boot log on that mount.
  const [launch, setLaunch] = useState(0);
  const [bootNext, setBootNext] = useState(false);
  const appIconRef = useRef<HTMLButtonElement>(null);
  const { toast } = useToast();

  const relaunch = useCallback((boot: boolean) => {
    clearDeepLink();
    setBootNext(boot);
    setLaunch((n) => n + 1);
    setApp("open");
  }, []);

  const toggleApp = useCallback(() => {
    trackEvent("os_app_clicked", { state: app });
    if (app === "open") setApp("minimized");
    else if (app === "minimized") setApp("open");
    else relaunch(false);
  }, [app, relaunch]);

  const open = useCallback(() => {
    if (app === "minimized") setApp("open");
    else if (app === "closed") relaunch(false);
  }, [app, relaunch]);

  const close = useCallback(() => {
    trackEvent("os_app_closed");
    clearDeepLink();
    setApp("closed");
  }, []);

  const shutDown = useCallback(() => {
    trackEvent("os_shut_down");
    setApp("closed");
    setPoweredOff(true);
  }, []);

  const powerOn = () => {
    setPoweredOff(false);
    relaunch(true);
  };

  const emptyTrash = () =>
    toast({ title: "Recycle Bin is empty", description: "Bugs get fixed, not binned." });

  return (
    <>
      {/* Desktop icons: always visible on wide screens, otherwise only once the window is out of the way. */}
      <div
        className={`absolute left-4 top-4 z-10 flex-col gap-3 ${
          app === "open" ? "hidden xl:flex" : "flex"
        }`}
      >
        <DesktopIcon icon={TerminalSquare} label="ahmad.bat" onOpen={open} />
        <DesktopIcon icon={FileText} label="resume.pdf" href={RESUME.viewUrl} />
        <DesktopIcon icon={Github} label="GitHub" href={SOCIALS.github} />
        <DesktopIcon icon={Linkedin} label="LinkedIn" href={SOCIALS.linkedin} />
        <DesktopIcon icon={Trash2} label="Recycle Bin" onOpen={emptyTrash} />
      </div>

      {app !== "closed" && (
        <AppWindow
          key={launch}
          minimized={app === "minimized"}
          getMinimizeTarget={() => appIconRef.current?.getBoundingClientRect() ?? null}
        >
          {(frame) => (
            <Terminal
              bootOnMount={bootNext}
              controls={{
                onClose: close,
                onMinimize: () => setApp("minimized"),
                onToggleMaximize: frame.toggleMaximize,
                maximized: frame.maximized,
                onTitleBarPointerDown: frame.startMove,
              }}
            />
          )}
        </AppWindow>
      )}

      {app === "closed" && !poweredOff && (
        <p className="text-sm text-muted-foreground text-center px-6 py-2 rounded-lg bg-background/60 backdrop-blur-sm animate-fade-in">
          ahmad.bat is not running. Double-click it on the desktop or click it in the dock.
        </p>
      )}

      <Dock ref={appIconRef} app={app} onAppClick={toggleApp} onRestart={() => relaunch(true)} onShutDown={shutDown} />

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
