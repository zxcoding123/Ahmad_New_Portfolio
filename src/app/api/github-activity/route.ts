import { NextResponse } from "next/server";
import { GITHUB_USERNAME, type PushMap } from "@/lib/projectActivity";

/**
 * Returns a map of `owner/repo` -> ISO date of the most recent push, built from
 * the public GitHub events feed. Proxied through the server so the hourly cache
 * is shared by every visitor instead of burning each one's 60 req/hr anonymous
 * rate limit. Set GITHUB_TOKEN in .env.local to raise that ceiling.
 *
 * Failures are deliberately soft: the client falls back to the hand-maintained
 * `updatedAt` dates in data/projects.ts, so the banner never goes blank.
 */
export const revalidate = 3600;

export async function GET() {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/events/public?per_page=100`,
      { headers, next: { revalidate: 3600 } }
    );

    if (!res.ok) {
      return NextResponse.json(
        { pushes: {}, error: `GitHub responded ${res.status}` },
        { status: 200 }
      );
    }

    const events: unknown = await res.json();
    if (!Array.isArray(events)) {
      return NextResponse.json({ pushes: {}, error: "Unexpected payload" });
    }

    const pushes: PushMap = {};

    for (const event of events as Array<{
      type?: string;
      created_at?: string;
      repo?: { name?: string };
    }>) {
      if (event.type !== "PushEvent") continue;

      const name = event.repo?.name?.toLowerCase();
      const createdAt = event.created_at;
      if (!name || !createdAt) continue;

      // The feed is newest-first, so the first hit per repo is the latest push.
      if (!pushes[name]) pushes[name] = createdAt;
    }

    return NextResponse.json({ pushes });
  } catch (error) {
    return NextResponse.json({
      pushes: {},
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
