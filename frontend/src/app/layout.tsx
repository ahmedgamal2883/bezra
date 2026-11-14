import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ModeProvider } from '@/lib/dc';
import { FieldProvider } from '@/lib/field';
import { LangProvider } from '@/lib/i18n';
import DemoBadge from '@/components/DemoBadge';
import './globals.css';

export const metadata: Metadata = {
  title: 'Bezra',
  description: 'Try your season before you plant it.',
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = (await cookies()).get('bezra_lang')?.value === 'ar' ? 'ar' : 'en';
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* The design has its own colours: stop the Dark Reader extension from repainting the page
            (it changes SVG attributes before React loads, which causes hydration errors). */}
        <meta name="darkreader-lock" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <LangProvider initial={lang}>
          <ModeProvider>
            <FieldProvider>{children}<DemoBadge /></FieldProvider>
          </ModeProvider>
        </LangProvider>
      </body>
    </html>
  );
}
