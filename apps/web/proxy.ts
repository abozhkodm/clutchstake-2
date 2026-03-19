import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const PRIVATE_ROUTES = ['/dashboard', '/game', '/lobby', '/profile', '/wallet'];
const PUBLIC_AUTH_ROUTES = ['/auth'];
const TOKEN_KEY = 'cs_token';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(TOKEN_KEY)?.value;

  const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));
  const isPublicAuth = PUBLIC_AUTH_ROUTES.some((route) => pathname.startsWith(route));

  if (isPrivate && !token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  if (isPublicAuth && token && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
