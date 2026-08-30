import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { isClerkConfigured } from '@/lib/auth/config';

const isAccountRoute = createRouteMatcher(['/akun(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
const isPublicAdminAuthRoute = createRouteMatcher(['/admin/login', '/api/admin/session', '/api/admin/logout']);

const productionIdentityMiddleware = clerkMiddleware(async (auth, request) => {
  if (isAccountRoute(request) || (isAdminRoute(request) && !isPublicAdminAuthRoute(request))) {
    await auth.protect();
  }
}, {
  frontendApiProxy: { enabled: (url) => url.hostname === 'ruang-sejahtera-iota.vercel.app' },
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) return NextResponse.next();
  return productionIdentityMiddleware(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
