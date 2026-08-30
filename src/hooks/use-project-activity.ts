"use client";

import { useEffect, useState } from "react";
import {
  resolveProjects,
  type ActiveProject,
  type PushMap,
} from "@/lib/projectActivity";

/** Cached across mounts so `now`, `works` and the home banner share one fetch. */
let cachedPushes: PushMap | null = null;
let inFlight: Promise<PushMap> | null = null;

function loadPushes(): Promise<PushMap> {
  if (cachedPushes) return Promise.resolve(cachedPushes);
  if (inFlight) return inFlight;

  inFlight = fetch("/api/github-activity")
    .then((res) => (res.ok ? res.json() : { pushes: {} }))
    .then((data) => {
      cachedPushes = (data?.pushes as PushMap) ?? {};
      return cachedPushes;
    })
    .catch(() => {
      cachedPushes = {};
      return cachedPushes;
    })
    .finally(() => {
      inFlight = null;
    });

  return inFlight;
}

/**
 * Projects sorted newest-first. Renders immediately from the hand-maintained
 * `updatedAt` dates, then re-sorts once live GitHub push dates arrive.
 * `mounted` guards relative timestamps against hydration mismatches.
 */
export function useProjectActivity(): {
  projects: ActiveProject[];
  mounted: boolean;
} {
  const [pushes, setPushes] = useState<PushMap>(cachedPushes ?? {});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let active = true;
    setMounted(true);

    loadPushes().then((next) => {
      if (active) setPushes(next);
    });

    return () => {
      active = false;
    };
  }, []);

  return { projects: resolveProjects(pushes), mounted };
}
