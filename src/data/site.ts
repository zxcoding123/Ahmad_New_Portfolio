// data/site.ts
//
// Single source of truth for identity, links and SEO copy. Imported by the
// root metadata, the OG image and the `resume` / `contact` commands so a link
// only ever has to change in one place.

/** Public origin, no trailing slash.
 *
 *  Defaults to the production deployment so link previews work out of the box.
 *  Override with NEXT_PUBLIC_SITE_URL when the site moves to a custom domain —
 *  Open Graph images must be absolute URLs, so a wrong value here means no
 *  preview card. The trailing slash is stripped either way. */
export const SITE_URL = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://ahmad-new-portfolio.vercel.app"
).replace(/\/$/, "");

export const SITE = {
    name: "Ahmad Aquino",
    role: "Web Developer",
    /** Browser tab + og:title. */
    title: "Ahmad Aquino — Web Developer",
    /** Shown in search results and link previews. Keep under ~160 characters. */
    description:
        "Interactive CLI portfolio of Ahmad Aquino — web developer building fast, accessible experiences with React, Next.js, Svelte and Laravel.",
    keywords: [
        "Ahmad Aquino",
        "web developer",
        "frontend developer",
        "full stack developer",
        "React",
        "Next.js",
        "Svelte",
        "Laravel",
        "portfolio",
    ],
    locale: "en_US",
} as const;

/** Google Drive file id for the resume PDF. */
const RESUME_FILE_ID = "15lHYJr3AeYEst2u0xhIXrLxtiXTX4F6M";

export const RESUME = {
    viewUrl: `https://drive.google.com/file/d/${RESUME_FILE_ID}/view?usp=sharing`,
    /** Forces a download rather than opening the Drive viewer. */
    downloadUrl: `https://drive.google.com/uc?export=download&id=${RESUME_FILE_ID}`,
} as const;

export const SOCIALS = {
    email: "ahmadaquino.2002@gmail.com",
    github: "https://github.com/zxcoding123",
    linkedin: "https://www.linkedin.com/in/ahmad-aquino-34b318243",
    calendly: "https://calendly.com/ahmadaquino-2002/30min",
} as const;
