// lib/cli-events.ts
//
// Lets content rendered inside the terminal history (project cards, links)
// ask the Terminal to run a command. Command output is stored as inert React
// nodes in `history`, so there is no prop path back to the Terminal — a DOM
// event is the cheapest way across without lifting all of it into context.

const CLI_RUN_EVENT = "cli:run";

/** Ask the Terminal to run `command` as if the visitor had typed it. */
export function runCliCommand(command: string) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(new CustomEvent<string>(CLI_RUN_EVENT, { detail: command }));
}

/** Subscribe the Terminal to those requests. Returns an unsubscribe function. */
export function onCliCommand(handler: (command: string) => void): () => void {
    if (typeof window === "undefined") return () => {};

    const listener = (event: Event) => {
        const command = (event as CustomEvent<string>).detail;
        if (typeof command === "string" && command.trim()) handler(command);
    };

    window.addEventListener(CLI_RUN_EVENT, listener);
    return () => window.removeEventListener(CLI_RUN_EVENT, listener);
}
