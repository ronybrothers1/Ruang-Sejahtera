import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { isClerkConfigured, isDatabaseConfigured } from '@/lib/auth/config';
import { canAccessControlPlane } from '@/lib/auth/permissions';
import { syncClerkUser } from '@/lib/auth/identity-sync';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import type { AdminRole, MembershipStatus } from '@/lib/models';

const SESSION_DISPLAY_TTL_SECONDS = 24 * 60 * 60;

export type AdminSession = {
  id: string;
  role: AdminRole;
  email?: string;
  fullName?: string;
  membershipStatus: MembershipStatus;
  identityProviderId: string;
  sessionId: string;
  /** Runtime Phase 1 sessions are Clerk-only. The legacy union is temporary type compatibility for older endpoint code. */
  authMethod: 'clerk' | 'bootstrap';
  /** Kept for backward-compatible UI contracts. MFA is not an application access gate. */
  mfaRequired: false;
  issuedAt: number;
  expiresAt: number;
};

async function getClerkSession(): Promise<AdminSession | null> {
  if (!isClerkConfigured() || !isDatabaseConfigured()) return null;

  const identitySession = await auth();
  if (!identitySession.userId || !identitySession.sessionId) return null;

  let profile = await findUserByIdentityProviderId(identitySession.userId);
  if (!profile) {
    const identityUser = await currentUser();
    if (!identityUser) return null;
    profile = await syncClerkUser(identityUser);
  }

  if (
    !profile.isActive
    || profile.deletedAt
    || profile.membershipStatus === 'suspended'
    || profile.membershipStatus === 'revoked'
  ) return null;

  const now = Math.floor(Date.now() / 1000);
  const claimExpiry = identitySession.sessionClaims?.exp;

  return {
    id: profile.id,
    identityProviderId: identitySession.userId,
    sessionId: identitySession.sessionId,
    role: profile.role,
    email: profile.email,
    fullName: profile.fullName,
    membershipStatus: profile.membershipStatus,
    authMethod: 'clerk',
    mfaRequired: false,
    issuedAt: now,
    expiresAt: typeof claimExpiry === 'number' ? claimExpiry : now + SESSION_DISPLAY_TTL_SECONDS,
  };
}

export async function getCurrentUserSession() {
  return getClerkSession();
}

export const getAdminSession = getCurrentUserSession;

export function hasControlPlaneAccess(session: AdminSession) {
  return canAccessControlPlane(session.role);
}

export async function requireUserSession() {
  const session = await getCurrentUserSession();
  if (!session) redirect('/masuk?redirect_url=%2Fakun');
  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentUserSession();
  if (!session) redirect('/masuk?redirect_url=%2Fadmin');
  if (!canAccessControlPlane(session.role)) redirect('/akun?error=forbidden');
  return session;
}

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();
  if (session.role !== 'super_admin') redirect('/admin?error=forbidden');
  return session;
}
