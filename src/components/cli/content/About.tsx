import { trackEvent } from "@/lib/analytics";

export function About() {
    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-2">About Me</h2>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-4">
                <p>
                    I am a passionate web developer with a knack for creating beautiful, performant, and accessible user experiences.
                    I love working with modern web technologies and building cool things on the internet.
                    Apart from this, I also enjoy employing SEO best practices, as well as writing and content creation.
                </p>
            </div>

          <a 
  href="https://drive.google.com/file/d/1LbGpHYgllL4SbQ3W_SkFMfdpWkeFa0tw/view?usp=sharing" 
  target="_blank" 
  rel="noopener noreferrer"
    onClick={() =>
    trackEvent("resume_viewed", {
      source: "portfolio_button"
    })
  }
  className="inline-block mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 dark:bg-primary-dark dark:text-black transition"
>
  View My Resume
</a>


            <h3 className="text-lg font-bold text-accent mb-2">Skills</h3>
<ul className="list-disc list-inside space-y-1">
  <li>
    <span className="font-bold text-primary">Languages: </span> 
    JavaScript (ES6+), TypeScript, PHP, Python, HTML5, CSS3
  </li>
  <li>
    <span className="font-bold text-primary">Frameworks & Libraries: </span> 
    React, Next.js, Svelte, Laravel, Node.js, Vite, Tailwind CSS, Bootstrap
  </li>
  <li>
    <span className="font-bold text-primary">Databases & Backend: </span> 
    MySQL, SQLite, Firebase, Supabase, REST APIs, PHP (PDO)
  </li>
  <li>
    <span className="font-bold text-primary">Tools & Platforms: </span> 
    Git, Docker, Vercel, Firebase, Webflow
  </li>
  <li>
    <span className="font-bold text-primary">Performance & Analytics: </span> 
    Google Lighthouse, Umami, SEO (Google Search Console, SurferSEO)
  </li>
  <li>
    <span className="font-bold text-primary">Other: </span> 
    Responsive Design, AJAX
  </li>
</ul>
        </div>
    );
}
