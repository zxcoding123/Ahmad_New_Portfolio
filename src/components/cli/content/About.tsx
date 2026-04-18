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
  href="https://drive.google.com/file/d/15lHYJr3AeYEst2u0xhIXrLxtiXTX4F6M/view?usp=sharing" 
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

<h3 className="text-lg font-bold text-accent mt-6 mb-2">Certifications</h3>
<ul className="space-y-2 list-disc list-inside space-y-1">
  <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1y60liDqfswf-MxQJx0Jw1fm7yIoo5BBj/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Programming for Intermediate Users using Python
    </a>
    <span className="text-gray-500 ml-2">— Issued by Issued by Department of Information Technology through the Modern Academics Convergence Hub</span>
  </li>
  <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1FHjpJjFWRrdSX0MH-x6WjnJsWfa7RfUu/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Build Python Web Apps with Flask
    </a>
    <span className="text-gray-500 ml-2">— Issued by Issued by Department of Information Technology through the Modern Academics Convergence Hub</span>
  </li>
   <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1yx2S2SwCY-sjOJxUoMoxWRDe1_zrpi-U/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Visualize Data with Python
    </a>
    <span className="text-gray-500 ml-2">— Issued by Issued by Department of Information Technology through the Modern Academics Convergence Hub</span>
  </li>
   <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/18606u7GqyeplITWNlTm-zgMtenkAD_zR/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Analyze Data with Python
    </a>
    <span className="text-gray-500 ml-2">— Issued by Issued by Department of Information Technology through the Modern Academics Convergence Hub</span>
  </li>
    <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1-gPufhpjy9YoYlVbx1g-k6eH0LRua61w/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Programming for Beginners Data Using Python
    </a>
    <span className="text-gray-500 ml-2">— Issued by Department of Information Technology through the Modern Academics Convergence Hub</span>
  </li>
   <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1gxq1hQraGoJyA4w2cXCNcqs4NuUkMDIn/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Claude 101
    </a>
    <span className="text-gray-500 ml-2">— Issued by Skilljar and Anthropic Education</span>
  </li>
   <li className="text-sm">
    <a 
      href="https://drive.google.com/file/d/1zOqLSQN_pdAmObNjXo-CZ3kjqGqnvh9u/view?usp=sharing" 
      target="_blank" 
      className="text-primary hover:underline font-semibold"
    >
      Claude Code 101
    </a>
    <span className="text-gray-500 ml-2">— Issued by Skilljar and Anthropic Education</span>
  </li>
</ul>

        </div>
    );
}
