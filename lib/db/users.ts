import { and, eq, isNull } from 'drizzle-orm';
import type { MembershipStatus, UserRole } from '@/lib/models';
import { getDb } from '@/lib/db';
import { auditLogs, users, type UserRow } from '@/lib/db/schema';

export type IdentityProfileInput = {
  identityProviderId: string;
  email: string;
  emailVerified: boolean;
  fullName: string;
  profileImageUrl?: string | null;
  twoFactorEnabled: boolean;
  lastSignInAt?: Date | null;
};

const FALLBACK_IDENTITY_NAME = 'Calon Anggota';

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function nextVerifiedStatus(role: UserRole, current: MembershipStatus, emailVerified: boolean): MembershipStatus {
  if (role === 'super_admin') return 'active';
  if (emailVerified && current === 'registered') return 'email_verified';
  return current;
}

export async function findUserByIdentityProviderId(identityProviderId: string) {
  const rows = await getDb().select().from(users).where(eq(users.identityProviderId, identityProviderId)).limit(1);
  return rows[0] || null;
}

export async function findUserByEmail(email: string) {
  const rows = await getDb().select().from(users).where(eq(users.email, normalizeEmail(email))).limit(1);
  return rows[0] || null;
}

export async function syncIdentityProfile(input: IdentityProfileInput): Promise<UserRow> {
  const db = getDb();
  const email = normalizeEmail(input.email);
  if (!email || !input.identityProviderId) throw new Error('IDENTITY_PROFILE_INVALID');

  const byIdentity = await findUserByIdentityProviderId(input.identityProviderId);
  if (byIdentity) {
    const membershipStatus = nextVerifiedStatus(byIdentity.role, byIdentity.membershipStatus, input.emailVerified);
    const updated = await db.update(users).set({
      email,
      emailVerified: input.emailVerified,
      fullName: input.fullName === FALLBACK_IDENTITY_NAME ? byIdentity.fullName : input.fullName,
      profileImageUrl: input.profileImageUrl || null,
      twoFactorEnabled: input.twoFactorEnabled,
      lastSignInAt: input.lastSignInAt || byIdentity.lastSignInAt,
      membershipStatus,
      isActive: byIdentity.isActive,
      deletedAt: byIdentity.deletedAt,
      updatedAt: new Date(),
    }).where(eq(users.id, byIdentity.id)).returning();
    return updated[0];
  }

  const byEmail = await findUserByEmail(email);
  if (byEmail) {
    if (byEmail.identityProviderId && byEmail.identityProviderId !== input.identityProviderId) {
      throw new Error('IDENTITY_EMAIL_CONFLICT');
    }
    if (byEmail.role !== 'member' && !input.emailVerified) {
      throw new Error('PRIVILEGED_EMAIL_NOT_VERIFIED');
    }
    if (byEmail.deletedAt && byEmail.role !== 'member') {
      throw new Error('PRIVILEGED_REACTIVATION_REQUIRES_ADMIN');
    }
    if (byEmail.membershipStatus === 'suspended' || byEmail.membershipStatus === 'revoked') {
      throw new Error('MEMBERSHIP_INACTIVE');
    }
    const membershipStatus = nextVerifiedStatus(byEmail.role, byEmail.membershipStatus, input.emailVerified);
    const attached = await db.update(users).set({
      identityProviderId: input.identityProviderId,
      emailVerified: input.emailVerified,
      fullName: input.fullName === FALLBACK_IDENTITY_NAME ? byEmail.fullName : input.fullName,
      profileImageUrl: input.profileImageUrl || null,
      twoFactorEnabled: input.twoFactorEnabled,
      lastSignInAt: input.lastSignInAt || null,
      membershipStatus,
      isActive: true,
      deletedAt: null,
      updatedAt: new Date(),
    }).where(and(eq(users.id, byEmail.id), isNull(users.identityProviderId))).returning();
    if (!attached[0]) throw new Error('IDENTITY_ATTACH_CONFLICT');
    return attached[0];
  }

  const membershipStatus: MembershipStatus = input.emailVerified ? 'email_verified' : 'registered';
  const inserted = await db.insert(users).values({
    identityProviderId: input.identityProviderId,
    email,
    emailVerified: input.emailVerified,
    fullName: input.fullName,
    profileImageUrl: input.profileImageUrl || null,
    role: 'member',
    membershipStatus,
    twoFactorEnabled: input.twoFactorEnabled,
    lastSignInAt: input.lastSignInAt || null,
  }).returning();
  return inserted[0];
}

export async function deactivateIdentityUser(identityProviderId: string) {
  const db = getDb();
  const existing = await findUserByIdentityProviderId(identityProviderId);
  if (!existing) return null;
  const deactivated = await db.update(users).set({
    isActive: false,
    identityProviderId: null,
    deletedAt: new Date(),
    updatedAt: new Date(),
  }).where(eq(users.id, existing.id)).returning();
  return deactivated[0] || null;
}

export async function seedInitialSuperAdmin(input: { email: string; fullName: string }) {
  const db = getDb();
  const email = normalizeEmail(input.email);
  const fullName = input.fullName.trim();
  if (!email || !fullName) throw new Error('SUPER_ADMIN_SEED_INVALID');

  const existingSuperAdmins = await db.select({ id: users.id, email: users.email })
    .from(users)
    .where(eq(users.role, 'super_admin'))
    .limit(2);
  if (existingSuperAdmins.some((item) => item.email !== email)) {
    throw new Error('SUPER_ADMIN_ALREADY_EXISTS');
  }

  const existing = await findUserByEmail(email);
  let superAdmin: UserRow;
  if (existing) {
    const updated = await db.update(users).set({
      fullName,
      role: 'super_admin',
      membershipStatus: 'active',
      isActive: true,
      deletedAt: null,
      updatedAt: new Date(),
    }).where(eq(users.id, existing.id)).returning();
    superAdmin = updated[0];
  } else {
    const inserted = await db.insert(users).values({
      email,
      fullName,
      role: 'super_admin',
      membershipStatus: 'active',
      isActive: true,
    }).returning();
    superAdmin = inserted[0];
  }

  await db.insert(auditLogs).values({
    actorUserId: superAdmin.id,
    actorRole: 'super_admin',
    action: 'identity.super_admin_seeded',
    resourceType: 'user',
    resourceId: superAdmin.id,
    metadata: { source: 'controlled_seed' },
  });
  return superAdmin;
}
