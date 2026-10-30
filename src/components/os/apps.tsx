"use client";

import React from "react";
import Image from "next/image";
import { Download, ExternalLink, FileText, Github, Linkedin, Mail, TerminalSquare, Trash2 } from "lucide-react";
import { GithubContributions } from "@/components/GithubContributions";
import { trackEvent } from "@/lib/analytics";
import { RESUME, SITE, SOCIALS } from "@/data/site";
import type { Rect } from "./AppWindow";
import { TITLE_BAR_ACTION } from "./WindowChrome";

export type AppId = "terminal" | "resume" | "github" | "linkedin" | "trash";

/** Mirrors --dock-space in globals.css, plus a little breathing room. */
const DOCK_PX = 76 + 16;

/** A window of up to `w`×`h`, centred in the space above the dock and nudged by `offset`. */
function centred(w: number, h: number, offset: number): () => Rect {
  return () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight - DOCK_PX;
    const width = Math.min(w, vw - 32);
    const height = Math.min(h, vh - 32);
    return { w: width, h: height, x: (vw - width) / 2 + offset, y: Math.max(16, (vh - height) / 2 + offset) };
  };
}

interface AppMeta {
  title: string;
  icon: React.ElementType;
  /** Undefined for the terminal, which starts in page flow. */
  defaultRect?: () => Rect;
}

export const APPS: Record<AppId, AppMeta> = {
  terminal: { title: "ahmad.bat", icon: TerminalSquare },
  resume: { title: "resume.pdf", icon: FileText, defaultRect: centred(820, 1000, 0) },
  github: { title: "github.com/zxcoding123", icon: Github, defaultRect: centred(860, 480, 32) },
  linkedin: { title: "LinkedIn", icon: Linkedin, defaultRect: centred(560, 480, 48) },
  trash: { title: "Recycle Bin", icon: Trash2, defaultRect: centred(460, 300, 64) },
};

/** Title-bar actions for the resume window. */
export function ResumeActions() {
  return (
    <>
      <a
        href={RESUME.downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("resume_downloaded", { source: "resume_window" })}
        className={TITLE_BAR_ACTION}
        title="Download PDF"
      >
        <Download className="h-3 w-3" />
        <span className="hidden sm:inline">download</span>
      </a>
      <a
        href={RESUME.viewUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={TITLE_BAR_ACTION}
        aria-label="Open resume in a new tab"
        title="Open in a new tab"
      >
        <ExternalLink className="h-3 w-3" />
      </a>
    </>
  );
}

export function ResumeApp() {
  return (
    <iframe
      src={RESUME.previewUrl}
      title="Ahmad Aquino's resume"
      allow="autoplay"
      className="block w-full h-full border-0 bg-white"
    />
  );
}

/** Title-bar button that opens the real site in a new browser tab. */
function NewTabAction({ href, site }: { href: string; site: "github" | "linkedin" }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackEvent("social_clicked", { type: site, source: `${site}_window` })}
      className={TITLE_BAR_ACTION}
      aria-label={`Open ${site === "github" ? "GitHub" : "LinkedIn"} profile in a new tab`}
      title="Open in a new tab"
    >
      <ExternalLink className="h-3 w-3" />
      <span className="hidden sm:inline">new tab</span>
    </a>
  );
}

const PRIMARY_BUTTON =
  "inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-sm";

export function GithubActions() {
  return <NewTabAction href={SOCIALS.github} site="github" />;
}

export function GithubApp() {
  return (
    <div className="p-4 sm:p-6 flex flex-col gap-4">
      <GithubContributions />
      <a
        href={SOCIALS.github}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackEvent("social_clicked", { type: "github", source: "github_window" })}
        className={`${PRIMARY_BUTTON} self-start`}
      >
        <Github size={16} /> View full profile on GitHub
      </a>
    </div>
  );
}

export function LinkedinActions() {
  return <NewTabAction href={SOCIALS.linkedin} site="linkedin" />;
}

/** LinkedIn refuses to be framed, so this window is a profile card that links out. */
export function LinkedinApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-3 p-6 text-center">
      <Image src="/logo.png" alt="" width={72} height={72} className="rounded-full border-2 border-primary" />
      <div>
        <p className="text-lg font-bold">{SITE.name}</p>
        <p className="text-sm text-accent">{SITE.role}</p>
      </div>
      <p className="text-sm text-muted-foreground max-w-md">{SITE.bio}</p>
      <div className="flex flex-wrap justify-center gap-3 mt-1">
        <a
          href={SOCIALS.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackEvent("social_clicked", { type: "linkedin", source: "linkedin_window" })}
          className={PRIMARY_BUTTON}
        >
          <Linkedin size={16} /> View on LinkedIn
        </a>
        <a
          href={`mailto:${SOCIALS.email}`}
          onClick={() => trackEvent("contact_clicked", { type: "email", source: "linkedin_window" })}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-secondary hover:border-primary transition-colors font-semibold text-sm"
        >
          <Mail size={16} /> Email me
        </a>
      </div>
    </div>
  );
}

export function TrashApp() {
  return (
    <div className="h-full flex flex-col items-center justify-center gap-2 p-6 text-center">
      <Trash2 className="h-10 w-10 text-muted-foreground" />
      <p className="font-bold">Recycle Bin is empty</p>
      <p className="text-sm text-muted-foreground">Bugs get fixed, not binned.</p>
    </div>
  );
}
