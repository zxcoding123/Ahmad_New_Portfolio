export function About() {
    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-2">About Me</h2>
            <p>I am a passionate software engineer with a knack for creating beautiful, performant, and accessible user experiences. I love working with modern web technologies and building cool things on the internet.</p>
            <br/>
            <h3 className="text-lg font-bold text-accent mb-2">Skills</h3>
            <ul className="list-disc list-inside space-y-1">
                <li><span className="font-bold text-primary">Languages:</span> HTML, CSS, JavaScript, jQuery, Python, TypeScript, Flutter, PHP</li>
                <li><span className="font-bold text-primary">Databases:</span> MySQL, SQLite, Firebase, PHP:PDO </li>
                <li><span className="font-bold text-primary">Frameworks:</span> Vite, Next.js, React, Bootstrap CSS, Tailwind CSS, Node.js</li>
                <li><span className="font-bold text-primary">Tools:</span> Git, Docker, Firebase, Vercel, Figma</li>
            </ul>
        </div>
    );
}
