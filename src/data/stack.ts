// data/stack.ts
//
// The tech stack, in one place. Rendered by the `stack` command and by the
// Skills section of `about` so the two can never drift apart.

export interface StackGroup {
    /** Group heading, e.g. "Languages". */
    label: string;
    items: string[];
}

export const stack: StackGroup[] = [
    {
        label: "Languages",
        items: ["JavaScript (ES6+)", "TypeScript", "PHP", "Python", "HTML5", "CSS3"],
    },
    {
        label: "Frameworks & Libraries",
        items: [
            "React",
            "Next.js",
            "Svelte",
            "Laravel",
            "Node.js",
            "Vite",
            "Tailwind CSS",
            "Bootstrap",
        ],
    },
    {
        label: "Databases & Backend",
        items: ["MySQL", "SQLite", "Firebase", "Supabase", "REST APIs", "PHP (PDO)"],
    },
    {
        label: "Tools & Platforms",
        items: ["Git", "Docker", "Vercel", "Firebase", "Webflow", "n8n"],
    },
    {
        label: "Performance & Analytics",
        items: [
            "Google Lighthouse",
            "Umami",
            "Google Search Console",
            "SurferSEO",
        ],
    },
    {
        label: "Other",
        items: ["Responsive Design", "AJAX", "SEO", "Content Writing"],
    },
];
