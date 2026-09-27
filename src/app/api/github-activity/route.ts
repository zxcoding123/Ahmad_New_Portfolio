import { NextResponse } from "next/server";
import { trackedOwners, type PushMap } from "@/lib/projectActivity";

/**
 * Returns a map of `owner/repo` -> ISO date of the most recent push, read from
 * each repo's `pushed_at`. That field moves on a push to any branch, so every
 * push counts — unlike the events feed, which drops anything past ~90 days.
 *
 * Without a token this lists the public repos of every owner referenced in
 * data/projects.ts. With GITHUB_TOKEN set (a read-only fine-grained token is
 * enough) it also lists private and org repos you can see, so a project whose
 * code is private still moves to the top when you push to it.
 *
 * Proxied through the server so the 5-minute cache is shared by every visitor
 * instead of burning each one's anonymous rate limit. Failures are soft: the
 * client falls back to the hand-maintained `updatedAt` dates.
 */
export const revalidate = 300;

const API = "https://api.github.com";

interface Repo {
  full_name?: string;
  pushed_at?: string | null;
}

export async function GET() {
  const token = process.env.GITHUB_TOKEN;
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  // Newest-pushed first, so a single page of 100 always holds the active repos.
  const urls = trackedOwners().map(
    (owner) => `${API}/users/${owner}/repos?sort=pushed&per_page=100`
  );
  if (token) {
    urls.push(
      `${API}/user/repos?affiliation=owner,collaborator,organization_member&sort=pushed&per_page=100`
    );
  }

  const results = await Promise.allSettled(
    urls.map(async (url) => {
      const res = await fetch(url, { headers, next: { revalidate } });
      if (!res.ok) throw new Error(`GitHub responded ${res.status} for ${url}`);
      const body: unknown = await res.json();
      return Array.isArray(body) ? (body as Repo[]) : [];
    })
  );

  const pushes: PushMap = {};
  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    for (const repo of result.value) {
      const name = repo.full_name?.toLowerCase();
      const pushedAt = repo.pushed_at;
      if (!name || !pushedAt) continue;
      if (!pushes[name] || pushedAt > pushes[name]) pushes[name] = pushedAt;
    }
  }

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => (r.reason instanceof Error ? r.reason.message : String(r.reason)));

  return NextResponse.json(errors.length ? { pushes, errors } : { pushes });
}
