'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';

const ClerkProvider = dynamic(
  () => import('@clerk/nextjs').then((module) => module.ClerkProvider),
);

function requiresIdentityProvider(pathname: string | null) {
  if (!pathname) return false;
  return ['/admin', '/akun', '/masuk', '/daftar'].some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export function ClerkProviderBoundary({ children }: Readonly<{ children: React.ReactNode }>) {
  const pathname = usePathname();

  if (!requiresIdentityProvider(pathname)) return children;

  return (
    <ClerkProvider
      signInUrl="/masuk"
      signUpUrl="/daftar"
      signInFallbackRedirectUrl="/akun"
      signUpFallbackRedirectUrl="/akun"
    >
      {children}
    </ClerkProvider>
  );
}
