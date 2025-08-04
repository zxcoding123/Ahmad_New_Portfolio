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

const projects = [
    {
        title: "LearnMate",
        description: "A mobile app built for freelance teachers and elementary pupils to book video conferencing sessions and engage in e-learning style lessons.",
        tags: ["Flutter", "Firebase", "Agora"],
        live: "",
        repo: "",
        images: [
            "https://i.ibb.co/QjC3xs1c/Screenshot-20241115-101805.png",
            "https://i.ibb.co/mxLts0P/CanScan.png",
            "https://i.ibb.co/7N0KvSmT/Screenshot-20241115-095415.png",
            "https://i.ibb.co/Z1FhWQS1/Screenshot-20241115-095503.png"
        ],
        aiHint: "mobile app learning courseware"
    },
    {
        title: "BitCraft: A Desktop Courseware for e-Learning",
        description: "A desktop courseware built for learners and teachers to learn specific courses made by professional teachers.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "PHP:PDO", "MySQL", "SQLite", "Data-AOS", "Plyr", "DataTables"],
        live: "",
        repo: "",
        images: [
            "https://i.ibb.co/kgg6nkBr/BITCRAFT-1.png",
            "https://i.ibb.co/gLnWb2jB/BITCRAFT-2.png",
            "https://i.ibb.co/0VVfrY5Z/BITCRAFT-3.png",
            "https://i.ibb.co/vCf1xJf9/BITCRAFT-4.png",
            "https://i.ibb.co/1GtVWwdP/BITCRAFT-5.png",
            "https://i.ibb.co/F1jk95B/BITCRAFT-6.png",
            "https://i.ibb.co/spJFt4Sq/BITCRAFT-7.png",
            "https://i.ibb.co/qYrzwptc/BITCRAFT-8.png",
            "https://i.ibb.co/FbrKkhgk/BITCRAFT-9.png",
            "https://i.ibb.co/RmPdW8N/BITCRAFT-10.png",
            "https://i.ibb.co/Y4nNJPdY/BITCRAFT-11.png",
            "https://i.ibb.co/k6qr8x4b/BITCRAFT-12.png",
            "https://i.ibb.co/HLvTgfR1/BITCRAFT-13.png"
        ],
        aiHint: "desktop courseware application"
    },
    {
        title: "Korean – Innovative Quality Korean-pop Albums Web App",
        description: "An e-commerce web application catering towards buying and selling Korean-pop albums ranging from admin side to client side.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "PHP", "PHP:PDO", "MySQL", "DataTables", "PayPal API",],
        live: "",
        repo: "",
        images: [
            "https://i.ibb.co/7P83RDK/KIQNA-1.png",
            "https://i.ibb.co/bg7Dk7wL/KIQNA-2.png",
            "https://i.ibb.co/mnfmHHT/KIQNA-3.png",
            "https://i.ibb.co/5x8KB5Yc/KIQNA-4.png",
            "https://i.ibb.co/LBTLBz7/KIQNA-5.png",
            "https://i.ibb.co/TD4W5YGF/KIQNA-6.png",
            "https://i.ibb.co/LXrxB0TH/KIQNA-7.png",
            "https://i.ibb.co/5WhvRcqf/KIQNA-8.png",
            "https://i.ibb.co/2Yq4R6FK/KIQNA-9.png",
            "https://i.ibb.co/zhWnhCKV/KIQNA-10.png",
            "https://i.ibb.co/Ndf35vMW/KIQNA-11.png",
            "https://i.ibb.co/hxbs0R9w/KIQNA-12.png",
            "https://i.ibb.co/QvRnLVGj/KIQNA-13.png",
            "https://i.ibb.co/mFYDc8qW/KIQNA-14.png",
            "https://i.ibb.co/bpgywRY/KIQNA-15.png",
            "https://i.ibb.co/gLfGMPHZ/KIQNA-16.png",
            "https://i.ibb.co/dsc3L7CC/KIQNA-17.png",
            "https://i.ibb.co/MxP21Hss/KIQNA-18.png",
            "https://i.ibb.co/7xzfBRv4/KIQNA-19.png",
            "https://i.ibb.co/mKghy3w/KIQNA-20.png",
            "https://i.ibb.co/wNHLBpSx/KIQNA-21.png",
            "https://i.ibb.co/0RGh5mhh/KIQNA-22.png",
            "https://i.ibb.co/1t8x0qXY/KIQNA-23.png",
            "https://i.ibb.co/zVQNGXf0/KIQNA-24.png",
            "https://i.ibb.co/N6X64JvN/KIQNA-25.png",
            "https://i.ibb.co/cKV1N09j/KIQNA-26.png",
            "https://i.ibb.co/3mnhv4bB/KIQNA-27.png",
            "https://i.ibb.co/7tCxgWKG/KIQNA-28.png",
            "https://i.ibb.co/vCGVjL3S/KIQNA-29.png",
            "https://i.ibb.co/sJkgC8qR/KIQNA-30.png",
            "https://i.ibb.co/v6WcwHhb/KIQNA-31.png",
            "https://i.ibb.co/G3TnNWqb/KIQNA-32.png",
            "https://i.ibb.co/GZ5Fpdj/KIQNA-33.png",
            "https://i.ibb.co/MDYj0Y9m/KIQNA-34.png",
            "https://i.ibb.co/RpcchtdR/KIQNA-35.png",
            "https://i.ibb.co/tw487ykp/KIQNA-36.png",
            "https://i.ibb.co/zTtCxNdT/KIQNA-37.png",
            "https://i.ibb.co/6JJDnDHP/KIQNA-38.png",
            "https://i.ibb.co/7dSLWV0C/KIQNA-39.png",
            "https://i.ibb.co/5XbbnYsr/KIQNA-40.png",
            "https://i.ibb.co/tTttdWZ1/KIQNA-41.png",
            "https://i.ibb.co/kVhQFHgS/KIQNA-42.png"
        ],

        aiHint: "e-commerce ecommerce project"
    },
    {
        title: "Comprehensive Student Management System",
        description: "A web application for managing student records, including enrollment, grades, and attendance.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "",
        repo: "",
        images: [
            "https://i.ibb.co/4wLzw2N7/CSMS.png"
        ],
        aiHint: "mobile app learning courseware"
    },
    {
        title: "Kreyt Landing Page",
        description: "A Web3 Landing Page for a crypto company called Kreyt",
        tags: ["React", "Vite", "TypeScript", "Framer", "Tailwind CSS", "React Bits", "ShadCDN"],
        live: "https://kreyt-crypto-site.vercel.app/",
        repo: "https://github.com/zxcoding123/Kreyt_Crypto_Site/tree/main/src",
        images: [
            "https://i.ibb.co/TMRmQxrq/Screenshot-2025-08-04-162200.png"
        ],
        aiHint: "mobile app learning courseware"
    },
    {
        title: "DeenConnect Landing Page",
        description: "A simple landing page for an Islamic organization called DeenConnect",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "https://islam-site-github-io.vercel.app/",
        repo: "https://github.com/zxcoding123/islam_site.github.io",
        images: [
            "https://i.ibb.co/4w0RnQdk/Screenshot-2025-05-06-140955.png",
            "https://i.ibb.co/Zzy1qJmM/Screenshot-2025-05-06-141034.png",
            "https://i.ibb.co/992kd7s7/Screenshot-2025-05-06-141058.png"
        ],

        aiHint: "mobile app learning courseware"
    },
    {
        title: "Windy Landing Page",
        description: "A simple landing page for an Islamic organization called DeenConnect",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "https://wind-energy-site-aquino-github-io.vercel.app/",
        repo: "https://github.com/zxcoding123/Wind_Energy_Site_Aquino.github.io",
        images: [
            "https://i.ibb.co/cKRQp5Ky/Wind-Energy.png"
        ],


        aiHint: "mobile app learning courseware"
    },
];

export function Works() {
    return (
        <div className="px-4">
            <h2 className="text-xl font-bold text-accent mb-4">My Works</h2>
            <div className="space-y-6">
                {projects.map(p => (
                    <div key={p.title} className="flex flex-col md:flex-row gap-4 border border-border p-4 rounded-md bg-secondary">
                        <Carousel
                            plugins={[
                                Autoplay({
                                    delay: 2000,
                                }),
                            ]}
                            className="w-full md:w-1/3"
                        >
                            <CarouselContent>
                                {p.images.map((image, index) => (
                                    <CarouselItem key={index}>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <img
                                                    src={image}
                                                    alt={`${p.title} - Image ${index + 1}`}
                                                    className="rounded-md object-cover w-full h-[200px] cursor-pointer"
                                                />
                                            </DialogTrigger>
                                            <DialogContent className="max-w-screen-md">
                                                <DialogHeader>
                                                    <DialogTitle>{p.title} - Image {index + 1}</DialogTitle>
                                                </DialogHeader>
                                                <img
                                                    src={image}
                                                    alt={`${p.title} - Image ${index + 1}`}
                                                    className="object-contain w-full max-h-[80vh]"
                                                />

                                            </DialogContent>
                                        </Dialog>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                        </Carousel>
                        <div className="w-full md:w-2/3 flex flex-col">
                            <h3 className="font-bold text-lg text-primary">{p.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 flex-grow">{p.description}</p>
                            <div className="flex gap-2 flex-wrap mb-3">
                                {p.tags.map(tag => <span key={tag} className="text-xs bg-background/50 px-2 py-1 rounded">{tag}</span>)}
                            </div>
                            <div className="flex gap-4 text-sm">
                                {p.repo ? (
                                    <a
                                        href={p.repo}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-accent transition-colors"
                                    >
                                        <Github size={16} /> Repository
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-1 text-muted-foreground cursor-not-allowed" title="Repository not available">
                                        <Github size={16} /> No Repo
                                    </span>
                                )}

                                {p.live ? (
                                    <a
                                        href={p.live}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 hover:text-accent transition-colors"
                                    >
                                        <LinkIcon size={16} /> Live Demo
                                    </a>
                                ) : (
                                    <span className="flex items-center gap-1 text-muted-foreground cursor-not-allowed" title="Live demo not available">
                                        <LinkIcon size={16} /> No Demo
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
