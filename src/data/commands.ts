// data/commands.ts
//
// One list of commands, shared by the Terminal (autocomplete + menu) and the
// `help` output. These used to be two hand-synced copies.

export interface CommandInfo {
    cmd: string;
    desc: string;
}

export const COMMAND_LIST: CommandInfo[] = [
    { cmd: "home", desc: "Go to the home page." },
    { cmd: "about", desc: "Learn more about me." },
    { cmd: "works", desc: "View my projects. Usage: works [project]" },
    { cmd: "stack", desc: "Browse the tech I work with." },
    { cmd: "resume", desc: "View or download my resume." },
    { cmd: "now", desc: "See what I am working on right now." },
    { cmd: "contact", desc: "Get my contact information." },
    { cmd: "help", desc: "Display this help message." },
    { cmd: "clear", desc: "Clear the terminal screen." },
    { cmd: "whoami", desc: "Alias for about." },
    { cmd: "projects", desc: "Alias for works." },
    { cmd: "uses", desc: "Alias for stack." },
    { cmd: "cv", desc: "Alias for resume." },
    { cmd: "socials", desc: "Alias for contact." },
    { cmd: "latest", desc: "Alias for now." },
    { cmd: "theme", desc: "Change the color theme. Usage: theme <light|dark|system>" },
];

/** Argument completions for `theme`. */
export const THEME_ARGS: CommandInfo[] = [
    { cmd: "theme light", desc: "Switch to the light theme." },
    { cmd: "theme dark", desc: "Switch to the dark theme." },
    { cmd: "theme system", desc: "Follow the system theme." },
];

/** Commands that take a project slug as an argument. */
export const PROJECT_COMMANDS = ["works", "projects"] as const;
