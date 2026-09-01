import { and, desc, eq, isNull } from 'drizzle-orm';
import { getDb } from '@/lib/db';
import type { AdminRole } from '@/lib/models';
import { auditLogs, mediaAssets, programApplications } from '@/lib/db/schema';

export type ApplicationStatus = 'submitted' | 'under_review' | 'revision_required' | 'approved' | 'rejected';

export type ProgramApplicationRecord = {
  id: string;
  applicantUserId: string;
  programSlug: string;
  beneficiaryName: string;
  beneficiaryIdentity: string;
  phone: string;
  address: Record<string, string>;
  details: Record<string, string>;
  existingPhotoUrl: string | null;
  existingPhotoMediaId: string | null;
  existingPhotoAlt: string | null;
  status: ApplicationStatus;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  updatedAt: string;
};

function record(row: typeof programApplications.$inferSelect): ProgramApplicationRecord {
  return {
    id: row.id,
    applicantUserId: row.applicantUserId,
    programSlug: row.programSlug,
    beneficiaryName: row.beneficiaryName,
    beneficiaryIdentity: row.beneficiaryIdentity,
    phone: row.phone,
    address: row.address,
    details: row.details,
    existingPhotoUrl: row.existingPhotoMediaId ? `/api/media/${row.existingPhotoMediaId}` : null,
    existingPhotoMediaId: row.existingPhotoMediaId,
    existingPhotoAlt: row.existingPhotoAlt,
    status: row.status,
    reviewedBy: row.reviewedBy,
    reviewedAt: row.reviewedAt?.toISOString() || null,
    reviewNote: row.reviewNote,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function createProgramApplication(input: {
  applicantUserId: string;
  programSlug: string;
  beneficiaryName: string;
  beneficiaryIdentity: string;
  phone: string;
  address: Record<string, string>;
  details: Record<string, string>;
  existingPhotoUrl?: string | null;
  existingPhotoMedia?: {
    objectKey: string;
    mimeType: string;
    byteSize: number;
    width: number | null;
    height: number | null;
  };
  existingPhotoAlt?: string | null;
}) {
  const db = getDb();
  return db.transaction(async (tx) => {
    const existing = await tx.select({ id: programApplications.id })
      .from(programApplications)
      .where(and(
        eq(programApplications.applicantUserId, input.applicantUserId),
        eq(programApplications.programSlug, input.programSlug),
        isNull(programApplications.deletedAt),
      ))
      .limit(1);
    if (existing[0]) throw new Error('APPLICATION_ALREADY_EXISTS');

    let mediaId: string | null = null;
    if (input.existingPhotoMedia) {
      const media = (await tx.insert(mediaAssets).values({
        ownerId: input.applicantUserId,
        objectKey: input.existingPhotoMedia.objectKey,
        type: 'image',
        mimeType: input.existingPhotoMedia.mimeType,
        byteSize: input.existingPhotoMedia.byteSize,
        width: input.existingPhotoMedia.width,
        height: input.existingPhotoMedia.height,
        altText: input.existingPhotoAlt || 'Foto kondisi awal calon penerima',
        consentStatus: 'confirmed',
        visibility: 'private',
        malwareScanStatus: 'signature_validated',
      }).returning())[0];
      mediaId = media?.id || null;
      if (!mediaId) throw new Error('MEDIA_RECORD_CREATE_FAILED');
    }

    const inserted = await tx.insert(programApplications).values({
      applicantUserId: input.applicantUserId,
      programSlug: input.programSlug,
      beneficiaryName: input.beneficiaryName,
      beneficiaryIdentity: input.beneficiaryIdentity,
      phone: input.phone,
      address: input.address,
      details: input.details,
      existingPhotoUrl: input.existingPhotoMedia ? null : input.existingPhotoUrl || null,
      existingPhotoMediaId: mediaId,
      existingPhotoAlt: input.existingPhotoAlt || null,
      status: 'submitted',
    }).returning();
    const application = inserted[0];
    if (!application) throw new Error('APPLICATION_CREATE_FAILED');
    await tx.insert(auditLogs).values({
      actorUserId: input.applicantUserId,
      actorRole: 'member',
      action: 'program_application.submitted',
      resourceType: 'program_application',
      resourceId: application.id,
      metadata: { programSlug: input.programSlug },
    });
    return record(application);
  });
}

export async function listProgramApplications(options: { applicantUserId?: string } = {}) {
  const conditions = [isNull(programApplications.deletedAt)];
  if (options.applicantUserId) conditions.push(eq(programApplications.applicantUserId, options.applicantUserId));
  const rows = await getDb().select().from(programApplications)
    .where(and(...conditions))
    .orderBy(desc(programApplications.createdAt));
  return rows.map(record);
}

export async function getProgramApplication(id: string) {
  const rows = await getDb().select().from(programApplications)
    .where(and(eq(programApplications.id, id), isNull(programApplications.deletedAt)))
    .limit(1);
  return rows[0] ? record(rows[0]) : null;
}

export async function reviewProgramApplication(input: {
  id: string;
  reviewerUserId: string;
  reviewerRole: AdminRole;
  status: Exclude<ApplicationStatus, 'submitted'>;
  reviewNote?: string;
}) {
  if (input.reviewNote && input.reviewNote.length > 1000) throw new Error('APPLICATION_NOTE_INVALID');
  const db = getDb();
  return db.transaction(async (tx) => {
    const updated = await tx.update(programApplications).set({
      status: input.status,
      reviewedBy: input.reviewerUserId,
      reviewedAt: new Date(),
      reviewNote: input.reviewNote?.trim() || null,
      updatedAt: new Date(),
    }).where(and(eq(programApplications.id, input.id), isNull(programApplications.deletedAt))).returning();
    const application = updated[0];
    if (!application) throw new Error('APPLICATION_NOT_FOUND');
    await tx.insert(auditLogs).values({
      actorUserId: input.reviewerUserId,
      actorRole: input.reviewerRole,
      action: `program_application.${input.status}`,
      resourceType: 'program_application',
      resourceId: input.id,
      metadata: { status: input.status },
    });
    return record(application);
  });
}
