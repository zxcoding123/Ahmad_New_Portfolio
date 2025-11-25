export function Home() {
    return (
        <div>
            <pre className="text-primary whitespace-pre-wrap text-[0.55rem] sm:text-xs md:text-base text-center">

                {`
        _                         _                       _    __       _ _        
   __ _| |__  _ __ ___   __ _  __| |     _ __   ___  _ __| |_ / _| ___ | (_) ___   
  / _\` | '_ \| '_ \` _ \\ / _\` |/ _\` |    | '_ \\ / _ \\| '__| __| |_ / _ \\| | |/ _ \\  
 | (_| | | | | | | | | | (_| | (_| |    | |_) | (_) | |  | |_|  _| (_) | | | (_) | 
  \\__,_|_| |_|_| |_| |_|\\__,_|\\__,_|____| .__/ \\___/|_|   \\__|_|  \\___/|_|_|\\___(_)
                                  |_____|_|

`}
            </pre>
            <p className="text-center font-bold">Welcome to my interactive CLI portfolio.</p>
            <div className="mt-4">
                <p>
                    I am a passionate web developer with a knack for creating beautiful, performant, and accessible user experiences.
                    I love working with modern web technologies and building cool things on the internet.
                    Apart from this, I also enjoy employing SEO best practices, as well as writing and content creation.
                </p>

            </div>
            <p className="mt-4">Type '<span className="text-accent-foreground bg-accent px-1 rounded">help</span>' to see the list of available commands.</p>
        </div>
    );
}
