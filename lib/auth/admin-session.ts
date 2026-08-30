import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { auth, currentUser } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { isClerkConfigured, isDatabaseConfigured } from '@/lib/auth/config';
import { canAccessControlPlane } from '@/lib/auth/permissions';
import { syncClerkUser } from '@/lib/auth/identity-sync';
import { findUserByIdentityProviderId } from '@/lib/db/users';
import type { AdminRole, MembershipStatus } from '@/lib/models';

export const ADMIN_SESSION_COOKIE = 'rs_admin_session';
const SESSION_TTL_SECONDS = 4 * 60 * 60;
const roles: AdminRole[] = ['super_admin', 'core_manager', 'member'];

export type AdminSession = {
  id: string;
  role: AdminRole;
  email?: string;
  fullName?: string;
  membershipStatus: MembershipStatus;
  identityProviderId?: string;
  authMethod: 'clerk' | 'bootstrap';
  mfaRequired: boolean;
  issuedAt: number;
  expiresAt: number;
};

type SessionPayload = {
  sub: string;
  role: AdminRole;
  iat: number;
  exp: number;
};

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET?.trim() || '';
}

function isRole(value: string): value is AdminRole {
  return roles.includes(value as AdminRole);
}

export function getBootstrapAuthStatus() {
  const production = process.env.VERCEL_ENV === 'production';
  const enabled = process.env.ADMIN_BOOTSTRAP_ENABLED === 'true' && !production;
  const role = process.env.ADMIN_BOOTSTRAP_ROLE?.trim() || '';
  const configured = enabled
    && Boolean(process.env.ADMIN_BOOTSTRAP_EMAIL?.trim())
    && isRole(role)
    && /^[a-f0-9]{64}$/i.test(process.env.ADMIN_BOOTSTRAP_KEY_SHA256?.trim() || '')
    && sessionSecret().length >= 32;

  return {
    enabled,
    configured,
    productionBlocked: production,
  };
}

function hashAccessKey(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

export function verifyBootstrapAccessKey(value: string) {
  const status = getBootstrapAuthStatus();
  if (!status.configured || !value) return false;
  const expectedHex = process.env.ADMIN_BOOTSTRAP_KEY_SHA256?.trim() || '';
  const expected = Buffer.from(expectedHex, 'hex');
  const actual = hashAccessKey(value);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function signPayload(encodedPayload: string) {
  const secret = sessionSecret();
  if (!secret) throw new Error('Admin session secret is not configured.');
  return createHmac('sha256', secret).update(encodedPayload).digest('base64url');
}

export function createBootstrapSessionToken() {
  const email = process.env.ADMIN_BOOTSTRAP_EMAIL?.trim() || '';
  const role = process.env.ADMIN_BOOTSTRAP_ROLE?.trim() || '';
  if (!email || !isRole(role) || !getBootstrapAuthStatus().configured) {
    throw new Error('Bootstrap admin authentication is not configured.');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: SessionPayload = {
    sub: createHash('sha256').update(email.toLowerCase(), 'utf8').digest('hex').slice(0, 24),
    role,
    iat: now,
    exp: now + SESSION_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return {
    token: `${encoded}.${signPayload(encoded)}`,
    expiresAt: payload.exp,
  };
}

function verifyToken(token: string): AdminSession | null {
  if (!getBootstrapAuthStatus().configured) return null;
  const secret = sessionSecret();
  if (!secret) return null;
  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return null;

  const expected = Buffer.from(signPayload(encoded), 'utf8');
  const actual = Buffer.from(signature, 'utf8');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;

  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<SessionPayload>;
    const now = Math.floor(Date.now() / 1000);
    if (!payload.sub || !payload.role || !isRole(payload.role)) return null;
    if (!Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)) return null;
    if ((payload.exp as number) <= now || (payload.iat as number) > now + 60) return null;
    return {
      id: payload.sub,
      role: payload.role,
      fullName: 'Preview administrator',
      membershipStatus: 'active',
      authMethod: 'bootstrap',
      mfaRequired: false,
      issuedAt: payload.iat as number,
      expiresAt: payload.exp as number,
    };
  } catch {
    return null;
  }
}

async function getBootstrapSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

async function getClerkSession(): Promise<AdminSession | null> {
  if (!isClerkConfigured() || !isDatabaseConfigured()) return null;
  const identitySession = await auth();
  if (!identitySession.userId || !identitySession.sessionId) return null;

  let profile = await findUserByIdentityProviderId(identitySession.userId);
  if (!profile) {
    const identityUser = await currentUser();
    if (!identityUser) return null;
    profile = await syncClerkUser(identityUser);
  } else if (profile.role === 'super_admin' && !profile.twoFactorEnabled) {
    const identityUser = await currentUser();
    if (!identityUser) return null;
    profile = await syncClerkUser(identityUser);
  }
  if (!profile.isActive || profile.deletedAt || profile.membershipStatus === 'suspended' || profile.membershipStatus === 'revoked') return null;

  const now = Math.floor(Date.now() / 1000);
  return {
    id: profile.id,
    identityProviderId: identitySession.userId,
    role: profile.role,
    email: profile.email,
    fullName: profile.fullName,
    membershipStatus: profile.membershipStatus,
    authMethod: 'clerk',
    mfaRequired: profile.role === 'super_admin' && !profile.twoFactorEnabled,
    issuedAt: now,
    expiresAt: now + SESSION_TTL_SECONDS,
  };
}

export async function getCurrentUserSession() {
  const clerkSession = await getClerkSession();
  if (clerkSession) return clerkSession;
  if (process.env.VERCEL_ENV === 'production') return null;
  return getBootstrapSession();
}

export const getAdminSession = getCurrentUserSession;

export async function requireUserSession() {
  const session = await getCurrentUserSession();
  if (!session) redirect('/masuk?redirect_url=/akun');
  return session;
}

export async function requireAdminSession() {
  const session = await getCurrentUserSession();
  if (!session) redirect('/admin/login');
  if (!canAccessControlPlane(session.role)) redirect('/akun?error=forbidden');
  if (session.mfaRequired) redirect('/akun/profil?mfa=required');
  return session;
}

export async function requireSuperAdminSession() {
  const session = await requireAdminSession();
  if (session.role !== 'super_admin') redirect('/admin?error=forbidden');
  return session;
}

export function adminSessionCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/',
    maxAge: Math.max(0, expiresAt - Math.floor(Date.now() / 1000)),
  };
}
