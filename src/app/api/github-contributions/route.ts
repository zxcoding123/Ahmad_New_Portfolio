import { NextResponse } from "next/server";
import { SOCIALS } from "@/data/site";

/**
 * Returns the last year of GitHub contributions as `{ days, total }`, where
 * each day is `{ date, count, level }` and level is GitHub's own 0–4 shade.
 *
 * Read from the public contributions fragment that powers the calendar on the
 * profile page, so no token is needed and private contributions are included
 * whenever "Private contributions" is switched on in the profile settings.
 * Cached for an hour and shared by every visitor; on failure the client simply
 * hides the calendar.
 */
export const revalidate = 3600;

export interface ContributionDay {
  date: string;
  count: number;
  level: number;
}

const USERNAME = new URL(SOCIALS.github).pathname.split("/").filter(Boolean)[0];

export async function GET() {
  try {
    const res = await fetch(`https://github.com/users/${USERNAME}/contributions`, {
      next: { revalidate },
    });
    if (!res.ok) throw new Error(`GitHub responded ${res.status}`);
    const html = await res.text();

    // Each cell's count only lives in its tooltip, linked by the cell's id.
    const counts = new Map<string, number>();
    for (const [, id, text] of html.matchAll(
      /<tool-tip[^>]*\bfor="([^"]+)"[^>]*>([^<]*)<\/tool-tip>/g
    )) {
      const match = text.match(/^(\d[\d,]*) contributions?/);
      counts.set(id, match ? Number(match[1].replace(/,/g, "")) : 0);
    }

    const days: ContributionDay[] = [];
    for (const [cell] of html.matchAll(/<td[^>]*ContributionCalendar-day[^>]*>/g)) {
      const date = cell.match(/data-date="([^"]+)"/)?.[1];
      const id = cell.match(/\bid="([^"]+)"/)?.[1];
      if (!date) continue;
      days.push({
        date,
        count: (id && counts.get(id)) || 0,
        level: Number(cell.match(/data-level="(\d)"/)?.[1] ?? 0),
      });
    }
    if (!days.length) throw new Error("No contribution cells found");

    days.sort((a, b) => a.date.localeCompare(b.date));
    const total = days.reduce((sum, day) => sum + day.count, 0);

    return NextResponse.json({ username: USERNAME, days, total });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ username: USERNAME, days: [], total: 0, error: message });
  }
}
