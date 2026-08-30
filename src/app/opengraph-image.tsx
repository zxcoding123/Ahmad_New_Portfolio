import { ImageResponse } from 'next/og';
import { SITE, SITE_URL } from '@/data/site';

// Next picks this file up automatically and emits both `og:image` and
// `twitter:image`, so link previews need no further wiring.
//
// Deliberately NOT `runtime = 'edge'`: the default runtime lets Next bake the
// PNG at build time instead of rendering it per crawler request.
export const alt = `${SITE.name} — ${SITE.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/** Rendered at build/request time as the link-preview card: a terminal window
 *  matching the site itself. Satori only supports flexbox, so every container
 *  below sets `display: flex` explicitly. */
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#0b0f14',
                    padding: 56,
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        borderRadius: 18,
                        border: '3px solid #2b3648',
                        background: '#111820',
                        overflow: 'hidden',
                    }}
                >
                    {/* Title bar */}
                    <div
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '20px 26px',
                            background: '#1a2430',
                            borderBottom: '3px solid #7dd3fc',
                        }}
                    >
                        <div style={{ display: 'flex', width: 20, height: 20, borderRadius: 999, background: '#ef4444' }} />
                        <div style={{ display: 'flex', width: 20, height: 20, borderRadius: 999, background: '#eab308' }} />
                        <div style={{ display: 'flex', width: 20, height: 20, borderRadius: 999, background: '#22c55e' }} />
                        <div
                            style={{
                                display: 'flex',
                                flex: 1,
                                justifyContent: 'center',
                                color: '#8fa3bb',
                                fontSize: 24,
                            }}
                        >
                            ahmad.bat
                        </div>
                    </div>

                    {/* Body */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            flex: 1,
                            padding: '0 56px',
                        }}
                    >
                        <div style={{ display: 'flex', fontSize: 28, color: '#7dd3fc' }}>
                            AHMAD@cli:~$ whoami
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                fontSize: 82,
                                fontWeight: 700,
                                color: '#f8fafc',
                                marginTop: 18,
                                letterSpacing: -1,
                            }}
                        >
                            {SITE.name}
                        </div>

                        <div style={{ display: 'flex', fontSize: 40, color: '#7dd3fc', marginTop: 6 }}>
                            {SITE.role}
                        </div>

                        <div
                            style={{
                                display: 'flex',
                                fontSize: 26,
                                color: '#94a3b8',
                                marginTop: 26,
                                maxWidth: 900,
                                lineHeight: 1.45,
                            }}
                        >
                            React · Next.js · Svelte · Laravel · TypeScript — building fast,
                            accessible things for the web.
                        </div>

                        <div style={{ display: 'flex', fontSize: 26, color: '#64748b', marginTop: 34 }}>
                            {SITE_URL.replace(/^https?:\/\//, '')}
                        </div>
                    </div>
                </div>
            </div>
        ),
        size
    );
}
