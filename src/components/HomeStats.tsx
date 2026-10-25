"use client";

import { Code2, FolderGit2, Wrench } from "lucide-react";
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { SOCIALS } from "@/data/site";
import loc from "@/data/loc.json";
import { CountUp } from "@/components/CountUp";
import { runCliCommand } from "@/lib/cli-events";

const toolCount = stack.reduce((sum, group) => sum + group.items.length, 0);

const CARD =
  "flex flex-col items-center gap-1 rounded-md border border-border bg-secondary px-2 py-3 sm:py-4 text-center transition-colors hover:border-primary";
const VALUE = "text-xl sm:text-3xl font-bold text-primary";
const LABEL = "text-[0.65rem] sm:text-xs uppercase tracking-wide text-muted-foreground";

/** Projects, lines of code and tools, shown under the contribution graph on the home screen. */
export function HomeStats() {
  return (
    <div className={`grid gap-2 sm:gap-3 ${loc.linesOfCode ? "grid-cols-3" : "grid-cols-2"}`}>
      <button type="button" onClick={() => runCliCommand("works")} className={CARD}>
        <FolderGit2 size={18} className="text-muted-foreground" />
        <CountUp value={projects.length} className={VALUE} />
        <span className={LABEL}>Projects</span>
      </button>

      {/* Counted offline by `npm run count-loc`; hidden until it has run. */}
      {loc.linesOfCode > 0 && (
        <a
          href={SOCIALS.github}
          target="_blank"
          rel="noopener noreferrer"
          className={CARD}
          title={`Non-blank source lines across ${loc.repos} GitHub repos, counted ${loc.countedAt}`}
        >
          <Code2 size={18} className="text-muted-foreground" />
          <CountUp value={loc.linesOfCode} duration={1400} className={VALUE} />
          <span className={LABEL}>Lines of code</span>
        </a>
      )}

      <button type="button" onClick={() => runCliCommand("stack")} className={CARD}>
        <Wrench size={18} className="text-muted-foreground" />
        <CountUp value={toolCount} className={VALUE} />
        <span className={LABEL}>Tools</span>
      </button>
    </div>
  );
}
