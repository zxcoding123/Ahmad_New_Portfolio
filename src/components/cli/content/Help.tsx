const commands = [
    { cmd: 'home', desc: 'Go to the home page.' },
    { cmd: 'about', desc: 'Learn more about me.' },
    { cmd: 'works', desc: 'View my projects.' },
    { cmd: 'contact', desc: 'Get my contact information.' },
    { cmd: 'help', desc: 'Display this help message.' },
    { cmd: 'clear', desc: 'Clear the terminal screen.' },
    { cmd: 'whoami', desc: 'Alias for about.' },
    { cmd: 'projects', desc: 'Alias for works.' },
    { cmd: 'socials', desc: 'Alias for contact.' },
];

export function Help() {
    return (
        <div className="w-full">
            <p className="mb-2">Here are the available commands:</p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1">
                {commands.map(({ cmd, desc }) => (
                    <li key={cmd} className="flex items-baseline gap-2">
                        <span className="w-24 text-accent-foreground bg-accent px-1 rounded">{cmd}</span>
                        <span className="flex-1">{desc}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
