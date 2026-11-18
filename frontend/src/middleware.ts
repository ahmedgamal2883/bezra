// Protected pages: without a session cookie, go to Sign in (and come back after).
// The backend checks the session itself on every request; this only avoids showing an empty screen.
import { NextResponse, type NextRequest } from 'next/server';

const PROTECTED = ['/field', '/fields', '/sim', '/ask', '/profile', '/engineer', '/messages', '/report', '/onboarding'];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (!PROTECTED.some((p) => pathname === p || pathname.startsWith(p + '/'))) return NextResponse.next();
  if (req.cookies.get('bezra_session')) return NextResponse.next();
  const url = req.nextUrl.clone();
  url.pathname = '/sign-in';
  url.search = `?next=${encodeURIComponent(pathname + search)}` + (pathname.startsWith('/onboarding') ? '&mode=signup' : '');
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/((?!api|_next|favicon.ico).*)'] };
