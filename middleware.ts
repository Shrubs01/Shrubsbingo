import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes, excluding /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    const adminAuth = request.cookies.get('sb_admin_auth');
    if (!adminAuth || !adminAuth.value) {
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  // If already authenticated and visits /admin/login, redirect to /admin dashboard
  if (pathname === '/admin/login') {
    const adminAuth = request.cookies.get('sb_admin_auth');
    if (adminAuth && adminAuth.value) {
      const adminUrl = new URL('/admin', request.url);
      return NextResponse.redirect(adminUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
