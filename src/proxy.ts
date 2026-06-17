import { NextRequest, NextResponse } from 'next/server';

// Routes that need login
const NEEDS_LOGIN = ['/dashboard', '/stuti', '/certificate', '/payment'];
// Routes only for guests (logged-out users)
const GUEST_ONLY = ['/login'];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('hk_session')?.value;

  if (NEEDS_LOGIN.some((p) => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (GUEST_ONLY.some((p) => pathname.startsWith(p)) && token) {
    return NextResponse.redirect(new URL('/payment', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/stuti/:path*',
    '/certificate/:path*',
    '/payment/:path*',
    '/login',
  ],
};
