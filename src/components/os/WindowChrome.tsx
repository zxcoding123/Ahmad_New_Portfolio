"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";

/** Hooks a window's title bar into the desktop's window manager. */
export interface WindowControls {
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  maximized: boolean;
  /** Starts a window drag; ignores presses that land on a title-bar button. */
  onTitleBarPointerDown: (e: React.PointerEvent<HTMLElement>) => void;
}

const TRAFFIC_LIGHT =
  "group/light h-4 w-4 rounded-full flex items-center justify-center text-[10px] leading-none font-bold text-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary";

/** Phone apps fill the screen edge to edge, so they drop the window's frame. */
export const PHONE_APP_FRAME = "max-sm:rounded-none max-sm:border-0 max-sm:shadow-none";

/** Small bordered button for the right side of a title bar. */
export const TITLE_BAR_ACTION =
  "inline-flex items-center gap-1 text-xs px-2 py-1 rounded border border-border text-muted-foreground hover:text-foreground hover:border-primary transition-colors";

interface TitleBarProps {
  title: string;
  controls?: WindowControls;
  /** Extra buttons on the right of the title. */
  children?: React.ReactNode;
}

/** Traffic lights, a centred title, and the window's drag handle. */
export function TitleBar({ title, controls, children }: TitleBarProps) {
  return (
    <div
      onPointerDown={controls?.onTitleBarPointerDown}
      onDoubleClick={(e) => {
        if ((e.target as HTMLElement).closest("button, a")) return;
        controls?.onToggleMaximize();
      }}
      className={`relative bg-secondary p-3 flex items-center gap-2 border-b-2 border-primary shrink-0 select-none ${
        controls?.maximized ? "" : "rounded-t-md sm:cursor-grab sm:active:cursor-grabbing"
      }`}
    >
      {/* Phones: apps are full screen, so "back to home" replaces the traffic lights. */}
      <button
        type="button"
        aria-label="Go to home screen"
        onClick={controls?.onMinimize}
        className="sm:hidden -ml-1 inline-flex items-center text-sm text-primary"
      >
        <ChevronLeft className="h-5 w-5" />
        Home
      </button>
      <div className="hidden sm:flex gap-2">
        <button
          type="button"
          aria-label={`Close ${title}`}
          title="Close"
          onClick={controls?.onClose}
          className={`${TRAFFIC_LIGHT} bg-red-500`}
        >
          <span className="opacity-0 group-hover/light:opacity-100 group-focus-visible/light:opacity-100">×</span>
        </button>
        <button
          type="button"
          aria-label={`Minimize ${title}`}
          title="Minimize"
          onClick={controls?.onMinimize}
          className={`${TRAFFIC_LIGHT} bg-yellow-500`}
        >
          <span className="opacity-0 group-hover/light:opacity-100 group-focus-visible/light:opacity-100">−</span>
        </button>
        <button
          type="button"
          aria-label={controls?.maximized ? `Restore ${title}` : `Maximize ${title}`}
          title={controls?.maximized ? "Restore" : "Maximize"}
          onClick={controls?.onToggleMaximize}
          className={`${TRAFFIC_LIGHT} bg-green-500`}
        >
          <span className="opacity-0 group-hover/light:opacity-100 group-focus-visible/light:opacity-100">+</span>
        </button>
      </div>
      <div className="text-center flex-grow text-sm text-muted-foreground truncate">{title}</div>
      {children ?? <span className="w-16" aria-hidden="true" />}
    </div>
  );
}

interface WindowChromeProps extends TitleBarProps {
  children: React.ReactNode;
  /** Title-bar buttons; see TITLE_BAR_ACTION. */
  actions?: React.ReactNode;
}

/** The frame every desktop app other than the terminal draws itself in. */
export function WindowChrome({ title, controls, actions, children }: WindowChromeProps) {
  return (
    <div
      className={`relative overflow-hidden w-full h-full bg-background border-2 border-border shadow-2xl font-code text-base flex flex-col ${
        controls?.maximized ? "rounded-none" : "rounded-lg"
      } ${PHONE_APP_FRAME}`}
    >
      <TitleBar title={title} controls={controls}>
        {actions}
      </TitleBar>
      <div className="flex-1 min-h-0 overflow-auto">{children}</div>
    </div>
  );
}
