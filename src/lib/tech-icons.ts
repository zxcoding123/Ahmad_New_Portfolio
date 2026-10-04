// lib/tech-icons.ts
//
// Maps a tech tag ("Svelte 5", "Tailwind CSS 4", "Node.js") to its logo.
// Icons are imported one by one so only these ship to the browser, not the
// whole simple-icons set. Tags with no entry render as plain text.
import {
  siAgora,
  siBootstrap,
  siBun,
  siChartdotjs,
  siCloudflare,
  siCloudways,
  siCss,
  siDart,
  siDocker,
  siDrizzle,
  siExpress,
  siFirebase,
  siFlutter,
  siFramer,
  siGit,
  siGithubactions,
  siGnubash,
  siGoogleanalytics,
  siGooglesearchconsole,
  siGoogletagmanager,
  siHtml5,
  siJavascript,
  siJquery,
  siJson,
  siLaravel,
  siLighthouse,
  siLucide,
  siMeta,
  siMysql,
  siN8n,
  siNextdotjs,
  siNodedotjs,
  siPaypal,
  siPhp,
  siPostgresql,
  siPosthog,
  siPython,
  siReact,
  siShadcnui,
  siSqlite,
  siSupabase,
  siSvelte,
  siTailwindcss,
  siTauri,
  siTiktok,
  siTypescript,
  siUmami,
  siVercel,
  siVite,
  siVitest,
  siWebflow,
  siXampp,
  type SimpleIcon,
} from "simple-icons";

/** "Tailwind CSS 4" -> "tailwindcss", "JavaScript (ES6+)" -> "javascriptes6".
 *  A trailing version is dropped so "Svelte 5" and "Svelte" share one entry. */
export function techKey(tag: string): string {
  return tag
    .toLowerCase()
    .replace(/\s+v?\d+(\.\d+)*\+?$/, "")
    .replace(/[^a-z0-9]/g, "");
}

const ICONS: Record<string, SimpleIcon> = {
  agora: siAgora,
  bootstrap: siBootstrap,
  bun: siBun,
  chartjs: siChartdotjs,
  cloudflare: siCloudflare,
  cloudways: siCloudways,
  css: siCss,
  css3: siCss,
  dart: siDart,
  docker: siDocker,
  drizzle: siDrizzle,
  drizzleorm: siDrizzle,
  express: siExpress,
  expressjs: siExpress,
  firebase: siFirebase,
  firebasehosting: siFirebase,
  flutter: siFlutter,
  framer: siFramer,
  framermotion: siFramer,
  git: siGit,
  githubactions: siGithubactions,
  googleanalytics: siGoogleanalytics,
  googlelighthouse: siLighthouse,
  lighthouse: siLighthouse,
  googlesearchconsole: siGooglesearchconsole,
  googletagmanager: siGoogletagmanager,
  html: siHtml5,
  html5: siHtml5,
  javascript: siJavascript,
  javascriptes6: siJavascript,
  jquery: siJquery,
  json: siJson,
  laravel: siLaravel,
  lucide: siLucide,
  metapixel: siMeta,
  mysql: siMysql,
  n8n: siN8n,
  nextjs: siNextdotjs,
  node: siNodedotjs,
  nodejs: siNodedotjs,
  paypalapi: siPaypal,
  php: siPhp,
  phppdo: siPhp,
  postgresql: siPostgresql,
  posthog: siPosthog,
  python: siPython,
  react: siReact,
  shadcn: siShadcnui,
  shadcnui: siShadcnui,
  shellscripting: siGnubash,
  sqlite: siSqlite,
  supabase: siSupabase,
  svelte: siSvelte,
  sveltekit: siSvelte,
  tailwind: siTailwindcss,
  tailwindcss: siTailwindcss,
  tauri: siTauri,
  tiktokpixel: siTiktok,
  typescript: siTypescript,
  umami: siUmami,
  vercel: siVercel,
  vite: siVite,
  vitest: siVitest,
  webflow: siWebflow,
  webflowcms: siWebflow,
  xampp: siXampp,
};

export function techIcon(tag: string): SimpleIcon | null {
  return ICONS[techKey(tag)] ?? null;
}

/**
 * Brand color for the icon, or null when it would vanish on one of the themes:
 * near-black logos (Next.js, Vercel, Bun) disappear on dark backgrounds and
 * near-white ones (Drizzle) on light. Those inherit the text color instead.
 */
export function techIconColor(icon: SimpleIcon): string | null {
  const channel = (offset: number) => {
    const c = parseInt(icon.hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(0) + 0.7152 * channel(2) + 0.0722 * channel(4);
  return luminance < 0.06 || luminance > 0.7 ? null : `#${icon.hex}`;
}
