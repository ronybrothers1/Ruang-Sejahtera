import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import type { AdminRole } from '@/lib/models';

export const ADMIN_SESSION_COOKIE = 'rs_admin_session';
const SESSION_TTL_SECONDS = 4 * 60 * 60;
const roles: AdminRole[] = ['super_admin', 'content_admin', 'finance', 'editor'];

export type AdminSession = {
  id: string;
  email: string;
  role: AdminRole;
  issuedAt: number;
  expiresAt: number;
};

type SessionPayload = {
  sub: string;
  email: string;
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
    email,
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
    if (!payload.sub || !payload.email || !payload.role || !isRole(payload.role)) return null;
    if (!Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)) return null;
    if ((payload.exp as number) <= now || (payload.iat as number) > now + 60) return null;
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      issuedAt: payload.iat as number,
      expiresAt: payload.exp as number,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get(ADMIN_SESSION_COOKIE)?.value;
  return token ? verifyToken(token) : null;
}

export async function requireAdminSession() {
  const session = await getAdminSession();
  if (!session) redirect('/admin/login');
  return session;
}

export function adminSessionCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    path: '/admin',
    maxAge: Math.max(0, expiresAt - Math.floor(Date.now() / 1000)),
  };
}
