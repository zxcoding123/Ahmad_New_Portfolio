// data/projects.ts
export interface Project {
  title: string;
  description: string;
  tags: string[];
  live: string;
  repo: string;
  images: string[];
  aiHint: string;
  category: string[];
  status: "ongoing" | "completed" | "stable";
  /** ISO date (YYYY-MM-DD) you last touched this project. Drives ordering
   *  and the "currently building" banner. A live GitHub push date overrides
   *  this at runtime when one is found and is newer. */
  updatedAt: string;
  /** Optional `owner/repo` used ONLY to read live push dates from GitHub.
   *  Use it when the code lives somewhere you do not want linked publicly, or
   *  under a different account than `repo`. Never rendered in the UI. */
  activityRepo?: string;
  /** Optional bullets shown only on the `works <slug>` detail page — the place
   *  to put what you actually built, decided or measured. Left off a project,
   *  the detail page simply falls back to `description`. */
  highlights?: string[];
}

/** URL/command-safe id for a project, e.g. "Coffee POS" -> "coffee-pos".
 *  Derived rather than stored so titles stay the single source of truth. */
export function projectSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Look a project up by slug, then by a loose title match, so both
 *  `works coffee-pos` and `works coffee` land on the same project. */
export function findProject<T extends Project>(
  query: string,
  source: T[]
): T | undefined {
  const needle = query.trim().toLowerCase();
  if (!needle) return undefined;

  const asSlug = projectSlug(needle);

  return (
    source.find((p) => projectSlug(p.title) === asSlug) ??
    source.find((p) => p.title.toLowerCase().includes(needle))
  );
}

export const projects: Project[] = [
    {
        "title": 'QUINAS',
        updatedAt: "2026-08-28",
        activityRepo: "kinas-official/quinas_official",
            "description": 'The architectural digital presence and portfolio engine for Quinas Studio. Built on Svelte 5 and Tailwind CSS, featuring an organic warm minimalist design system, sequential capabilities matrices, and an automated system creed architecture.',
            "tags": ['Svelte 5', 'Tailwind CSS', 'Vite', 'UI/UX Architecture', 'Web Systems'],
            "live": 'https://quinas-official.vercel.app/',
            "repo": '',
            "images": ['quinas/1.png'],
            "aiHint": 'high fidelity minimalist engineering studio landing page and system ledger',
            "status": 'completed',
            "category": ['web', 'design', 'architecture']
    },
    {
    "title": "Seeker",
    updatedAt: "2026-08-22",
    "description": "An autonomous lead generation engine built on n8n. It programmatically scrapes job boards for Web Developer roles, passing opportunities through a custom logic gate that filters for specific tech stack alignment—delivering high-signal career leads while eliminating manual search fatigue.",
    "tags": [
        "n8n",
        "Automation",
        "Web Scraping",
        "Workflow Engineering",
        "API Integration",
        "JSON"
    ],
    "live": "",
    "repo": "",
    "images": [
        "seeker/1.png",
    ],
    "aiHint": "autonomous job scraping and skills-based filtering workflow",
    "category": ["automation", "productivity", "tools"],
    "status": "ongoing"
},
{
    "title": "Mote",
    updatedAt: "2026-08-14",
    "description": "A minimalist, zero-config backup utility for XAMPP environments. It silently orchestrates scheduled MySQL exports and intelligent archival rotation, acting as a lightweight fail-safe to ensure local development data survives database corruption or environment resets.",
    "tags": [
        "MySQL",
        "Shell Scripting",
        "Automation",
        "XAMPP",
        "Data Integrity",
        "DevOps"
    ],
    "live": "",
    "repo": "https://github.com/zxcoding123/mote-xampp-mysql-backup",
    "images": [
        "mote/1.png",
        "mote/2.png",
        "mote/3.png"
    ],
    "aiHint": "lightweight automated mysql backup daemon and rotation manager",
    "category": ["tools", "automation", "devops"],
    "status": "stable",
},
{
    "title": "SubBurn",
    updatedAt: "2026-08-05",
    "description": "A high-fidelity financial auditing engine designed to kill 'Subscription Blindness.' Built on the principle that friction is a feature, it trades passive automation for intentional manual entry—forcing a 15-second conscious audit of every recurring expense to visualize long-term burn and reclaim intent.",
    "tags": [
        "Laravel 13",
        "Svelte 5",
        "Runes",
        "Tailwind v4",
        "PostgreSQL",
        "Lucide",
        "Architecture-First"
    ],
    "live": "https://subburn.vercel.app/",
    "repo": "https://github.com/zxcoding123/subburn",
    "images": [
        "subburn/1.png",

    ],
    "aiHint": "intentional financial auditing tool and multi-year subscription burn projection system",
    "category": ["web", "fullstack", "fintech"],
    "status": "ongoing"
},
{
    "title": "Roastly",
    updatedAt: "2026-07-24",
    "description": "A high-performance, offline-first mobile POS system built specifically for cafes. Designed to handle the morning rush without an internet connection, it leverages local-network synchronization (mDNS) to keep multiple registers in sync, ensuring zero downtime and lightning-fast checkout workflows.",
    "tags": [
        "Flutter",
        "Dart",
        "Isar",
        "Hive",
        "Bonsoir",
        "mDNS",
        "Offline-First"
    ],
    "live": "https://roastly-pos-project.vercel.app/",
    "repo": "#",
    "images": [
       "roastly/1.png",
      "roastly/2.png",
      "roastly/3.png",
      "roastly/4.png",
      "roastly/5.png",
      "roastly/6.png",  
      "roastly/7.png"
    ],
    "aiHint": "offline-first cafe POS system with local-network discovery and peer-to-peer sync",
    "category": ["mobile", "fintech", "pos"],
    "status": "ongoing"
},
    {
    title: "Freelens",
    updatedAt: "2026-07-10",
    description: "An offline web application to manage freelance projects, clients, tasks, and payments efficiently.",
    tags: ["SvelteKit", "Vite", "TypeScript", "Tailwind CSS", "ShadCN", "Lucide", "jQuery", "Express", "PostgreSQL", "Node"],
    live: "https://freelens.vercel.app/",
    repo: "",
    images: [
        "freelens/freelens.png"
    ],
    aiHint: "freelance management dashboard",
    category: ["web", "fullstack"],
    status: "ongoing"
},
   {
        title: "Aurelius University Alumni Records and Management System",
        updatedAt: "2026-06-26",
        description: "A web application for managing student alumni records.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "#",
        repo: "#",
        images: [
           "aurelius/1.png",
            "aurelius/2.png",
        ],
        aiHint: "mobile app learning courseware",
        category: ["web", "fullstack"], 
        status: "ongoing"
    },
        {
        title: "Lumina University Comprehensive Student Management System",
        updatedAt: "2026-06-12",
        description: "A web application for managing student records, including enrollment, grades, and attendance.",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PHP:PDO", "MySQL"],
        live: "#",
        repo: "#",
         images: [
            "no-project-picture.png"
        ],
        aiHint: "mobile app learning courseware",
        category: ["web", "fullstack"], 
        status: "ongoing"
    },
    {
    title: "Brainly Landing Page",
    updatedAt: "2026-05-29",
    description: "A modern mental health landing page inspired by Brainly, focused on collaborative therapy and CBT session.",
    tags: ["SvelteKit", "Vite", "TypeScript", "Tailwind CSS", "ShadCN", "Lucide", "Framer Motion"],
    live: "https://brainly-1mjr.vercel.app/",
    repo: "https://github.com/zxcoding123/brainly",
    images: [
        "brainly/brainly.png",
    ],
    aiHint: "education platform student collaboration",
    category: ["web", "education", "design"],
    status: "completed"
},
    {
  title: "FoCi",
  updatedAt: "2026-05-15",
  description: "A productivity-focused web application designed to enhance concentration through curated ambient soundscapes. FoCi provides users with a seamless, immersive environment to support deep work and study sessions, featuring a minimalist interface and high-quality audio streaming.",
  tags: ["Next.js", "Shadcn UI", "Vite", "Web Audio API", "Tailwind CSS"],
  live: "https://foci-page.vercel.app/", // Add your deployment link here
  repo: "https://github.com/zxcoding123/foci-page", // Add your GitHub link here
  images: [
      "foci/foci-preview.png"
  ],
  aiHint: "productivity web app providing focus-enhancing ambient sounds and a pleasant study environment",
  category: ["web", "frontend", "design"],
  status: "ongoing" // or "ongoing"
},
   {
  title: "Tarabasa",
  updatedAt: "2026-04-30",
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
  updatedAt: "2026-04-16",
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
        updatedAt: "2026-03-28",
        description: "A web-based repository system for managing and archiving student theses for Tawi-Tawi Regional Argicultural College. The system allows users to submit, browse, and search theses efficiently, while providing administrators tools for review, approval, and organization of research works.",
        tags: ["PHP", "MySQL", "Bootstrap", "JavaScript", "PHP:PDO"],
        live: "https://trac-thesis-repo.hstn.me",
        repo: "https://github.com/zxcoding123/TRAC-THESIS-REPO-SYSTEM",
        images: [
            "trac/trac_repo_system.png",    

        ],
        aiHint: "web-based student thesis repository system",
        category: ["web", "fullstack", "education"],
        status: "completed"
    },
    {
        title: "Kanvas",
        updatedAt: "2026-03-10",
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
        updatedAt: "2026-02-20",
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
        updatedAt: "2026-01-28",
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
        updatedAt: "2025-12-15",
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
        updatedAt: "2025-11-20",
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
        title: "Kreyt Landing Page",
        updatedAt: "2025-10-18",
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
        updatedAt: "2025-09-12",
        description: "A simple landing page for an Islamic organization called DeenConnect",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap" ],
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
        updatedAt: "2025-08-05",
        description: "A simple landing page for an Wind Energy Company called Windy",
        tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap"],
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