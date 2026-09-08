import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const pathname = request.nextUrl.pathname; 

  if ((pathname === '/login' || pathname === '/') && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  const isAdminRoute = pathname.startsWith('/dashboard') || 
                       pathname.startsWith('/items') || 
                       pathname.startsWith('/warehouses') || 
                       pathname.startsWith('/locations') || 
                       pathname.startsWith('/mutations');
  
  if (isAdminRoute && !token) {
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
    '/mutations/:path*'
  ],
};