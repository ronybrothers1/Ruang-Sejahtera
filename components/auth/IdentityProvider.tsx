import { ClerkProvider } from '@clerk/nextjs';
import { isClerkConfigured } from '@/lib/auth/config';

export function IdentityProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isClerkConfigured()) return children;

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
