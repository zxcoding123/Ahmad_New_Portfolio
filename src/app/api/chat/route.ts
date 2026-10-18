import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { projects } from "@/data/projects";
import { stack } from "@/data/stack";
import { RESUME, SITE, SITE_URL, SOCIALS } from "@/data/site";

// Everything below is derived from the same data the terminal renders, so the
// assistant can never quote a link, role or project that has drifted from it.
const SKILLS = stack
    .map(group => `- ${group.label}: ${group.items.join(", ")}`)
    .join("\n");

const AHMAD_BIO = `
Name: ${SITE.name}
Role: ${SITE.role}
About: ${SITE.bio}
Skills:
${SKILLS}
Work History: 2 years of freelancing.
Education: BS in Information Technology.
Country: Philippines

Contact:
Email: ${SOCIALS.email}
LinkedIn: ${SOCIALS.linkedin}
GitHub: ${SOCIALS.github}
Book a call: ${SOCIALS.calendly}
Resume: ${RESUME.viewUrl}
Portfolio: ${SITE_URL}
`;

const projectContext = projects
    .map((p) => {
        const role = p.role ? ` [Role: ${p.role}]` : "";
        const live = p.live ? ` Live: ${p.live}` : "";
        return `${p.title}${role}: ${p.description} (Tags: ${p.tags.join(", ")}; Status: ${p.status})${live}`;
    })
    .join("\n\n");

const SYSTEM_PROMPT = `
You are Ahmad's personal AI assistant.
Context: ${AHMAD_BIO}
Projects:
${projectContext}

STRICT RULES:
1. ONLY answer questions based on the Context provided above.
2. If a user asks about something NOT in the context (e.g., politics, weather, or other people),
   politely say: "I'm sorry, I'm only trained to answer questions about Ahmad's professional background."
3. Keep answers under 3 sentences.
4. Be professional and encouraging.
5. IF the user asks about contact, hiring, collaboration, or how to reach Ahmad, provide the Contact details clearly.
`;

const MAX_PROMPT_LENGTH = 500;

// Best-effort per-IP limit. In-memory, so on serverless it resets with each
// cold instance, but it still stops a single client from hammering one
// instance and burning the Gemini quota.
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60_000;
const hits = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
    const now = Date.now();
    const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
    recent.push(now);
    hits.set(ip, recent);

    // Keep the map from growing without bound on a long-lived instance.
    if (hits.size > 1000) {
        for (const [key, times] of hits) {
            if (times.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
        }
    }

    return recent.length > RATE_LIMIT;
}

export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (isRateLimited(ip)) {
        return Response.json(
            { error: "Too many messages. Please wait a minute and try again." },
            { status: 429 }
        );
    }

    let prompt: unknown;
    try {
        ({ prompt } = await req.json());
    } catch {
        return Response.json({ error: "Invalid request body." }, { status: 400 });
    }

    if (typeof prompt !== "string" || !prompt.trim()) {
        return Response.json({ error: "Message is required." }, { status: 400 });
    }
    if (prompt.length > MAX_PROMPT_LENGTH) {
        return Response.json(
            { error: `Please keep messages under ${MAX_PROMPT_LENGTH} characters.` },
            { status: 400 }
        );
    }

    try {
        const { text } = await generateText({
            model: google('gemini-2.5-flash'),
            system: SYSTEM_PROMPT,
            prompt,
            maxOutputTokens: 300,
        });

        return Response.json({ text });
    } catch (error) {
        // Log the detail server-side; never echo provider errors to the client.
        console.error("Chat route error:", error);
        return Response.json(
            { error: "The assistant is unavailable right now." },
            { status: 500 }
        );
    }
}
