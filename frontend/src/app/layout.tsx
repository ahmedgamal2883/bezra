import type { Metadata } from 'next';
import { ModeProvider } from '@/lib/dc';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bezra',
  description: 'Try your season before you plant it.',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ModeProvider>{children}</ModeProvider>
      </body>
    </html>
  );
}
