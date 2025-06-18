// This is AI Generted.

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Rate limiting store (in production, use MongoDB, external service, or distributed cache)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 5 * 60 * 1000);

// Rate limiting function
function rateLimit(request: NextRequest, limit: number = 100, windowMs: number = 15 * 60 * 1000) {
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
    const key = `${ip}:${request.nextUrl.pathname}`;
  const now = Date.now();
  
  const requestLog = rateLimitMap.get(key);
  
  if (!requestLog || now > requestLog.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + windowMs });
    return false;
  }
  
  if (requestLog.count >= limit) {
    return true;
  }
  
  requestLog.count++;
  return false;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Security headers
  const response = NextResponse.next();
  
  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set(
    'Strict-Transport-Security',
    'max-age=31536000; includeSubDomains; preload'
  );
  
  // Content Security Policy
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://accounts.google.com",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https: blob:",
    "connect-src 'self' https://accounts.google.com https://www.googleapis.com",
    "frame-src 'self' https://accounts.google.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "upgrade-insecure-requests"
  ].join('; ');
  
  response.headers.set('Content-Security-Policy', csp);
  
  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    let limit = 100; // Default rate limit
    let windowMs = 15 * 60 * 1000; // 15 minutes
    
    // Stricter limits for auth endpoints
    if (pathname.startsWith('/api/auth/')) {
      limit = 20;
      windowMs = 15 * 60 * 1000; // 15 minutes
    }
    
    // Extra strict for signup
    if (pathname === '/api/auth/signup') {
      limit = 5;
      windowMs = 15 * 60 * 1000; // 15 minutes
    }
    
    // Check rate limit
    if (rateLimit(request, limit, windowMs)) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many requests',
          code: 'RATE_LIMIT_EXCEEDED',
          message: 'Please try again later'
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': '900' // 15 minutes
          }
        }
      );
    }
  }
  
  // Authentication protection for specific routes
  const protectedRoutes = [
    '/dashboard',
    '/profile',
    '/settings',
    '/api/user',
    '/api/flights/search',
    '/api/user/search-history'
  ];
  
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    if (!token) {
      // If it's an API route, return JSON error
      if (pathname.startsWith('/api/')) {
        return new NextResponse(
          JSON.stringify({
            error: 'Authentication required',
            code: 'UNAUTHORIZED'
          }),
          {
            status: 401,
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );
      }
      
      // For page routes, redirect to signin
      const signInUrl = new URL('/auth/signin', request.url);
      signInUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(signInUrl);
    }
  }
  
  // Redirect authenticated users away from auth pages
  const authPages = ['/auth/signin', '/auth/signup'];
  const isAuthPage = authPages.includes(pathname);
  
  if (isAuthPage) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });
    
    if (token) {
      const callbackUrl = request.nextUrl.searchParams.get('callbackUrl') || '/';
      return NextResponse.redirect(new URL(callbackUrl, request.url));
    }
  }
  
  // CORS headers for API routes
  if (pathname.startsWith('/api/')) {
    response.headers.set('Access-Control-Allow-Origin', process.env.NODE_ENV === 'production' ? 'https://yourdomain.com' : '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, { status: 200, headers: response.headers });
    }
  }
  
  // Add request ID for tracking
  const requestId = crypto.randomUUID();
  response.headers.set('X-Request-ID', requestId);
  
  // Log requests (in production, use proper logging service)
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${new Date().toISOString()}] ${request.method} ${pathname} - ${requestId}`);
  }
  
  return response;
}

// Configure which routes the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$|.*\\.ico$).*)',
  ],
};
