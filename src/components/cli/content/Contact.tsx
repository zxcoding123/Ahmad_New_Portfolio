import { Mail, Github, Linkedin, Folder } from "lucide-react";

const contacts = [
    { icon: Mail, label: 'Email', value: 'ahmadaquino.2002@gmail.com', href: 'mailto:ahmadaquino.2002@gmail.com' },
    { icon: Github, label: 'GitHub', value: 'zxcoding123', href: 'https://github.com/zxcoding123' },
    { icon: Linkedin, label: 'LinkedIn', value: 'Ahmad Aquino', href: 'https://www.linkedin.com/in/ahmad-aquino-34b318243/' },
    { icon: Folder, label: 'Resume', value: 'View My Resume', href: 'https://drive.google.com/file/d/1YL5hLT5AwNjuxlZQtV0LwV2b0EqxqPi9/view?usp=sharing' },
];

export function Contact() {
    return (
        <div>
            <h2 className="text-xl font-bold text-accent mb-4">Contact Me</h2>
            <p>You can reach me through the following channels:</p>
            <ul className="mt-2 space-y-2">
                {contacts.map(contact => (
                    <li key={contact.label} className="flex items-center gap-4">
                        <contact.icon className="text-primary" size={20} />
                        <span className="w-20">{contact.label}:</span>
                        <a href={contact.href} target="_blank" rel="noopener noreferrer" className="text-foreground hover:text-accent hover:underline transition-colors">
                            {contact.value}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
