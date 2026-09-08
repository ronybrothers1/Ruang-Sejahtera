import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server';
import { isClerkConfigured } from '@/lib/auth/config';

const isAccountRoute = createRouteMatcher(['/akun(.*)']);
const isAdminRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
const isPublicAdminAuthRoute = createRouteMatcher(['/admin/login']);

const identityMiddleware = clerkMiddleware(async (auth, request) => {
  if (isAccountRoute(request) || (isAdminRoute(request) && !isPublicAdminAuthRoute(request))) {
    await auth.protect();
  }
});

export default function proxy(request: NextRequest, event: NextFetchEvent) {
  if (!isClerkConfigured()) return NextResponse.next();
  return identityMiddleware(request, event);
}

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
