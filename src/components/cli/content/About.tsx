export function About() {
    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-2">About Me</h2>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6 mb-4">
                <p>
                    I am a passionate software engineer with a knack for creating beautiful, performant, and accessible user experiences. 
                    I love working with modern web technologies and building cool things on the internet.
                </p>
            </div>

            <a 
                href="https://drive.google.com/file/d/1AnidswAqLtImWga0wTc7zIhD_ttR7OWA/view?usp=sharing" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block mb-6 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90 transition"
            >
                View My Resume
            </a>

            <h3 className="text-lg font-bold text-accent mb-2">Skills</h3>
            <ul className="list-disc list-inside space-y-1">
                <li><span className="font-bold text-primary">Languages:</span> HTML, CSS, JavaScript, jQuery, Python, TypeScript, Flutter, PHP, Laravel</li>
                <li><span className="font-bold text-primary">Databases:</span> MySQL, SQLite, Firebase, PHP:PDO, Supabase </li>
                <li><span className="font-bold text-primary">Frameworks:</span> Vite, Next.js, React, Bootstrap CSS, Tailwind CSS, Node.js, Webflow</li>
                <li><span className="font-bold text-primary">Tools:</span> Git, Docker, Firebase, Vercel, Figma</li>
                <li><span className="font-bold text-primary">SEO:</span> Google Search Console, SurferSEO</li>
            </ul>
        </div>
    );
}
