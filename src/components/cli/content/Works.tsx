'use client';

import { Github, Link as LinkIcon, LayoutGrid, List, Rows3, ChevronDown, ArrowLeft } from 'lucide-react';
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { trackEvent } from "@/lib/analytics";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { findProject, projectSlug, type Project } from "@/data/projects";
import { useProjectActivity } from "@/hooks/use-project-activity";
import { formatRelative, type ActiveProject } from "@/lib/projectActivity";
import { runCliCommand } from "@/lib/cli-events";

const filters = ["web", "fullstack", "design", "mobile", "ai", "ongoing", "automation", "completed"];

const VIEW_MODES = ["cards", "grid", "list"] as const;
type ViewMode = (typeof VIEW_MODES)[number];
const VIEW_STORAGE_KEY = "works-view-mode";

const isViewMode = (value: unknown): value is ViewMode =>
    VIEW_MODES.includes(value as ViewMode);

function StatusBadge({ status }: { status: Project["status"] }) {
    if (status === "ongoing") {
        return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">
                Ongoing
            </span>
        );
    }

    if (status === "completed") {
        return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/30">
                Completed
            </span>
        );
    }

    if (status === "stable") {
        return (
            <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-500 border border-blue-500/30">
                Stable
            </span>
        );
    }

    return null;
}

/**
 * "updated 3 days ago" stamp. `mounted` gates it because relative time differs
 * between the server render and the client, which would trip hydration.
 */
function UpdatedStamp({
    project,
    mounted,
}: {
    project: ActiveProject;
    mounted: boolean;
}) {
    if (!mounted) return null;

    return (
        <span className="text-xs text-muted-foreground">
            updated {formatRelative(project.effectiveUpdatedAt)}
            {project.isLive && <span className="text-green-500"> · from GitHub</span>}
        </span>
    );
}

/** Thumbnail carousel that opens the full-size lightbox. Shared by both card views. */
function ProjectMedia({
    project,
    className,
}: {
    project: Project;
    className?: string;
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <div
                    className={cn("cursor-pointer", className)}
                    onClick={() =>
                        trackEvent("project_viewed", {
                            project: project.title,
                            status: project.status,
                            categories: project.category.join(",")
                        })
                    }
                >
                    <Carousel plugins={[Autoplay({ delay: 2000 })]}>
                        <CarouselContent>
                            {project.images.map((image, index) => (
                                <CarouselItem key={index}>
                                    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
                                        <img
                                            src={image}
                                            alt={`${project.title} - ${index + 1}`}
                                            className="absolute inset-0 w-full h-full object-cover"
                                        />
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </div>
            </DialogTrigger>

            <DialogContent className="max-w-screen-lg">
                <DialogHeader>
                    <DialogTitle>{project.title}</DialogTitle>
                </DialogHeader>

                <Carousel
                    plugins={[Autoplay({ delay: 3000 })]}
                    opts={{ loop: true }}
                >
                    <CarouselContent>
                        {project.images.map((image, index) => (
                            <CarouselItem key={index}>
                                <img
                                    src={image}
                                    alt={`${project.title} - ${index + 1}`}
                                    className="object-contain w-full h-full aspect-[16/9] rounded-md"
                                />
                            </CarouselItem>
                        ))}
                    </CarouselContent>

                    <CarouselPrevious />
                    <CarouselNext />
                </Carousel>
            </DialogContent>
        </Dialog>
    );
}

function ProjectLinks({ project }: { project: Project }) {
    return (
        <div className="flex gap-4 text-sm">
            {/* Repository */}
            {project.repo ? (
                <a
                    href={project.repo}
                    target="_blank"
                    onClick={() =>
                        trackEvent("project_link_clicked", {
                            project: project.title,
                            type: "repo"
                        })
                    }
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                >
                    <Github size={16} /> Repository
                </a>
            ) : (
                <span className="flex items-center gap-1 text-muted-foreground cursor-not-allowed opacity-50">
                    <Github size={16} /> Repository
                </span>
            )}

            {/* Live Demo */}
            {project.live ? (
                <a
                    href={project.live}
                    target="_blank"
                    onClick={() =>
                        trackEvent("project_link_clicked", {
                            project: project.title,
                            type: "live"
                        })
                    }
                    className="flex items-center gap-1 hover:text-accent transition-colors"
                >
                    <LinkIcon size={16} /> Live Demo
                </a>
            ) : (
                <span className="flex items-center gap-1 text-muted-foreground cursor-not-allowed opacity-50">
                    <LinkIcon size={16} /> Live Demo
                </span>
            )}
        </div>
    );
}

/** Project title that opens the detail view by re-running `works <slug>`
 *  through the Terminal, so the deep link and the click share one code path. */
function ProjectTitle({
    project,
    className,
}: {
    project: Project;
    className?: string;
}) {
    return (
        <button
            type="button"
            onClick={() => runCliCommand(`works ${projectSlug(project.title)}`)}
            title={`Open ${project.title}`}
            className={cn(
                "font-bold text-primary text-left hover:underline decoration-dotted underline-offset-4 hover:text-accent transition-colors",
                className
            )}
        >
            {project.title}
        </button>
    );
}

/** Full-page view for a single project — the output of `works <slug>`. */
function ProjectDetail({
    project,
    mounted,
}: {
    project: ActiveProject;
    mounted: boolean;
}) {
    return (
        <div className="px-4">
            <button
                type="button"
                onClick={() => runCliCommand("works")}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors mb-4"
            >
                <ArrowLeft size={14} /> All works
            </button>

            <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-accent">{project.title}</h2>
                <StatusBadge status={project.status} />
                <UpdatedStamp project={project} mounted={mounted} />
            </div>

            <div className="mt-4 border border-border rounded-md bg-secondary p-4">
                <ProjectMedia project={project} className="w-full" />

                <p className="text-sm text-muted-foreground mt-4">
                    {project.description}
                </p>

                {project.highlights?.length ? (
                    <ul className="mt-4 space-y-1.5 list-disc list-inside">
                        {project.highlights.map(point => (
                            <li key={point} className="text-sm text-muted-foreground">
                                {point}
                            </li>
                        ))}
                    </ul>
                ) : null}

                <div className="mt-4">
                    <h3 className="text-xs font-bold text-primary uppercase tracking-wide mb-2">
                        Built with
                    </h3>
                    <div className="flex gap-2 flex-wrap">
                        {project.tags.map(tag => (
                            <span key={tag} className="text-xs bg-background/50 px-2 py-1 rounded">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t border-border">
                    <ProjectLinks project={project} />
                </div>
            </div>
        </div>
    );
}

export function Works({ query = "" }: { query?: string } = {}) {

    // Sorted newest-first, with live GitHub push dates layered over `updatedAt`.
    const { projects, mounted } = useProjectActivity();

    // ✅ State MUST be inside the component
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);
    const [view, setView] = React.useState<ViewMode>("cards");

    // Grid cards collapse by default so rows stay even; expansion is per card.
    const [expandedCards, setExpandedCards] = React.useState<Set<string>>(
        () => new Set()
    );

    const toggleCard = (title: string) => {
        setExpandedCards(prev => {
            const next = new Set(prev);
            const isOpen = next.has(title);
            if (isOpen) {
                next.delete(title);
            } else {
                next.add(title);
            }
            trackEvent("project_card_toggled", {
                project: title,
                expanded: !isOpen,
            });
            return next;
        });
    };

    // Restore the last chosen view (per browser) after hydration.
    React.useEffect(() => {
        try {
            const saved = window.localStorage.getItem(VIEW_STORAGE_KEY);
            if (isViewMode(saved)) setView(saved);
        } catch {
            // storage blocked (private mode) — keep the default
        }
    }, []);

    const changeView = (next: ViewMode) => {
        setView(next);
        trackEvent("project_view_mode_changed", { view: next });
        try {
            window.localStorage.setItem(VIEW_STORAGE_KEY, next);
        } catch {
            // ignore — the choice simply will not persist
        }
    };

    const toggleFilter = (f: string) => {
          trackEvent("project_filter_used", { filter: f });
        setActiveFilters(prev =>
            prev.includes(f)
                ? prev.filter(x => x !== f)
                : [...prev, f]
        );
    };

 const filteredProjects =
  activeFilters.length === 0
    ? projects
    : projects.filter(p => {
        const matchesCategory = p.category.some(c =>
          activeFilters.includes(c)
        );

        const matchesStatus =
          activeFilters.includes("ongoing") && p.status === "ongoing" ||
           activeFilters.includes("ongoing") && p.status === "stable" ||
          activeFilters.includes("completed") && p.status === "completed";

        // If user selected only status filters
        if (
          activeFilters.includes("ongoing") ||
            activeFilters.includes("stable") ||
          activeFilters.includes("completed")
        ) {
          // Allow combination of category + status
          return matchesStatus && (
            activeFilters.some(f =>
              ["web", "fullstack", "design", "mobile", "ai"].includes(f)
            )
              ? matchesCategory
              : true
          );
        }

        // Category-only filtering
        return matchesCategory;
      });

    // `works <slug>` — one project, in full. Every hook above has already run,
    // so returning here is safe.
    const requested = query.trim();
    if (requested) {
        const match = findProject(requested, projects);

        if (match) {
            return <ProjectDetail project={match} mounted={mounted} />;
        }

        return (
            <div className="px-4">
                <p className="text-sm">
                    No project matches{" "}
                    <span className="text-accent-foreground bg-accent px-1 rounded">
                        {requested}
                    </span>
                    .
                </p>
                <p className="text-sm text-muted-foreground mt-2 mb-2">Try one of these:</p>
                <div className="flex gap-2 flex-wrap">
                    {projects.map(p => (
                        <button
                            key={p.title}
                            type="button"
                            onClick={() => runCliCommand(`works ${projectSlug(p.title)}`)}
                            className="text-xs bg-secondary border border-border px-2 py-1 rounded hover:border-primary hover:text-accent transition-colors"
                        >
                            {projectSlug(p.title)}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            <h2 className="text-xl font-bold text-accent">My Works</h2>
            <p className="text-xs text-muted-foreground mt-1">
                Sorted by most recently worked on.
            </p>

            <div className="flex flex-wrap items-center justify-between gap-2 mb-4 mt-2">
                <h2 className="text-l font-bold">Filters: </h2>

                {/* VIEW TOGGLE */}
                <div className="flex items-center gap-1 border border-border rounded-full p-1 bg-secondary">
                    {([
                        { mode: "cards", label: "Cards", Icon: Rows3 },
                        { mode: "grid", label: "Grid", Icon: LayoutGrid },
                        { mode: "list", label: "List", Icon: List },
                    ] as const).map(({ mode, label, Icon }) => (
                        <Button
                            key={mode}
                            variant={view === mode ? "default" : "ghost"}
                            onClick={() => changeView(mode)}
                            aria-pressed={view === mode}
                            className="text-xs px-3 py-1 h-auto rounded-full flex items-center gap-1"
                        >
                            <Icon size={14} /> {label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="flex gap-2 mb-6 flex-wrap">

                {filters.map(f => (
                    <Button
                        key={f}
                        variant={activeFilters.includes(f) ? "default" : "outline"}
                        onClick={() => toggleFilter(f)}
                        className="text-xs px-3 py-1 rounded-full"
                    >
                        {f}
                    </Button>
                ))}
            </div>

            {view === "list" ? (
                /* LIST VIEW — no cards, no images */
                <div className="divide-y divide-border border-t border-border">
                    {filteredProjects.map(p => (
                        <div key={p.title} className="py-4">
                            <div className="flex flex-wrap items-center gap-2">
                                <ProjectTitle project={p} className="text-base" />
                                <StatusBadge status={p.status} />
                                <UpdatedStamp project={p} mounted={mounted} />
                            </div>

                            <p className="text-sm text-muted-foreground mt-1 mb-2">
                                {p.description}
                            </p>

                            <div className="flex items-center justify-between flex-wrap gap-2">
                                <span className="text-xs text-muted-foreground">
                                    {p.tags.join(" · ")}
                                </span>
                                <ProjectLinks project={p} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : view === "grid" ? (
                /* GRID VIEW — compact cards, image on top */
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 items-start">
                    {filteredProjects.map(p => {
                        const isExpanded = expandedCards.has(p.title);

                        return (
                            <div key={p.title} className="flex flex-col border border-border p-4 rounded-md bg-secondary">

                                <ProjectMedia project={p} className="w-full mb-3" />

                                <div className="flex flex-wrap items-center gap-2">
                                    <ProjectTitle project={p} className="text-base" />
                                    <StatusBadge status={p.status} />
                                </div>

                                <UpdatedStamp project={p} mounted={mounted} />

                                {/* Clamped while collapsed so every card in a row is the same height. */}
                                <p
                                    className={cn(
                                        "text-sm text-muted-foreground mt-1 mb-2",
                                        isExpanded ? "" : "line-clamp-3 flex-grow"
                                    )}
                                >
                                    {p.description}
                                </p>

                                {isExpanded && (
                                    <div className="flex gap-2 flex-wrap mb-3 animate-fade-in">
                                        {p.tags.map(tag => (
                                            <span key={tag} className="text-xs bg-background/50 px-2 py-1 rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <button
                                    type="button"
                                    onClick={() => toggleCard(p.title)}
                                    aria-expanded={isExpanded}
                                    className="self-start flex items-center gap-1 text-xs text-muted-foreground hover:text-accent transition-colors mb-3"
                                >
                                    {isExpanded ? "Show less" : `Show more (${p.tags.length} tags)`}
                                    <ChevronDown
                                        size={14}
                                        className={cn(
                                            "transition-transform",
                                            isExpanded && "rotate-180"
                                        )}
                                    />
                                </button>

                                <ProjectLinks project={p} />

                            </div>
                        );
                    })}
                </div>
            ) : (
                /* CARD VIEW — full-width rows, image beside the details */
                <div className="space-y-6">
                    {filteredProjects.map(p => (
                        <div key={p.title} className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-md bg-secondary">

                            {/* IMAGES */}
                            <ProjectMedia project={p} className="w-full md:w-1/3" />

                            {/* DETAILS */}
                            <div className="w-full md:w-2/3 flex flex-col">
                                <div className="flex flex-wrap items-center gap-2">
                                    <ProjectTitle project={p} className="text-lg" />
                                    <StatusBadge status={p.status} />
                                    <UpdatedStamp project={p} mounted={mounted} />
                                </div>


                                <p className="text-sm text-muted-foreground mb-2 flex-grow">
                                    {p.description}
                                </p>

                                <div className="flex gap-2 flex-wrap mb-3">
                                    {p.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-background/50 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>

                                <ProjectLinks project={p} />

                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
