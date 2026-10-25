import type { ContributionDay } from "@/app/api/github-contributions/route";

export type { ContributionDay };

export interface Contributions {
  days: ContributionDay[];
  total: number;
}

export interface ContributionStats {
  /** Consecutive days with contributions, ending today (or yesterday). */
  current: number;
  longest: number;
  best: ContributionDay | null;
}

/** Cached across mounts so the boot screen, `about`, `now` and `neofetch` share one fetch. */
let cached: Contributions | null = null;
let inFlight: Promise<Contributions> | null = null;

export function cachedContributions(): Contributions | null {
  return cached;
}

export function loadContributions(): Promise<Contributions> {
  if (cached) return Promise.resolve(cached);
  if (inFlight) return inFlight;

  inFlight = fetch("/api/github-contributions")
    .then((res) => (res.ok ? res.json() : { days: [], total: 0 }))
    .then((data) => {
      cached = { days: data?.days ?? [], total: data?.total ?? 0 };
      return cached;
    })
    .catch(() => {
      cached = { days: [], total: 0 };
      return cached;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/** Dates are plain `YYYY-MM-DD`, so read them as UTC to avoid timezone shifts. */
export const parseDate = (date: string) => new Date(`${date}T00:00:00Z`);

export function contributionStats(days: ContributionDay[]): ContributionStats {
  let longest = 0;
  let run = 0;
  let best: ContributionDay | null = null;
  for (const day of days) {
    run = day.count ? run + 1 : 0;
    longest = Math.max(longest, run);
    if (day.count && (!best || day.count > best.count)) best = day;
  }

  // Today is still in progress, so an empty today doesn't break the streak.
  let end = days.length - 1;
  if (end >= 0 && !days[end].count) end -= 1;
  let current = 0;
  while (end >= 0 && days[end].count) {
    current += 1;
    end -= 1;
  }

  return { current, longest, best };
}
