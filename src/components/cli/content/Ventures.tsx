"use client";

import { Fragment } from "react";
import { projects, projectSlug } from "@/data/projects";
import { runCliCommand } from "@/lib/cli-events";

export const ventures = projects.filter(p => p.role === "Founder");

/** Inline, clickable "Quinas, Freelens and Roastly" — each opens its works page. */
export function VentureLinks() {
    return (
        <>
            {ventures.map((venture, index) => (
                <Fragment key={venture.title}>
                    {index > 0 && (index === ventures.length - 1 ? " and " : ", ")}
                    <button
                        type="button"
                        onClick={() => runCliCommand(`works ${projectSlug(venture.title)}`)}
                        className="font-bold text-primary hover:underline"
                    >
                        {venture.title}
                    </button>
                </Fragment>
            ))}
        </>
    );
}
