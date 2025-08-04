export function Home() {
    return (
        <div>
           <pre className="text-primary whitespace-pre-wrap text-[0.55rem] sm:text-xs md:text-base">

{`
        _                         _                       _    __       _ _        
   __ _| |__  _ __ ___   __ _  __| |     _ __   ___  _ __| |_ / _| ___ | (_) ___   
  / _\` | '_ \| '_ \` _ \\ / _\` |/ _\` |    | '_ \\ / _ \\| '__| __| |_ / _ \\| | |/ _ \\  
 | (_| | | | | | | | | | (_| | (_| |    | |_) | (_) | |  | |_|  _| (_) | | | (_) | 
  \\__,_|_| |_|_| |_| |_|\\__,_|\\__,_|____| .__/ \\___/|_|   \\__|_|  \\___/|_|_|\\___(_)
                                  |_____|_|

`}
            </pre>
            <p>Welcome to my interactive CLI portfolio.</p>
            <p className="mt-2">Type '<span className="text-accent-foreground bg-accent px-1 rounded">help</span>' to see the list of available commands.</p>
        </div>
    );
}
