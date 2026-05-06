import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ACCESS_TOKEN_COOKIE = 'fidelai_access';

function isExpiredJwt(token: string) {
  try {
    const payload = token.split('.')[1];
    if (!payload) return true;
    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = JSON.parse(atob(normalized));
    return typeof decoded.exp === 'number' ? Date.now() >= decoded.exp * 1000 : true;
  } catch {
    return true;
  }
}

export function middleware(request: NextRequest) {
  const token = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  const roleRoutes = ['/contributor', '/annotator', '/expert', '/buyer', '/admin'];
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/onboarding') ||
    roleRoutes.some((path) => request.nextUrl.pathname.startsWith(path));
  const isAuthRoute = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'].some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtectedRoute && (!token || isExpiredJwt(token))) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthRoute && token && !isExpiredJwt(token)) {
    return NextResponse.redirect(new URL('/dashboard/profile', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/contributor/:path*',
    '/annotator/:path*',
    '/expert/:path*',
    '/buyer/:path*',
    '/admin/:path*',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password/:path*',
  ],
};
