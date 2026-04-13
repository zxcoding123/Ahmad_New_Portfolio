import { Badge } from "@/components/ui/badge";

const ASCII_ART = `        _                         _                       _    __       _ _        
   __ _| |__  _ __ ___   __ _  __| |     _ __   ___  _ __| |_ / _| ___ | (_) ___   
  / _\` | '_ \\| '_ \` _ \\ / _\` |/ _\` |    | '_ \\ / _ \\| '__| __| |_ / _ \\| | |/ _ \\  
 | (_| | | | | | | | | | (_| | (_| |    | |_) | (_) | |  | |_|  _| (_) | | | (_) | 
  \\__,_|_| |_|_| |_| |_|\\__,_|\\__,_|____| .__/ \\___/|_|   \\__|_|  \\___/|_|_|\\___(_)
                                  |_____|_|`;

export function Home() {
    return (
        <div className="w-full max-w-full mx-auto">
            {/* Marquee on small screens, static centered on sm+ */}
            <div className="overflow-hidden sm:overflow-x-auto">
                {/* Mobile marquee */}
                <div className="flex sm:hidden">
                    <pre
                        className="text-primary whitespace-pre text-[0.50rem] leading-tight select-none animate-marquee"
                        style={{
                            display: "inline-block",
                            paddingRight: "4rem",
                        }}
                    >
                        {ASCII_ART}
                    </pre>
                    {/* Duplicate for seamless loop */}
                    <pre
                        className="text-primary whitespace-pre text-[0.50rem] leading-tight select-none animate-marquee"
                        aria-hidden="true"
                        style={{
                            display: "inline-block",
                            paddingRight: "4rem",
                        }}
                    >
                        {ASCII_ART}
                    </pre>
                </div>

                {/* sm+ static */}
                <pre className="hidden sm:block text-primary whitespace-pre sm:text-[0.65rem] md:text-[0.85rem] lg:text-base text-center leading-tight select-none">
                    {`\n${ASCII_ART}\n`}
                </pre>
            </div>

            {/* Live Status Badge */}
            <div className="flex justify-center items-center mt-3 sm:mt-4">
                <Badge variant="secondary" className="flex items-center gap-2 px-3 py-1 text-xs sm:text-sm">
                    <span className="relative flex h-2 w-2 shrink-0">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
                    </span>
                    Available for work
                </Badge>
            </div>

            <p className="text-center font-bold mt-4 text-sm sm:text-base">
                Welcome to my interactive CLI portfolio.
            </p>

            <div className="mt-3 sm:mt-4">
                <p className="text-sm sm:text-base leading-relaxed">
                    I am a passionate web developer with a knack for creating beautiful, performant,
                    and accessible user experiences. I love working with modern web technologies and
                    building cool things on the internet. Apart from this, I also enjoy employing SEO
                    best practices, as well as writing and content creation.
                </p>
            </div>

            <p className="mt-3 sm:mt-4 text-sm sm:text-base">
                Type{" "}
                <span className="text-accent-foreground bg-accent px-1 rounded font-mono text-xs sm:text-sm">
                    help
                </span>{" "}
                to see the list of available commands.
            </p>
        </div>
    );
}