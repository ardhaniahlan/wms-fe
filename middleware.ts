import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  const path = request.nextUrl.pathname;
  const isPublicPath = path === '/login' || path === '/';

  if (token && isPublicPath) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && !isPublicPath && path !== '/track') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/items/:path*',
    '/warehouses/:path*',
    '/locations/:path*',
    '/mutations/:path*',
  ],
};