"use client";

import * as React from "react";
import { trackEvent } from "@/lib/analytics";
import { stack } from "@/data/stack";
import { Button } from "@/components/ui/button";

/** Output of the `stack` command (alias `uses`). The same data backs the
 *  Skills section of `about`, so the two cannot drift. */
export function Stack() {
    const [activeGroup, setActiveGroup] = React.useState<string | null>(null);

    const visible = activeGroup
        ? stack.filter(g => g.label === activeGroup)
        : stack;

    const total = stack.reduce((sum, g) => sum + g.items.length, 0);

    const selectGroup = (label: string | null) => {
        setActiveGroup(label);
        if (label) trackEvent("stack_group_filtered", { group: label });
    };

    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-accent">Stack</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
                {total} tools across {stack.length} groups — the things I actually reach for.
            </p>

            <div className="flex gap-2 flex-wrap mb-5">
                <Button
                    variant={activeGroup === null ? "default" : "outline"}
                    onClick={() => selectGroup(null)}
                    className="text-xs px-3 py-1 rounded-full"
                >
                    all
                </Button>
                {stack.map(group => (
                    <Button
                        key={group.label}
                        variant={activeGroup === group.label ? "default" : "outline"}
                        onClick={() =>
                            selectGroup(activeGroup === group.label ? null : group.label)
                        }
                        className="text-xs px-3 py-1 rounded-full"
                    >
                        {group.label}
                    </Button>
                ))}
            </div>

            <div className="space-y-4">
                {visible.map(group => (
                    <div key={group.label}>
                        <h3 className="font-bold text-primary text-sm mb-2">
                            {group.label}
                            <span className="text-muted-foreground font-normal ml-2">
                                ({group.items.length})
                            </span>
                        </h3>
                        <div className="flex gap-2 flex-wrap">
                            {group.items.map(item => (
                                <span
                                    key={item}
                                    className="text-xs bg-secondary border border-border px-2 py-1 rounded"
                                >
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
