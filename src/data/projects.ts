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
  status: "ongoing" | "completed";
}

export const projects: Project[] = [
    {
    title: "Freelens",
    description: "A web application to manage freelance projects, clients, tasks, and payments efficiently.",
    tags: ["HTML", "CSS", "JavaScript", "jQuery", "Bootstrap", "PHP", "PDO", "MySQL"],
    live: "",
    repo: "",
    images: [
        "freelens/freelens.png"
    ],
    aiHint: "freelance management dashboard",
    category: ["web", "fullstack"],
    status: "ongoing"
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
    title: "Brainly Landing Page",
    description: "A modern mental health landing page inspired by Brainly, focused on collaborative therapy and CBT session.",
    tags: ["SvelteKit", "Vite", "TypeScript", "Tailwind CSS", "ShadCN", "Lucide", "Framer Motion"],
    live: "https://brainly-1mjr.vercel.app/",
    repo: "https://github.com/zxcoding123/brainly",
    images: [
        "brainly/brainly.png",
    ],
    aiHint: "education platform student collaboration",
    category: ["web", "education"],
    status: "completed"
},
    {
  title: "FoCi",
  description: "A productivity-focused web application designed to enhance concentration through curated ambient soundscapes. FoCi provides users with a seamless, immersive environment to support deep work and study sessions, featuring a minimalist interface and high-quality audio streaming.",
  tags: ["Next.js", "Shadcn UI", "Vite", "Web Audio API", "Tailwind CSS"],
  live: "https://foci-page.vercel.app/", // Add your deployment link here
  repo: "https://github.com/zxcoding123/foci-page", // Add your GitHub link here
  images: [
      "foci/foci-preview.png"
  ],
  aiHint: "productivity web app providing focus-enhancing ambient sounds and a pleasant study environment",
  category: ["web", "frontend"],
  status: "ongoing" // or "ongoing"
},
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