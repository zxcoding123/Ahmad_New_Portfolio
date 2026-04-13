import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { projects } from "@/data/projects";

const AHMAD_BIO = `
Name: Ahmad Pandaog Aquino
Role: Full-stack Developer | Mobile Application Developer
Skills: HTML, CSS, Javascript, Python, PHP, Laravel, Flutter, Next.js, React, Node.js, Typescript, Docker, Firebase, Vercel, Canvas, Git, Svelte, ShadCDN
Projects: 
- AI Portfolio: A Next.js site with a custom Gemini integration.
- E-commerce App: Built with Stripe and Supabase.
Work History: 2 years of freelancing.
Education: BS in Information Technology.
Country: Philippines

Contact:
Email: ahmadaquino.2002@gmail.com
LinkedIn: https://www.linkedin.com/in/ahmad-aquino-34b318243
Resume: https://drive.google.com/file/d/15lHYJr3AeYEst2u0xhIXrLxtiXTX4F6M/view?usp=sharing
GitHub: https://github.com/zxcoding123
`;

 const projectContext = projects
    .map((p) => `${p.title}: ${p.description} (Tags: ${p.tags.join(", ")})`)
    .join("\n\n");

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      // 2. The System Prompt is your "Instruction Manual"
      system: `
        You are Ahmad's personal AI assistant. 
        Context: ${AHMAD_BIO} ${projectContext}
        
        STRICT RULES:
        1. ONLY answer questions based on the Context provided above.
        2. If a user asks about something NOT in the context (e.g., politics, weather, or other people), 
           politely say: "I'm sorry, I'm only trained to answer questions about Ahmad's professional background."
        3. Keep answers under 3 sentences.
        4. Be professional and encouraging.
        5. IF the user asks about contact, hiring, collaboration, or how to reach Ahmad, provide the Contact details clearly.
      `,
      prompt: prompt,
    });

    return Response.json({ text });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}