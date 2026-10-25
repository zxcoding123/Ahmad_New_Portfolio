export function Theme() {
    return (
        <div>
            <p>Usage: theme &lt;light|dark|system|crt&gt;</p>
            <p>Example: <span className="text-accent-foreground bg-accent px-1 rounded">theme dark</span></p>
            <p>
                <span className="text-accent-foreground bg-accent px-1 rounded">theme crt</span> toggles a
                retro CRT screen on top of either theme.
            </p>
        </div>
    );
}
