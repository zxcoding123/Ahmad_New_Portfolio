// scripts/count-loc.mjs
//
// Counts the lines of code across my GitHub repos and writes the total to
// src/data/loc.json, which the home screen's "Lines of code" stat reads.
//
//   npm run count-loc                 public repos only
//   GITHUB_TOKEN=... npm run count-loc  private repos too
//
// Each non-fork repo I own is shallow-cloned into a temp folder and only source
// files are counted (non-blank lines). Dependencies, build output, lockfiles,
// minified bundles and generated code are skipped, which is what GitHub's own
// "lines added" stats get wrong. Run it whenever the number feels stale.

import { execFileSync } from "node:child_process";
import { mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { extname, join } from "node:path";

const USERNAME = "zxcoding123";
const OUTPUT = new URL("../src/data/loc.json", import.meta.url);
const TOKEN = process.env.GITHUB_TOKEN;

/** Hand-written source, by extension. */
const SOURCE_EXTENSIONS = new Set([
  ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs", ".svelte", ".vue",
  ".php", ".py", ".dart", ".kt", ".swift", ".java", ".c", ".h", ".cpp", ".cs", ".go", ".rs",
  ".html", ".css", ".scss", ".sass", ".sql", ".sh",
]);

/** Folders that hold dependencies, build output or tooling, never my own code. */
const SKIP_DIRS = new Set([
  ".git", "node_modules", "vendor", "bower_components", "dist", "build", "out", ".next",
  ".nuxt", ".svelte-kit", ".vercel", ".firebase", "coverage", ".dart_tool", "Pods",
  ".gradle", ".idea", ".vscode", "__pycache__", ".venv", "venv", "third_party",
  "PHPMailer", "phpmailer", "tcpdf", "fpdf", "dompdf", "libraries",
]);

/** Flutter's platform runners are generated boilerplate; only lib/ and test/ are mine. */
const FLUTTER_PLATFORM_DIRS = new Set(["android", "ios", "linux", "macos", "windows", "web"]);

/** Generated, bundled or well-known third-party files that slip past the folder lists. */
const SKIP_FILE =
  /(\.min\.(js|css)$|\.bundle\.js$|\.g\.dart$|\.freezed\.dart$|\.pb\.\w+$|-lock\.|\.lock$|GeneratedPluginRegistrant|^(jquery|bootstrap|popper|chart|swiper|aos|datatables|select2|sweetalert2?|fontawesome|all)[.-])/i;

/** Anything this large is a vendored library or a bundle, not hand-written code. */
const MAX_FILE_BYTES = 300 * 1024;

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  ...(TOKEN && { Authorization: `Bearer ${TOKEN}` }),
};

async function listRepos() {
  const url = TOKEN
    ? "https://api.github.com/user/repos?affiliation=owner&per_page=100"
    : `https://api.github.com/users/${USERNAME}/repos?type=owner&per_page=100`;
  const res = await fetch(url, { headers });
  if (!res.ok) {
    if (TOKEN) throw new Error(`GitHub responded ${res.status}: ${await res.text()}`);
    console.warn(`GitHub API responded ${res.status}, reading the profile page instead.`);
    return listReposFromProfile();
  }
  const repos = await res.json();
  return repos
    .filter((r) => !r.fork && r.owner.login.toLowerCase() === USERNAME.toLowerCase())
    .map((r) => ({ name: r.name, full_name: r.full_name, clone_url: r.clone_url }));
}

/**
 * Public, non-fork repos read from the profile's repositories tab, for when the
 * anonymous API limit (60 requests/hour) is used up.
 */
async function listReposFromProfile() {
  const repos = [];
  for (let page = 1; ; page++) {
    const res = await fetch(`https://github.com/${USERNAME}?tab=repositories&type=source&page=${page}`);
    if (!res.ok) throw new Error(`GitHub profile responded ${res.status}`);
    const html = await res.text();
    const names = [...html.matchAll(/href="\/[^/"]+\/([^/"]+)" itemprop="name codeRepository"/g)].map((m) => m[1]);
    if (!names.length) break;
    for (const name of names) {
      repos.push({
        name,
        full_name: `${USERNAME}/${name}`,
        clone_url: `https://github.com/${USERNAME}/${name}.git`,
      });
    }
  }
  return repos;
}

function countLines(dir, skipDirs = SKIP_DIRS) {
  let lines = 0;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!skipDirs.has(entry.name)) lines += countLines(path, skipDirs);
      continue;
    }
    if (!entry.isFile() || SKIP_FILE.test(entry.name)) continue;
    if (!SOURCE_EXTENSIONS.has(extname(entry.name).toLowerCase())) continue;
    if (statSync(path).size > MAX_FILE_BYTES) continue;
    lines += readFileSync(path, "utf8").split("\n").filter((line) => line.trim()).length;
  }
  return lines;
}

const workdir = mkdtempSync(join(tmpdir(), "count-loc-"));
try {
  const repos = await listRepos();
  let total = 0;

  for (const repo of repos) {
    const url = TOKEN
      ? repo.clone_url.replace("https://", `https://x-access-token:${TOKEN}@`)
      : repo.clone_url;
    const target = join(workdir, repo.name);
    try {
      execFileSync("git", ["clone", "--depth", "1", "--quiet", url, target], { stdio: "pipe" });
    } catch {
      console.warn(`  skipped ${repo.full_name} (clone failed)`);
      continue;
    }
    const isFlutter = readdirSync(target).includes("pubspec.yaml");
    const lines = countLines(
      target,
      isFlutter ? new Set([...SKIP_DIRS, ...FLUTTER_PLATFORM_DIRS]) : SKIP_DIRS
    );
    total += lines;
    console.log(`  ${lines.toLocaleString("en-US").padStart(9)}  ${repo.full_name}`);
  }

  const result = {
    linesOfCode: total,
    repos: repos.length,
    countedAt: new Date().toISOString().slice(0, 10),
  };
  writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`);
  console.log(`\n${total.toLocaleString("en-US")} lines across ${repos.length} repos → src/data/loc.json`);
} finally {
  rmSync(workdir, { recursive: true, force: true });
}
