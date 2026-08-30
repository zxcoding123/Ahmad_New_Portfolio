"use client";

import { Github, Link as LinkIcon } from "lucide-react";
import { useProjectActivity } from "@/hooks/use-project-activity";
import { formatRelative } from "@/lib/projectActivity";

const RECENT_COUNT = 5;

const statusStyles: Record<string, string> = {
  ongoing: "bg-yellow-500/15 text-yellow-500 border-yellow-500/30",
  completed: "bg-green-500/15 text-green-500 border-green-500/30",
  stable: "bg-blue-500/15 text-blue-500 border-blue-500/30",
};

/** Output of the `now` command — the last handful of projects I touched. */
export function Now() {
  const { projects, mounted } = useProjectActivity();
  const recent = projects.slice(0, RECENT_COUNT);

  if (!recent.length) {
    return <p className="text-muted-foreground">No project activity recorded yet.</p>;
  }

  const [current, ...rest] = recent;

  return (
    <div className="w-full">
      <h2 className="text-xl font-bold text-accent">Recent activity</h2>
      <p className="text-xs text-muted-foreground mt-1 mb-3">
        Most recently worked on, newest first.
      </p>

      <div className="border border-border rounded-md bg-secondary p-4">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-bold text-lg text-primary">{current.title}</h3>
          <span
            className={`text-xs px-2 py-0.5 rounded-full border ${
              statusStyles[current.status] ?? statusStyles.ongoing
            }`}
          >
            {current.status}
          </span>
          {mounted && (
            <span className="text-xs text-muted-foreground">
              updated {formatRelative(current.effectiveUpdatedAt)}
              {current.isLive && <span className="text-green-500"> · from GitHub</span>}
            </span>
          )}
        </div>

        <p className="text-sm text-muted-foreground mt-2">{current.description}</p>

        <div className="flex gap-2 flex-wrap mt-3">
          {current.tags.map((tag) => (
            <span key={tag} className="text-xs bg-background/50 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 text-sm mt-3">
          {current.repo && current.repo !== "#" && (
            <a
              href={current.repo}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Github size={16} /> Repository
            </a>
          )}
          {current.live && current.live !== "#" && (
            <a
              href={current.live}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-accent transition-colors"
            >
              <LinkIcon size={16} /> Live Demo
            </a>
          )}
        </div>
      </div>

      {rest.length > 0 && (
        <>
          <p className="text-sm text-muted-foreground mt-4 mb-2">Before that:</p>
          <ul className="space-y-1">
            {rest.map((p) => (
              <li key={p.title} className="flex items-baseline gap-2 text-sm">
                <span className="text-accent">·</span>
                <span className="font-bold text-primary">{p.title}</span>
                {mounted && (
                  <span className="text-muted-foreground text-xs">
                    {formatRelative(p.effectiveUpdatedAt)}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="text-xs text-muted-foreground mt-4">
        Type{" "}
        <span className="text-accent-foreground bg-accent px-1 rounded font-mono">
          works
        </span>{" "}
        to browse everything.
      </p>
    </div>
  );
}
