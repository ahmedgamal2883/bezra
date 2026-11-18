import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { ModeProvider } from '@/lib/dc';
import { FieldProvider } from '@/lib/field';
import { LangProvider } from '@/lib/i18n';
import DemoBadge from '@/components/DemoBadge';
import KeyboardWatch from '@/components/KeyboardWatch';
import RouteMotion from '@/components/RouteMotion';
import Offline from '@/components/Offline';
import WakeUp from '@/components/WakeUp';
import { TourProvider } from '@/components/Tour';
import './globals.css';
import './v2.css';
import './v2-app.css';

const TAGLINE = 'Healthy soil, stronger harvests';
const SHARE = 'NASA satellite data for every field.';

export const metadata: Metadata = {
  title: 'Bezra',
  description: `${TAGLINE}. ${SHARE}`,
  // what a shared link shows (WhatsApp, Facebook, X, Telegram): the tagline as the title, big
  openGraph: { title: `Bezra: ${TAGLINE}`, description: SHARE, siteName: 'Bezra', type: 'website' },
  twitter: { card: 'summary', title: `Bezra: ${TAGLINE}`, description: SHARE },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const lang = (await cookies()).get('bezra_lang')?.value === 'ar' ? 'ar' : 'en';
  return (
    <html lang={lang} dir={lang === 'ar' ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        {/* The design has its own colours: stop the Dark Reader extension from repainting the page
            (it changes SVG attributes before React loads, which causes hydration errors). */}
        <meta name="darkreader-lock" />
        {/* Language and direction from the cookie before anything paints (pre-built pages are built in English). */}
        <script dangerouslySetInnerHTML={{ __html: "try{var a=/(?:^|; )bezra_lang=ar/.test(document.cookie);var h=document.documentElement;h.lang=a?'ar':'en';h.dir=a?'rtl':'ltr'}catch(e){}" }} />
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
            <FieldProvider><TourProvider>{children}</TourProvider><DemoBadge /><KeyboardWatch /><WakeUp /><RouteMotion /><Offline /></FieldProvider>
          </ModeProvider>
        </LangProvider>
      </body>
    </html>
  );
}
