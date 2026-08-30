"use client";

import { Link as LinkIcon } from "lucide-react";
import { useProjectActivity } from "@/hooks/use-project-activity";
import { formatRelative } from "@/lib/projectActivity";
import { trackEvent } from "@/lib/analytics";

/**
 * One-line "what I touched last" banner for the home screen. Always the single
 * most recently worked-on project, whatever its status — the wording below
 * adapts instead of skipping past finished work.
 */
export function LatestProject() {
  const { projects, mounted } = useProjectActivity();

  const latest = projects[0] ?? null;

  if (!latest) return null;

  const verb = latest.status === "ongoing" ? "Currently building" : "Last worked on";

  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground">
      <span className="text-accent">▸</span>
      <span>{verb}:</span>

      {latest.live ? (
        <a
          href={latest.live}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackEvent("latest_project_clicked", { project: latest.title })
          }
          className="inline-flex items-center gap-1 font-bold text-primary hover:text-accent transition-colors"
        >
          {latest.title}
          <LinkIcon size={12} />
        </a>
      ) : (
        <span className="font-bold text-primary">{latest.title}</span>
      )}

      <span className="hidden sm:inline">— {latest.tags.slice(0, 3).join(" · ")}</span>

      {/* Rendered only after mount: relative time differs between server and client. */}
      {mounted && (
        <span className="whitespace-nowrap">
          ({formatRelative(latest.effectiveUpdatedAt)}
          {latest.isLive && <span className="text-green-500"> · live</span>})
        </span>
      )}
    </div>
  );
}
