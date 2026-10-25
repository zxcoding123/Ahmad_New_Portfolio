"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import { SOCIALS } from "@/data/site";
import { CountUp } from "@/components/CountUp";
import {
  cachedContributions,
  contributionStats,
  loadContributions,
  parseDate,
  type ContributionDay,
  type Contributions,
} from "@/lib/contributions";

/** GitHub's 0–4 shades, lighter greens on the light theme. */
const LEVEL_STYLES = [
  "fill-[#ebedf0] dark:fill-[#161b22]",
  "fill-[#9be9a8] dark:fill-[#0e4429]",
  "fill-[#40c463] dark:fill-[#006d32]",
  "fill-[#30a14e] dark:fill-[#26a641]",
  "fill-[#216e39] dark:fill-[#39d353]",
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const WEEKDAYS = ["", "Mon", "", "Wed", "", "Fri", ""];

/** SVG geometry, in the same units GitHub draws its calendar with. */
const CELL = 10;
const STEP = 13;
const LEFT = 28;
const TOP = 16;

/** Per-diagonal delay for the fill-in animation, oldest week first. */
const STAGGER_MS = 12;

/** Splits the days into Sunday-first week columns, padding the first week. */
function toWeeks(days: ContributionDay[]): (ContributionDay | null)[][] {
  if (!days.length) return [];
  const padded: (ContributionDay | null)[] = [
    ...Array(parseDate(days[0].date).getUTCDay()).fill(null),
    ...days,
  ];
  const weeks: (ContributionDay | null)[][] = [];
  for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7));
  return weeks;
}

/**
 * Month labels keyed by week column: one on the week holding each month's 1st,
 * skipped when it would collide with the previous label.
 */
function monthLabels(weeks: (ContributionDay | null)[][]): { week: number; label: string }[] {
  const labels: { week: number; label: string }[] = [];
  weeks.forEach((week, w) => {
    const first = week.find((day) => day && parseDate(day.date).getUTCDate() === 1);
    if (!first) return;
    if (labels.length && w - labels[labels.length - 1].week < 3) labels.pop();
    labels.push({ week: w, label: MONTHS[parseDate(first.date).getUTCMonth()] });
  });
  return labels;
}

function formatDay(date: string, withYear = true): string {
  return parseDate(date).toLocaleDateString("en-US", {
    month: withYear ? "long" : "short",
    day: "numeric",
    ...(withYear && { year: "numeric" }),
    timeZone: "UTC",
  });
}

function describe(day: ContributionDay): string {
  const when = formatDay(day.date);
  if (!day.count) return `No contributions on ${when}`;
  return `${day.count} contribution${day.count === 1 ? "" : "s"} on ${when}`;
}

function Stat({ label, value, unit }: { label: string; value: number; unit: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-[0.65rem] sm:text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm sm:text-base">
        <CountUp value={value} className="font-bold text-primary" />{" "}
        <span className="text-muted-foreground">{unit}</span>
      </span>
    </div>
  );
}

/** A year of GitHub contributions, drawn like the calendar on my profile. */
export function GithubContributions() {
  const [data, setData] = useState<Contributions | null>(cachedContributions);

  useEffect(() => {
    let active = true;
    loadContributions().then((next) => {
      if (active) setData(next);
    });
    return () => {
      active = false;
    };
  }, []);

  if (data && !data.days.length) return null;

  const weeks = toWeeks(data?.days ?? []);
  const stats = data && contributionStats(data.days);
  const lastDate = data?.days[data.days.length - 1]?.date;

  return (
    <div className="border border-border rounded-md bg-secondary p-3 sm:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3 text-sm">
        <span className="text-muted-foreground">
          {data ? (
            <>
              <CountUp value={data.total} className="font-bold text-primary" /> contributions in
              the last year
            </>
          ) : (
            "Loading GitHub activity…"
          )}
        </span>
        <a
          href={SOCIALS.github}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs hover:text-accent transition-colors"
        >
          <Github size={14} /> View on GitHub
        </a>
      </div>

      {stats && (
        <div className="grid grid-cols-3 gap-2 mb-3 pb-3 border-b border-dashed border-border">
          <Stat label="Current streak" value={stats.current} unit={stats.current === 1 ? "day" : "days"} />
          <Stat label="Longest streak" value={stats.longest} unit={stats.longest === 1 ? "day" : "days"} />
          {stats.best && (
            <Stat label="Best day" value={stats.best.count} unit={`on ${formatDay(stats.best.date, false)}`} />
          )}
        </div>
      )}

      {data ? (
        <svg
          viewBox={`0 0 ${LEFT + weeks.length * STEP} ${TOP + 7 * STEP}`}
          className="w-full h-auto text-muted-foreground"
          role="img"
          aria-label={`${data.total} GitHub contributions in the last year`}
        >
          {monthLabels(weeks).map(({ week, label }) => (
            <text key={week} x={LEFT + week * STEP} y={10} fontSize={9} fill="currentColor">
              {label}
            </text>
          ))}
          {WEEKDAYS.map((label, d) =>
            label ? (
              <text key={d} x={0} y={TOP + d * STEP + 8.5} fontSize={9} fill="currentColor">
                {label}
              </text>
            ) : null
          )}
          {weeks.map((week, w) =>
            week.map((day, d) => {
              if (!day) return null;
              const delay = (w + d) * STAGGER_MS;
              const isToday = day.date === lastDate;
              return (
                <rect
                  key={day.date}
                  x={LEFT + w * STEP}
                  y={TOP + d * STEP}
                  width={CELL}
                  height={CELL}
                  rx={2}
                  className={`${isToday ? "contrib-today" : "contrib-cell"} ${
                    LEVEL_STYLES[day.level] ?? LEVEL_STYLES[0]
                  } stroke-black/5 dark:stroke-white/5`}
                  style={{
                    animationDelay: isToday ? `${delay}ms, ${delay + 400}ms` : `${delay}ms`,
                  }}
                >
                  <title>{isToday ? `${describe(day)} (today)` : describe(day)}</title>
                </rect>
              );
            })
          )}
        </svg>
      ) : (
        <div className="h-24 sm:h-28 rounded bg-muted/50 animate-pulse" />
      )}

      {data && (
        <div className="flex items-center justify-end gap-1 mt-2 text-[0.6rem] sm:text-xs text-muted-foreground">
          Less
          {LEVEL_STYLES.map((style, i) => (
            <svg key={i} viewBox="0 0 10 10" className="h-2.5 w-2.5">
              <rect width={10} height={10} rx={2} className={style} />
            </svg>
          ))}
          More
        </div>
      )}
    </div>
  );
}
