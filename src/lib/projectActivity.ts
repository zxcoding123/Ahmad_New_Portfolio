// lib/projectActivity.ts
import { formatDistanceToNowStrict, isValid, parseISO } from "date-fns";
import { projects, type Project } from "@/data/projects";

/** The GitHub account the live push dates are read from. */
export const GITHUB_USERNAME = "zxcoding123";

/** A project plus the resolved "last worked on" date. */
export interface ActiveProject extends Project {
  /** The date actually used for ordering — GitHub push date when we have one,
   *  otherwise the hand-maintained `updatedAt`. */
  effectiveUpdatedAt: string;
  /** True when the date came from a live GitHub push rather than `updatedAt`. */
  isLive: boolean;
}

/** Map of `owner/repo` (lowercased) -> ISO date of the most recent push. */
export type PushMap = Record<string, string>;

/**
 * Pull `owner/repo` out of a GitHub URL. Returns null for empty strings, the
 * `"#"` placeholders used in projects.ts, and any non-GitHub URL.
 */
export function repoSlugFromUrl(url?: string): string | null {
  if (!url || url === "#") return null;

  // Full URL, e.g. https://github.com/owner/repo/tree/main/src
  const fromUrl = url.match(/github\.com\/([^/\s]+)\/([^/\s?#]+)/i);
  if (fromUrl) {
    return `${fromUrl[1]}/${fromUrl[2].replace(/\.git$/, "")}`.toLowerCase();
  }

  // Bare slug, e.g. owner/repo — the shape `activityRepo` uses.
  const bare = url.match(/^([\w.-]+)\/([\w.-]+)$/);
  return bare ? `${bare[1]}/${bare[2]}`.toLowerCase() : null;
}

/** Every `owner/repo` a project's activity is read from: all `activityRepo`
 *  entries when set, otherwise the public `repo` link. */
export function trackedRepos(project: Project): string[] {
  const explicit = [project.activityRepo ?? []]
    .flat()
    .map((repo) => repoSlugFromUrl(repo))
    .filter((slug): slug is string => !!slug);
  if (explicit.length) return explicit;

  const fromRepo = repoSlugFromUrl(project.repo);
  return fromRepo ? [fromRepo] : [];
}

/** Every GitHub account or org that owns a tracked repo, so the API route
 *  knows whose repo lists to read. Always includes GITHUB_USERNAME. */
export function trackedOwners(source: Project[] = projects): string[] {
  const owners = new Set([GITHUB_USERNAME.toLowerCase()]);
  for (const project of source) {
    for (const slug of trackedRepos(project)) owners.add(slug.split("/")[0]);
  }
  return [...owners];
}

function toDate(value: string): Date | null {
  const parsed = parseISO(value);
  return isValid(parsed) ? parsed : null;
}

/** "3 days ago" / "2 months ago". Falls back to the raw string if unparseable. */
export function formatRelative(value: string): string {
  const date = toDate(value);
  if (!date) return value;
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "today";
  if (days === 1) return "yesterday";
  return formatDistanceToNowStrict(date, { addSuffix: true });
}

/**
 * Merge the hand-maintained `updatedAt` dates with live GitHub push dates and
 * sort newest-first. A GitHub date only wins when it is actually newer, so a
 * README-only push can never outrank real work you logged by hand.
 */
export function resolveProjects(
  pushes: PushMap = {},
  source: Project[] = projects
): ActiveProject[] {
  return source
    .map((project) => {
      // A project spanning several repos (app + admin, say) takes the most
      // recent push across all of them.
      let pushed: string | undefined;
      let pushedDate: Date | null = null;
      for (const slug of trackedRepos(project)) {
        const date = pushes[slug] ? toDate(pushes[slug]) : null;
        if (date && (!pushedDate || date > pushedDate)) {
          pushed = pushes[slug];
          pushedDate = date;
        }
      }

      const manualDate = toDate(project.updatedAt);

      const useLive =
        !!pushedDate && (!manualDate || pushedDate.getTime() > manualDate.getTime());

      return {
        ...project,
        effectiveUpdatedAt: useLive ? pushed! : project.updatedAt,
        isLive: useLive,
      };
    })
    .sort((a, b) => {
      const aTime = toDate(a.effectiveUpdatedAt)?.getTime() ?? 0;
      const bTime = toDate(b.effectiveUpdatedAt)?.getTime() ?? 0;
      return bTime - aTime;
    });
}

/** The single most recently touched project, or null if there are none. */
export function latestProject(
  pushes: PushMap = {},
  source: Project[] = projects
): ActiveProject | null {
  return resolveProjects(pushes, source)[0] ?? null;
}
