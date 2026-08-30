"use client";

import { trackEvent } from "@/lib/analytics";
import { stack } from "@/data/stack";
import { RESUME } from "@/data/site";
import { runCliCommand } from "@/lib/cli-events";

const MACH =
    "Issued by the Department of Information Technology through the Modern Academics Convergence Hub";
const ANTHROPIC = "Issued by Skilljar and Anthropic Education";

const certifications = [
    {
        name: "Programming for Intermediate Users using Python",
        issuer: MACH,
        url: "https://drive.google.com/file/d/1y60liDqfswf-MxQJx0Jw1fm7yIoo5BBj/view?usp=sharing",
    },
    {
        name: "Build Python Web Apps with Flask",
        issuer: MACH,
        url: "https://drive.google.com/file/d/1FHjpJjFWRrdSX0MH-x6WjnJsWfa7RfUu/view?usp=sharing",
    },
    {
        name: "Visualize Data with Python",
        issuer: MACH,
        url: "https://drive.google.com/file/d/1yx2S2SwCY-sjOJxUoMoxWRDe1_zrpi-U/view?usp=sharing",
    },
    {
        name: "Analyze Data with Python",
        issuer: MACH,
        url: "https://drive.google.com/file/d/18606u7GqyeplITWNlTm-zgMtenkAD_zR/view?usp=sharing",
    },
    {
        name: "Programming for Beginners Data Using Python",
        issuer: MACH,
        url: "https://drive.google.com/file/d/1-gPufhpjy9YoYlVbx1g-k6eH0LRua61w/view?usp=sharing",
    },
    {
        name: "Claude 101",
        issuer: ANTHROPIC,
        url: "https://drive.google.com/file/d/1gxq1hQraGoJyA4w2cXCNcqs4NuUkMDIn/view?usp=sharing",
    },
    {
        name: "Claude Code 101",
        issuer: ANTHROPIC,
        url: "https://drive.google.com/file/d/1zOqLSQN_pdAmObNjXo-CZ3kjqGqnvh9u/view?usp=sharing",
    },
];

export function About() {
    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-2">About Me</h2>

            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-4">
                <p>
                    I am a passionate web developer with a knack for creating beautiful, performant, and accessible user experiences.
                    I love working with modern web technologies and building cool things on the internet.
                    Apart from this, I also enjoy employing SEO best practices, as well as writing and content creation.
                </p>
            </div>

            <a
                href={RESUME.viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent("resume_viewed", { source: "portfolio_button" })}
                className="inline-block mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 dark:bg-primary-dark dark:text-black transition"
            >
                View My Resume
            </a>

            <h3 className="text-lg font-bold text-accent mb-2">Skills</h3>
            <ul className="list-disc list-inside space-y-1">
                {stack.map(group => (
                    <li key={group.label}>
                        <span className="font-bold text-primary">{group.label}: </span>
                        {group.items.join(", ")}
                    </li>
                ))}
            </ul>
            <p className="text-xs text-muted-foreground mt-2">
                Run{" "}
                <button
                    type="button"
                    onClick={() => runCliCommand("stack")}
                    className="text-accent-foreground bg-accent px-1 rounded hover:opacity-80 transition-opacity"
                >
                    stack
                </button>{" "}
                to browse these by group.
            </p>

            <h3 className="text-lg font-bold text-accent mt-6 mb-2">Certifications</h3>
            <ul className="list-disc list-inside space-y-2">
                {certifications.map(cert => (
                    <li key={cert.name} className="text-sm">
                        <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackEvent("certification_viewed", { name: cert.name })}
                            className="text-primary hover:underline font-semibold"
                        >
                            {cert.name}
                        </a>
                        <span className="text-muted-foreground ml-2">— {cert.issuer}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
