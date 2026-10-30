// lib/os-events.ts
//
// Lets terminal output (e.g. the `resume` command) open a desktop app window.
// Same reasoning as cli-events: history entries are inert React nodes with no
// prop path back to the Desktop, so a DOM event carries the request.

import type { AppId } from "@/components/os/apps";

const OS_OPEN_EVENT = "os:open";

/** Ask the Desktop to open (or raise) an app's window. */
export function openApp(id: AppId) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent<AppId>(OS_OPEN_EVENT, { detail: id }));
}

/** Subscribe the Desktop to those requests. Returns an unsubscribe function. */
export function onOpenApp(handler: (id: AppId) => void): () => void {
    if (typeof window === "undefined") return () => {};

    const listener = (event: Event) => handler((event as CustomEvent<AppId>).detail);
    window.addEventListener(OS_OPEN_EVENT, listener);
    return () => window.removeEventListener(OS_OPEN_EVENT, listener);
}
