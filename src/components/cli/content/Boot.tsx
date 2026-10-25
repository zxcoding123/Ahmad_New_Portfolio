"use client";

import { useEffect, useRef, useState } from "react";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { ventures } from "./Ventures";
import { loadContributions } from "@/lib/contributions";

interface BootLine {
  status: "OK" | "WARN";
  text: string;
}

interface BootProps {
  /** Called once, when the sequence finishes or the visitor skips it. */
  onDone: () => void;
}

const LINE_DELAY_MS = 180;
/** How long the GitHub line waits for live numbers before giving up. */
const GITHUB_TIMEOUT_MS = 1500;
const FINAL_PAUSE_MS = 450;

const STATUS_STYLES: Record<BootLine["status"], string> = {
  OK: "text-green-500",
  WARN: "text-yellow-500",
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/**
 * Fake systemd-style boot log shown before the home screen. Every number in it
 * is real: project, stack and venture counts from data/, contributions live
 * from GitHub. Any key or tap skips it.
 */
export function Boot({ onDone }: BootProps) {
  const [lines, setLines] = useState<BootLine[]>([]);
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let cancelled = false;
    let finished = false;
    const finish = () => {
      if (finished || cancelled) return;
      finished = true;
      onDoneRef.current();
    };
    const push = (line: BootLine) => {
      if (!cancelled) setLines((prev) => [...prev, line]);
    };

    const techCount = stack.reduce((sum, group) => sum + group.items.length, 0);
    const github = loadContributions();

    setLines([]);
    (async () => {
      const steps: BootLine[] = [
        { status: "OK", text: "Started ahmad.bat kernel" },
        { status: "OK", text: `Mounted /projects (${projects.length} projects)` },
        { status: "OK", text: `Loaded stack (${techCount} technologies in ${stack.length} groups)` },
        { status: "OK", text: `Started ventures: ${ventures.map((v) => v.title).join(", ")}` },
      ];
      for (const step of steps) {
        await wait(LINE_DELAY_MS);
        push(step);
      }

      const data = await Promise.race([github, wait(GITHUB_TIMEOUT_MS).then(() => null)]);
      push(
        data?.days.length
          ? {
              status: "OK",
              text: `Synced GitHub (${data.total.toLocaleString("en-US")} contributions in the last year)`,
            }
          : { status: "WARN", text: "GitHub unreachable, continuing offline" }
      );

      await wait(LINE_DELAY_MS);
      push({ status: "OK", text: "Reached target: portfolio" });
      await wait(FINAL_PAUSE_MS);
      finish();
    })();

    const skip = () => finish();
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      cancelled = true;
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  return (
    <div className="text-xs sm:text-sm" aria-live="polite">
      {lines.map((line, i) => (
        <p key={i} className="boot-line">
          [<span className={`font-bold whitespace-pre ${STATUS_STYLES[line.status]}`}>{line.status.padStart(3).padEnd(4)}</span>]{" "}
          {line.text}
        </p>
      ))}
      <p className="text-muted-foreground mt-2">
        <span className="inline-block w-2 h-4 align-middle bg-foreground animate-blink" />{" "}
        <span className="text-xs">press any key to skip</span>
      </p>
    </div>
  );
}
