"use client";

import { Download, ExternalLink, Mail, Calendar } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { RESUME, SOCIALS, SITE } from "@/data/site";

/** Output of the `resume` command. */
export function Resume() {
    return (
        <div className="w-full">
            <h2 className="text-xl font-bold text-accent">Resume</h2>
            <p className="text-sm text-muted-foreground mt-1 mb-4">
                {SITE.name} — {SITE.role}. View it in the browser or grab the PDF.
            </p>

            <div className="flex flex-wrap gap-3">
                <a
                    href={RESUME.viewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_viewed", { source: "resume_command" })}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-semibold text-sm"
                >
                    <ExternalLink size={16} /> View resume
                </a>

                <a
                    href={RESUME.downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("resume_downloaded", { source: "resume_command" })}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border bg-secondary hover:border-primary transition-colors font-semibold text-sm"
                >
                    <Download size={16} /> Download PDF
                </a>
            </div>

            <div className="mt-5 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground mb-2">
                    Hiring, or want to talk through a project?
                </p>
                <div className="flex flex-wrap gap-4 text-sm">
                    <a
                        href={`mailto:${SOCIALS.email}`}
                        onClick={() => trackEvent("contact_clicked", { type: "email", source: "resume" })}
                        className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                    >
                        <Mail size={16} /> {SOCIALS.email}
                    </a>
                    <a
                        href={SOCIALS.calendly}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent("contact_clicked", { type: "calendly", source: "resume" })}
                        className="inline-flex items-center gap-1 hover:text-accent transition-colors"
                    >
                        <Calendar size={16} /> Book 30 minutes
                    </a>
                </div>
            </div>
        </div>
    );
}
