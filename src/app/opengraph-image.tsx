import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE, SITE_URL } from '@/data/site';
import { projects } from '@/data/projects';

// Next picks this file up automatically and emits both `og:image` and
// `twitter:image`, so link previews need no further wiring.
//
// Deliberately NOT `runtime = 'edge'`: the default runtime lets Next bake the
// PNG at build time instead of rendering it per crawler request.
export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const ventures = projects.filter(p => p.role === 'Founder').map(p => p.title);
const stack = ['React', 'Next.js', 'Svelte', 'Laravel', 'Flutter'];

// Same monochrome palette as the site's dark theme
const C = {
    bg: '#0a0a0a',
    window: '#111111',
    bar: '#1a1a1a',
    border: '#2a2a2a',
    text: '#fafafa',
    muted: '#a3a3a3',
    faint: '#6b6b6b',
};

/** Source Code Pro to match the site. Satori needs TTF/OTF, which Google
 *  Fonts serves when no browser user-agent is sent. Falls back to the
 *  built-in font if the fetch fails (e.g. an offline build). */
async function loadFont(weight: 400 | 700): Promise<ArrayBuffer | null> {
    try {
        const css = await fetch(
            `https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@${weight}`
        ).then(res => res.text());
        const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
        return url ? await fetch(url).then(res => res.arrayBuffer()) : null;
    } catch {
        return null;
    }
}

/** Rendered at build/request time as the link-preview card: a terminal window
 *  matching the site itself. Satori only supports flexbox, so every container
 *  below sets `display: flex` explicitly. */
export default async function Image() {
    const [regular, bold, logo] = await Promise.all([
        loadFont(400),
        loadFont(700),
        readFile(join(process.cwd(), 'public/logo.png')).then(
            buf => `data:image/png;base64,${buf.toString('base64')}`
        ),
    ]);

    const fonts = [
        regular && { name: 'Source Code Pro', data: regular, weight: 400 as const, style: 'normal' as const },
        bold && { name: 'Source Code Pro', data: bold, weight: 700 as const, style: 'normal' as const },
    ].filter((font): font is NonNullable<typeof font> => Boolean(font));

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 48,
                    background: C.bg,
                    fontFamily: fonts.length ? 'Source Code Pro' : undefined,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        borderRadius: 16,
                        border: `2px solid ${C.border}`,
                        background: C.window,
                        overflow: 'hidden',
                        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                    }}
                >
                    {/* Title bar */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            padding: '16px 24px',
                            background: C.bar,
                            borderBottom: `2px solid ${C.text}`,
                        }}
                    >
                        <div style={{ display: 'flex', width: 16, height: 16, borderRadius: 999, background: '#ef4444' }} />
                        <div style={{ display: 'flex', width: 16, height: 16, borderRadius: 999, background: '#eab308' }} />
                        <div style={{ display: 'flex', width: 16, height: 16, borderRadius: 999, background: '#22c55e' }} />
                        <div style={{ display: 'flex', flex: 1, justifyContent: 'center', color: C.muted, fontSize: 20 }}>
                            ahmad.bat
                        </div>
                        <div style={{ display: 'flex', width: 68 }} />
                    </div>

                    {/* Body */}
                    <div style={{ display: 'flex', flex: 1, alignItems: 'center', padding: '0 56px', gap: 48 }}>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <div style={{ display: 'flex', fontSize: 24, color: C.faint }}>
                                <span style={{ color: C.text, fontWeight: 700 }}>AHMAD@cli</span>
                                <span>:~$ whoami</span>
                            </div>

                            <div
                                style={{
                                    display: 'flex',
                                    fontSize: 76,
                                    fontWeight: 700,
                                    color: C.text,
                                    marginTop: 14,
                                    letterSpacing: -2,
                                }}
                            >
                                {SITE.name}
                            </div>

                            <div style={{ display: 'flex', fontSize: 24, color: C.muted, marginTop: 4 }}>
                                {SITE.role}
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 30, fontSize: 22 }}>
                                <span style={{ color: C.faint }}>Founder of</span>
                                {ventures.map(name => (
                                    <div
                                        key={name}
                                        style={{
                                            display: 'flex',
                                            padding: '6px 14px',
                                            borderRadius: 8,
                                            border: `1px solid ${C.border}`,
                                            background: C.bar,
                                            color: C.text,
                                            fontWeight: 700,
                                        }}
                                    >
                                        {name}
                                    </div>
                                ))}
                            </div>

                            <div style={{ display: 'flex', marginTop: 18, fontSize: 22, color: C.faint }}>
                                {stack.join(' · ')}
                            </div>
                        </div>

                        <img
                            src={logo}
                            width={200}
                            height={200}
                            style={{ borderRadius: 24, border: `2px solid ${C.border}` }}
                        />
                    </div>

                    {/* Footer */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '18px 56px',
                            borderTop: `1px dashed ${C.border}`,
                            fontSize: 20,
                        }}
                    >
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                padding: '6px 14px',
                                borderRadius: 999,
                                background: C.bar,
                                color: C.text,
                                fontWeight: 700,
                            }}
                        >
                            <div style={{ display: 'flex', width: 12, height: 12, borderRadius: 999, background: '#22c55e' }} />
                            Available for work
                        </div>
                        <div style={{ display: 'flex', color: C.faint }}>
                            {SITE_URL.replace(/^https?:\/\//, '')}
                        </div>
                    </div>
                </div>
            </div>
        ),
        { ...size, fonts }
    );
}
