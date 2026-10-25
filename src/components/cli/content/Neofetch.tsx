"use client";

import { useEffect, useState } from "react";
import { SITE, SITE_URL, SOCIALS } from "@/data/site";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { ventures } from "./Ventures";
import { CountUp } from "@/components/CountUp";
import { cachedContributions, loadContributions } from "@/lib/contributions";

const LOGO = `        ▄▄▄▄▄▄
       ████████
      ████  ████
     ████    ████
    ██████████████
   ████        ████
  ████          ████
 ████            ████`;

/** Color swatches along the bottom, like the real neofetch. */
const SWATCHES = [
  "bg-red-500",
  "bg-yellow-500",
  "bg-green-500",
  "bg-cyan-500",
  "bg-blue-500",
  "bg-fuchsia-500",
  "bg-foreground",
  "bg-muted-foreground",
];

/** Delay between info lines appearing. */
const LINE_STEP_MS = 60;

function formatUptime(ms: number): string {
  const mins = Math.floor(ms / 60_000);
  if (mins < 1) return `${Math.max(1, Math.floor(ms / 1000))} secs`;
  if (mins < 60) return `${mins} min${mins === 1 ? "" : "s"}`;
  const hours = Math.floor(mins / 60);
  return `${hours} hour${hours === 1 ? "" : "s"}, ${mins % 60} mins`;
}

function countBy(status: string): number {
  return projects.filter((p) => p.status === status).length;
}

/** Output of the `neofetch` command — the whole portfolio as a system-info card. */
export function Neofetch() {
  const [total, setTotal] = useState<number | null>(cachedContributions()?.total ?? null);

  useEffect(() => {
    let active = true;
    loadContributions().then((data) => {
      if (active && data.days.length) setTotal(data.total);
    });
    return () => {
      active = false;
    };
  }, []);

  const host = new URL(SITE_URL).host;
  const languages = stack.find((g) => g.label === "Languages")?.items ?? [];
  const frameworks = stack.find((g) => g.label.startsWith("Frameworks"))?.items ?? [];

  const rows: [string, React.ReactNode][] = [
    ["OS", "ahmad.bat (Next.js 15)"],
    ["Host", host],
    ["Role", SITE.role],
    ["Uptime", formatUptime(performance.now())],
    ["Shell", "ahmad-sh 1.0"],
    [
      "Projects",
      `${projects.length} (${countBy("ongoing")} ongoing, ${countBy("completed")} completed, ${countBy("stable")} stable)`,
    ],
    ["Ventures", ventures.map((v) => v.title).join(", ")],
    ["Languages", languages.join(", ")],
    ["Frameworks", frameworks.slice(0, 5).join(", ")],
    [
      "Activity",
      total === null ? "syncing…" : (
        <>
          <CountUp value={total} /> GitHub contributions in the last year
        </>
      ),
    ],
    ["Email", SOCIALS.email],
    ["GitHub", SOCIALS.github.replace(/^https?:\/\//, "")],
  ];

  return (
    <div className="flex flex-col md:flex-row gap-4 md:gap-8">
      <pre
        aria-hidden="true"
        className="boot-line text-primary font-bold text-[0.55rem] sm:text-xs leading-tight select-none shrink-0"
      >
        {LOGO}
      </pre>

      <div className="text-sm min-w-0">
        <p className="boot-line">
          <span className="text-primary font-bold">ahmad</span>@
          <span className="text-primary font-bold">cli</span>
        </p>
        <p className="boot-line text-muted-foreground" aria-hidden="true">
          ---------
        </p>
        {rows.map(([label, value], i) => (
          <p
            key={label}
            className="boot-line break-words"
            style={{ animationDelay: `${(i + 2) * LINE_STEP_MS}ms` }}
          >
            <span className="text-primary font-bold">{label}</span>: {value}
          </p>
        ))}

        <div
          className="boot-line flex mt-3"
          style={{ animationDelay: `${(rows.length + 2) * LINE_STEP_MS}ms` }}
          aria-hidden="true"
        >
          {SWATCHES.map((swatch) => (
            <span key={swatch} className={`h-4 w-6 ${swatch}`} />
          ))}
        </div>
      </div>
    </div>
  );
}
