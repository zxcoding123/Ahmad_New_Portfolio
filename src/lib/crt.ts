// lib/crt.ts
//
// CRT mode is an overlay on top of light/dark rather than a theme of its own,
// so it lives in a class on <html> next to next-themes' class and is
// remembered per browser.

const STORAGE_KEY = "crt-mode";
const CLASS_NAME = "crt";

export function isCrt(): boolean {
  return typeof document !== "undefined" && document.documentElement.classList.contains(CLASS_NAME);
}

export function setCrt(on: boolean) {
  document.documentElement.classList.toggle(CLASS_NAME, on);
  try {
    localStorage.setItem(STORAGE_KEY, on ? "1" : "0");
  } catch {
    // Storage blocked (private mode): the effect still applies for this visit.
  }
}

/** Re-applies the saved preference on load. */
export function restoreCrt() {
  try {
    if (localStorage.getItem(STORAGE_KEY) === "1") setCrt(true);
  } catch {
    // Nothing saved or storage blocked: stay off.
  }
}
