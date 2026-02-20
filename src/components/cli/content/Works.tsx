'use client';

import { Github, Link as LinkIcon } from 'lucide-react';
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
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
import { projects } from "@/data/projects";

const filters = ["web", "fullstack", "design", "mobile", "ai", "ongoing", "completed"];

export function Works() {

    // ✅ State MUST be inside the component
    const [activeFilters, setActiveFilters] = React.useState<string[]>([]);

    const toggleFilter = (f: string) => {
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
          activeFilters.includes("completed") && p.status === "completed";

        // If user selected only status filters
        if (
          activeFilters.includes("ongoing") ||
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


    return (
        <div className="px-4">
            <h2 className="text-xl font-bold text-accent">My Works</h2>
            <h2 className="text-l font-bold mb-4 mt-2">Filters: </h2>
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

            <div className="space-y-6">
                {filteredProjects.map(p => (
                    <div key={p.title} className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-md bg-secondary">

                        {/* IMAGES */}
                        <Dialog>
                            <DialogTrigger asChild>
                                <div className="w-full md:w-1/3 cursor-pointer">
                                    <Carousel
                                        plugins={[Autoplay({ delay: 2000 })]}
                                    >
                                   <CarouselContent>
  {p.images.map((image, index) => (
    <CarouselItem key={index}>
      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-md">
        <img
          src={image}
          alt={`${p.title} - ${index + 1}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </CarouselItem>
  ))}
</CarouselContent>

                                    </Carousel>
                                </div>
                            </DialogTrigger>

                            <DialogContent className="max-w-screen-md">
                                <DialogHeader>
                                    <DialogTitle>{p.title}</DialogTitle>
                                </DialogHeader>

                                <Carousel
                                    plugins={[Autoplay({ delay: 3000 })]}
                                    opts={{ loop: true }}
                                >
                                    <CarouselContent>
                                        {p.images.map((image, index) => (
                                            <CarouselItem key={index}>
                                                <img
                                                    src={image}
                                                    alt={`${p.title} - ${index + 1}`}
                                                    className="object-contain w-full h-full rounded-md"
                                                />
                                            </CarouselItem>
                                        ))}
                                    </CarouselContent>

                                    <CarouselPrevious />
                                    <CarouselNext />
                                </Carousel>
                            </DialogContent>
                        </Dialog>


                        {/* DETAILS */}
                        <div className="w-full md:w-2/3 flex flex-col">
                           <div className="flex items-center gap-2">
  <h3 className="font-bold text-lg text-primary">{p.title}</h3>

  {p.status === "ongoing" && (
    <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-500/15 text-yellow-500 border border-yellow-500/30">
      Ongoing
    </span>
  )}

  {p.status === "completed" && (
    <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/15 text-green-500 border border-green-500/30">
      Completed
    </span>
  )}
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

                     <div className="flex gap-4 text-sm">
  {/* Repository */}
  {p.repo ? (
    <a
      href={p.repo}
      target="_blank"
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
  {p.live ? (
    <a
      href={p.live}
      target="_blank"
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

                        </div>

                    </div>
                ))}
            </div>
        </div>
    );
}
