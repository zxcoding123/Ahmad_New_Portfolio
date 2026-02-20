import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import ChatBot from '@/components/ChatBot';

export const metadata: Metadata = {
  title: 'AHMAD PORTFOLIO',
  description: 'AHMAD AQUINO PORTFOLIO',
  icons: {
    icon: "/public/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script defer src="https://cloud.umami.is/script.js" data-website-id="8613acb8-0126-42fb-824f-7d4a0a11cd8d"></script>
        <link href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;700&display=swap" rel="stylesheet" />
          <link rel="icon" type="image/x-icon" href="/public/logo.png"></link>
      </head>
      <body className="font-code antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <ChatBot />
        </ThemeProvider>
      </body>
    </html>
  );
}