import { Badge } from "@/components/ui/badge";
import { ShinyText } from "@/components/ShinyText";
import { SITE } from "@/data/site";
import { LatestProject } from "./LatestProject";
import { VentureLinks } from "./Ventures";

// Muted base with a primary-colored sweep, so the shine reads in both themes
const SHINE_PROPS = {
    as: "pre",
    speed: 3,
    delay: 1,
    color: "hsl(var(--muted-foreground))",
    shineColor: "hsl(var(--primary))",
    spread: 120,
} as const;

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
                    <ShinyText
                        {...SHINE_PROPS}
                        className="whitespace-pre text-[0.50rem] leading-tight select-none animate-marquee"
                        style={{
                            display: "inline-block",
                            paddingRight: "4rem",
                        }}
                    >
                        {ASCII_ART}
                    </ShinyText>
                    {/* Duplicate for seamless loop */}
                    <ShinyText
                        {...SHINE_PROPS}
                        className="whitespace-pre text-[0.50rem] leading-tight select-none animate-marquee"
                        aria-hidden="true"
                        style={{
                            display: "inline-block",
                            paddingRight: "4rem",
                        }}
                    >
                        {ASCII_ART}
                    </ShinyText>
                </div>

                {/* sm+ static */}
                <ShinyText
                    {...SHINE_PROPS}
                    className="hidden sm:block whitespace-pre sm:text-[0.65rem] md:text-[0.85rem] lg:text-base text-center leading-tight select-none"
                >
                    {`\n${ASCII_ART}\n`}
                </ShinyText>
            </div>

            <p className="text-center font-bold mt-2 text-sm sm:text-base">
                {SITE.role}
            </p>

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

            {/* Most recently touched project */}
            <LatestProject />

            <p className="text-center font-bold mt-4 text-sm sm:text-base">
                Welcome to my interactive CLI portfolio.
            </p>

            <p className="text-center mt-1 text-sm sm:text-base text-muted-foreground">
                Founder of <VentureLinks />.
            </p>

            <div className="mt-3 sm:mt-4">
                <p className="text-center max-w-3xl mx-auto text-sm sm:text-base leading-relaxed">{SITE.bio}</p>
            </div>

            {/* Divider between the intro and the prompt hints below it */}
            <div className="mt-5 sm:mt-6 border-t border-dashed border-border" />

            <p className="mt-4 text-sm sm:text-base">
                Type{" "}
                <span className="text-accent-foreground bg-accent px-1 rounded font-mono text-xs sm:text-sm">
                    help
                </span>{" "}
                to see the list of available commands.
            </p>
        </div>
    );
}