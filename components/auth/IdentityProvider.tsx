import { isClerkConfigured } from '@/lib/auth/config';
import { ClerkProviderBoundary } from '@/components/auth/ClerkProviderBoundary';

export function IdentityProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  if (!isClerkConfigured()) return children;

  return <ClerkProviderBoundary>{children}</ClerkProviderBoundary>;
}
