"use client";

import { COMMAND_LIST } from "@/data/commands";
import { runCliCommand } from "@/lib/cli-events";

export function Help() {
    return (
        <div className="w-full">
            <p className="mb-2">Here are the available commands:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                {COMMAND_LIST.map(({ cmd, desc }) => (
                    <li key={cmd} className="flex items-baseline gap-2">
                        <button
                            type="button"
                            onClick={() => runCliCommand(cmd)}
                            title={`Run ${cmd}`}
                            className="w-24 shrink-0 text-left text-accent-foreground bg-accent px-1 rounded hover:opacity-80 transition-opacity"
                        >
                            {cmd}
                        </button>
                        <span className="flex-1">{desc}</span>
                    </li>
                ))}
            </ul>

            <p className="text-xs text-muted-foreground mt-4">
                Tip: any command can be linked directly — add{" "}
                <span className="text-accent-foreground bg-accent px-1 rounded">?cmd=works</span>{" "}
                to the URL to open it on load.
            </p>
        </div>
    );
}
