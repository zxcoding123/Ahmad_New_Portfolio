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

const filters = ["web", "fullstack", "design", "mobile", "ai", "ongoing", "completed"];



const projects = [
    {
  title: "Tarabasa",
  description: "An ongoing mobile application built for Zamboanga City that helps users discover nearby cafés, review centers, and study hubs. Tarabasa leverages geolocation to surface relevant places based on proximity, enabling students and professionals to find suitable spaces for studying and work.",
  tags: ["Flutter", "Supabase", "Geolocation", "Mobile App", "PostgreSQL"],
  live: "",
  repo: "",
  images: [
    "no-project-picture.png"
  ],
  aiHint: "mobile app for finding nearby study hubs and cafes using geolocation",
  category: ["mobile", "fullstack"],
  status: "ongoing"
},
    {
  title: "rDMS (Records & Document Management System)",
  description: "An enterprise-grade document management system that tracks, organizes, and monitors documents across departments. rDMS provides visibility into document status, ownership, and workflow progression within an organization.",
  tags: ["PostgreSQL", "Express.js", "Tailwind CSS", "JavaScript", "Svelte", "ShadCDN", "Document Workflow"],
  live: "",
  repo: "",
  images: [
    "no-project-picture.png"
  ],
  aiHint: "enterprise document and records management system",
  category: ["web", "fullstack"],
  status: "ongoing"
},

    {
        title: "TRAC Thesis Repository System",
        description: "A web-based repository system for managing and archiving student theses for Tawi-Tawi Regional Argicultural College. The system allows users to submit, browse, and search theses efficiently, while providing administrators tools for review, approval, and organization of research works.",
        tags: ["PHP", "MySQL", "Bootstrap", "JavaScript", "PHP:PDO"],
        live: "https://trac-repository-system.hstn.me/index.php",
        repo: "",
        images: [
            "trac/trac_repo_system.png",

        ],
        aiHint: "web-based student thesis repository system",
        category: ["web", "fullstack", "education"],
        status: "completed"
    },
    {
        title: "Kanvas",
        description: "A visual dashboard builder that allows users to create interactive, customizable data dashboards without writing code. Kanvas empowers teams, students, and organizations to turn raw data into clear, insightful visuals through a drag-and-drop workspace.",
        tags: ["React", "Tailwind", "Node.js"],
        live: "https://kanvas-landing-page.vercel.app/",
        repo: "",
        images: [
            "kanvas/kanvas.png",
        ],
        aiHint: "no-code dashboard builder for data visualization",
        category: ["web", "fullstack", "design"],
        status: "ongoing"
    },

    {
        title: "Lexora",
        description: "A legal support service platform designed to provide client-focused guidance for businesses and individuals. Lexora simplifies legal processes, clarifies complex requirements, and helps clients make confident and informed decisions.",
        tags: ["Webflow", "Webflow CMS"],
        live: "https://lexora-site.webflow.io/",
        repo: "",
        images: [
            "lexora/lexora.png"
        ],
        aiHint: "client-focused legal guidance brand",
        category: ["web", "design"],
        status: "completed"
    },
    {
        title: "LearnMate",
        description: "A mobile app built for freelance teachers and elementary pupils to book video conferencing sessions and engage in e-learning style lessons.",
        tags: ["Flutter", "Firebase", "Agora"],
        live: "",
        repo: "",
        images: [
            "learnmate/learnmate.png"
        ],
        aiHint: "mobile app learning courseware",
        category: ["mobile", "fullstack"],
        status: "completed"
    },
    {
        title: "BitCraft: A Desktop Courseware for e-Learning",
        description: "A desktop courseware built for learners and teachers to learn specific courses made by professional teachers.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "PHP:PDO", "MySQL", "SQLite", "Data-AOS", "Plyr", "DataTables"],
        live: "",
        repo: "",
        images: [
            "bitcraft/bitcraft (1).png",
            "bitcraft/bitcraft (2).png",
            "bitcraft/bitcraft (3).png",
            "bitcraft/bitcraft (4).png",
            "bitcraft/bitcraft (5).png",
            "bitcraft/bitcraft (6).png",
            "bitcraft/bitcraft (7).png",
            "bitcraft/bitcraft (8).png",
            "bitcraft/bitcraft (9).png",
            "bitcraft/bitcraft (10).png",
            "bitcraft/bitcraft (11).png",
            "bitcraft/bitcraft (12).png",
            "bitcraft/bitcraft (13).png",

        ],
        aiHint: "desktop courseware application",
        category: ["web", "fullstack"],
        status: "completed"
    },
    {
        title: "Korean – Innovative Quality Korean-pop Albums Web App",
        description: "An e-commerce web application catering towards buying and selling Korean-pop albums ranging from admin side to client side.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "PHP:PDO", "MySQL", "DataTables", "PayPal API",],
        live: "",
        repo: "",
        images: [
            "kiqna/kiqna (1).png",
            "kiqna/kiqna (2).png",
            "kiqna/kiqna (3).png",
            "kiqna/kiqna (4).png",
            "kiqna/kiqna (5).png",
            "kiqna/kiqna (6).png",
            "kiqna/kiqna (7).png",
            "kiqna/kiqna (8).png",
            "kiqna/kiqna (9).png",
            "kiqna/kiqna (10).png",
            "kiqna/kiqna (11).png",
            "kiqna/kiqna (12).png",
            "kiqna/kiqna (13).png",
            "kiqna/kiqna (14).png",
            "kiqna/kiqna (15).png",
            "kiqna/kiqna (16).png",
            "kiqna/kiqna (17).png",
            "kiqna/kiqna (18).png",
            "kiqna/kiqna (19).png",
            "kiqna/kiqna (20).png",
            "kiqna/kiqna (21).png",
            "kiqna/kiqna (22).png",
            "kiqna/kiqna (23).png",
            "kiqna/kiqna (24).png",
            "kiqna/kiqna (25).png",
            "kiqna/kiqna (26).png",
            "kiqna/kiqna (27).png",
            "kiqna/kiqna (28).png",
            "kiqna/kiqna (29).png",
            "kiqna/kiqna (30).png",
            "kiqna/kiqna (31).png",
            "kiqna/kiqna (32).png",
            "kiqna/kiqna (33).png",
            "kiqna/kiqna (34).png",
            "kiqna/kiqna (35).png",
            "kiqna/kiqna (36).png",
            "kiqna/kiqna (37).png",
            "kiqna/kiqna (38).png",
            "kiqna/kiqna (39).png",
            "kiqna/kiqna (40).png",
            "kiqna/kiqna (41).png",
            "kiqna/kiqna (42).png",
        ],
        aiHint: "e-commerce ecommerce project",
        category: ["web", "fullstack"],
        status: "completed"
    },
    {
        title: "Comprehensive Student Management System",
        description: "A web application for managing student records, including enrollment, grades, and attendance.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "",
        repo: "",
        images: [
            "csms/csms.png"
        ],
        aiHint: "mobile app learning courseware",
        category: ["web", "fullstack"], 
        status: "ongoing"
    },
    {
        title: "Kreyt Landing Page",
        description: "A Web3 Landing Page for a crypto company called Kreyt",
        tags: ["React", "Vite", "TypeScript", "Framer", "Tailwind CSS", "React Bits", "ShadCDN"],
        live: "https://kreyt-crypto-site.vercel.app/",
        repo: "https://github.com/zxcoding123/Kreyt_Crypto_Site/tree/main/src",
        images: [
            "kreyt/kreyt.png",
        ],
        aiHint: "mobile app learning courseware",
        category: ["web", "design"],
           status: "completed"
    },
    {
        title: "DeenConnect Landing Page",
        description: "A simple landing page for an Islamic organization called DeenConnect",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "https://islam-site-github-io.vercel.app/",
        repo: "https://github.com/zxcoding123/islam_site.github.io",
        images: [
            "muslim/muslim.png",
            "muslim/muslim-1.png",
            "muslim/muslim-2.png",
        ],

        aiHint: "mobile app learning courseware",
        category: ["web", "design"],
           status: "completed"
    },
    {
        title: "Windy Landing Page",
        description: "A simple landing page for an Islamic organization called DeenConnect",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "https://wind-energy-site-aquino-github-io.vercel.app/",
        repo: "https://github.com/zxcoding123/Wind_Energy_Site_Aquino.github.io",
        images: [
            "windy/windy.png", "windy/windy (1).png", "windy/windy (2).png"
        ],


        aiHint: "mobile app learning courseware",
        category: ["web", "design"],
           status: "completed"
    },
];
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
