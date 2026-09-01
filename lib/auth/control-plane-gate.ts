import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import type { AdminSession } from '@/lib/auth/admin-session';

/**
 * A short-lived, session-bound approval is a compensating control for teams
 * that cannot enable Clerk MFA yet. It must never silently replace MFA: the
 * default remains `mfa`, and approval mode is activated explicitly through
 * deployment secrets.
 */
export const CONTROL_PLANE_APPROVAL_COOKIE = 'rs_control_plane_approval';
export const CONTROL_PLANE_APPROVAL_TTL_SECONDS = 30 * 60;

type ApprovalPayload = {
  v: 1;
  sub: string;
  sid: string;
  iat: number;
  exp: number;
};

export type ControlPlaneSecurityStatus = {
  mode: 'mfa' | 'approval';
  configured: boolean;
  configurationError: boolean;
  approvalTtlSeconds: number;
};

function approvalKeyHash() {
  return process.env.ADMIN_CONTROL_PLANE_APPROVAL_KEY_SHA256?.trim() || '';
}

function approvalSecret() {
  return process.env.ADMIN_CONTROL_PLANE_APPROVAL_SECRET?.trim() || '';
}

function hashApprovalKey(value: string) {
  return createHash('sha256').update(value, 'utf8').digest();
}

function isSha256Hex(value: string) {
  return /^[a-f0-9]{64}$/i.test(value);
}

export function getControlPlaneSecurityStatus(): ControlPlaneSecurityStatus {
  const requestedMode = process.env.ADMIN_CONTROL_PLANE_MODE?.trim().toLowerCase() || 'mfa';
  const validMode = requestedMode === 'mfa' || requestedMode === 'approval';
  const mode: ControlPlaneSecurityStatus['mode'] = requestedMode === 'approval' ? 'approval' : 'mfa';
  const approvalConfigured = isSha256Hex(approvalKeyHash()) && approvalSecret().length >= 32;

  return {
    mode,
    configured: mode === 'mfa' || approvalConfigured,
    configurationError: !validMode || (mode === 'approval' && !approvalConfigured),
    approvalTtlSeconds: CONTROL_PLANE_APPROVAL_TTL_SECONDS,
  };
}

export function isControlPlaneApprovalConfigured() {
  const status = getControlPlaneSecurityStatus();
  return status.mode === 'approval' && status.configured && !status.configurationError;
}

export function verifyControlPlaneApprovalKey(value: string) {
  if (!isControlPlaneApprovalConfigured() || value.length < 32 || value.length > 512) return false;
  const expected = Buffer.from(approvalKeyHash(), 'hex');
  const actual = hashApprovalKey(value);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

function signPayload(encodedPayload: string) {
  return createHmac('sha256', approvalSecret()).update(encodedPayload).digest('base64url');
}

export function createControlPlaneApprovalToken(input: { subject: string; sessionId: string }) {
  if (!isControlPlaneApprovalConfigured() || !input.subject || !input.sessionId) {
    throw new Error('CONTROL_PLANE_APPROVAL_NOT_CONFIGURED');
  }

  const now = Math.floor(Date.now() / 1000);
  const payload: ApprovalPayload = {
    v: 1,
    sub: input.subject,
    sid: input.sessionId,
    iat: now,
    exp: now + CONTROL_PLANE_APPROVAL_TTL_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  return {
    token: `${encoded}.${signPayload(encoded)}`,
    expiresAt: payload.exp,
  };
}

function verifyApprovalToken(token: string, expected: { subject: string; sessionId: string }) {
  if (!isControlPlaneApprovalConfigured() || !token || !expected.subject || !expected.sessionId) return false;

  const [encoded, signature, extra] = token.split('.');
  if (!encoded || !signature || extra) return false;

  try {
    const expectedSignature = Buffer.from(signPayload(encoded), 'utf8');
    const actualSignature = Buffer.from(signature, 'utf8');
    if (expectedSignature.length !== actualSignature.length || !timingSafeEqual(expectedSignature, actualSignature)) return false;

    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8')) as Partial<ApprovalPayload>;
    const now = Math.floor(Date.now() / 1000);
    if (payload.v !== 1 || payload.sub !== expected.subject || payload.sid !== expected.sessionId) return false;
    if (!Number.isInteger(payload.iat) || !Number.isInteger(payload.exp)) return false;
    if ((payload.exp as number) <= now || (payload.iat as number) > now + 60) return false;
    return true;
  } catch {
    return false;
  }
}

export async function hasValidControlPlaneApproval(session: Pick<AdminSession, 'identityProviderId' | 'sessionId'>) {
  if (!session.identityProviderId || !session.sessionId || !isControlPlaneApprovalConfigured()) return false;

  try {
    const store = await cookies();
    const token = store.get(CONTROL_PLANE_APPROVAL_COOKIE)?.value || '';
    return verifyApprovalToken(token, { subject: session.identityProviderId, sessionId: session.sessionId });
  } catch {
    return false;
  }
}

export function controlPlaneApprovalCookieOptions(expiresAt: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || Boolean(process.env.VERCEL_ENV),
    sameSite: 'strict' as const,
    path: '/',
    maxAge: Math.max(0, expiresAt - Math.floor(Date.now() / 1000)),
  };
}
