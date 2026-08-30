"use client";

import * as React from "react";
import { Mail, Github, Linkedin, PhoneCall, Calendar, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { SOCIALS } from "@/data/site";

interface ContactEntry {
    icon: React.ElementType;
    label: string;
    value: string;
    href?: string;
    /** Text placed on the clipboard. Omit for entries that are link-only. */
    copy?: string;
}

const contacts: ContactEntry[] = [
    {
        icon: Mail,
        label: 'Email',
        value: SOCIALS.email,
        href: `mailto:${SOCIALS.email}`,
        copy: SOCIALS.email,
    },
    {
        icon: Github,
        label: 'GitHub',
        value: 'zxcoding123',
        href: SOCIALS.github,
        copy: SOCIALS.github,
    },
    {
        icon: Linkedin,
        label: 'LinkedIn',
        value: 'Ahmad Aquino',
        href: SOCIALS.linkedin,
        copy: SOCIALS.linkedin,
    },
    {
        icon: PhoneCall,
        label: 'Phone',
        value: '+639536640199',
        href: 'tel:+639536640199',
        copy: '+639536640199',
    },
    {
        icon: PhoneCall,
        label: 'Phone',
        value: '+639350771951',
        href: 'tel:+639350771951',
        copy: '+639350771951',
    },
];

export function Contact() {
    const { toast } = useToast();
    // Which row most recently showed the ✓ tick.
    const [copied, setCopied] = React.useState<string | null>(null);

    const handleCopy = async (entry: ContactEntry) => {
        if (!entry.copy) return;

        try {
            await navigator.clipboard.writeText(entry.copy);
            setCopied(entry.value);
            trackEvent("contact_copied", { type: entry.label.toLowerCase() });
            toast({
                title: `${entry.label} copied`,
                description: entry.copy,
            });
            window.setTimeout(
                () => setCopied(prev => (prev === entry.value ? null : prev)),
                2000
            );
        } catch {
            // Clipboard needs a secure context; fall back to telling them why.
            toast({
                variant: "destructive",
                title: "Could not copy",
                description: "Your browser blocked clipboard access — copy it manually.",
            });
        }
    };

    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-4">Contact Me</h2>
            <p>You can reach me through the following channels:</p>
            <ul className="mt-2 space-y-2">
                {contacts.map(contact => (
                    <li key={`${contact.label}-${contact.value}`} className="flex items-center gap-3 sm:gap-4">
                        <contact.icon className="text-primary shrink-0" size={20} />
                        <span className="w-16 sm:w-20 shrink-0">{contact.label}:</span>

                        {contact.href ? (
                            <a
                                href={contact.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                    trackEvent("contact_clicked", { type: contact.label.toLowerCase() })
                                }
                                className="text-foreground hover:text-accent hover:underline transition-colors break-all"
                            >
                                {contact.value}
                            </a>
                        ) : (
                            <span className="break-all">{contact.value}</span>
                        )}

                        {contact.copy && (
                            <button
                                type="button"
                                onClick={() => handleCopy(contact)}
                                aria-label={`Copy ${contact.label}`}
                                title={`Copy ${contact.label}`}
                                className="shrink-0 text-muted-foreground hover:text-accent transition-colors p-1 rounded"
                            >
                                {copied === contact.value ? (
                                    <Check size={15} className="text-green-500" />
                                ) : (
                                    <Copy size={15} />
                                )}
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <div className="mt-6">
                <a
                    href={SOCIALS.calendly}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackEvent("contact_clicked", { type: "calendly" })}
                    className="inline-flex items-center gap-2 bg-accent text-black px-4 py-2 rounded-md hover:bg-accent/90 transition-all font-semibold"
                >
                    <Calendar size={18} />
                    Schedule a Meeting
                </a>
            </div>
        </div>
    );
}
