import {
  boolean,
  check,
  date,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  numeric,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { isNull, sql } from 'drizzle-orm';

export const userRoleEnum = pgEnum('user_role', ['super_admin', 'core_manager', 'member']);
export const membershipStatusEnum = pgEnum('membership_status', [
  'registered',
  'email_verified',
  'data_review',
  'exam_eligible',
  'exam_completed',
  'passed',
  'failed',
  'admin_approved',
  'active',
  'suspended',
  'revoked',
]);
export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'pending_review',
  'revision_required',
  'approved',
  'rejected',
  'published',
  'archived',
]);
export const contentTypeEnum = pgEnum('content_type', ['article', 'activity', 'gallery']);
export const mediaTypeEnum = pgEnum('media_type', ['image', 'video', 'document', 'external_video']);
export const mediaVisibilityEnum = pgEnum('media_visibility', ['private', 'restricted', 'public']);
export const consentStatusEnum = pgEnum('consent_status', ['confirmed', 'restricted', 'not_required', 'unknown']);
export const examAttemptStatusEnum = pgEnum('exam_attempt_status', ['in_progress', 'submitted', 'graded', 'invalidated']);
export const cardStatusEnum = pgEnum('member_card_status', ['active', 'revoked', 'expired']);
export const programApplicationStatusEnum = pgEnum('program_application_status', ['submitted', 'under_review', 'revision_required', 'approved', 'rejected']);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  identityProviderId: text('identity_provider_id').unique(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  fullName: text('full_name').notNull(),
  profileImageUrl: text('profile_image_url'),
  role: userRoleEnum('role').default('member').notNull(),
  membershipStatus: membershipStatusEnum('membership_status').default('registered').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  lastSignInAt: timestamp('last_sign_in_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('users_role_status_idx').on(table.role, table.membershipStatus),
]);

export const membershipApplications = pgTable('membership_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }).unique(),
  phone: text('phone'),
  birthPlace: text('birth_place'),
  birthDate: date('birth_date'),
  occupation: text('occupation'),
  address: jsonb('address').$type<Record<string, string>>().default({}).notNull(),
  motivation: text('motivation'),
  emergencyContact: jsonb('emergency_contact').$type<Record<string, string>>().default({}).notNull(),
  requirementsComplete: boolean('requirements_complete').default(false).notNull(),
  privacyConsentAt: timestamp('privacy_consent_at', { withTimezone: true }),
  documentationConsentAt: timestamp('documentation_consent_at', { withTimezone: true }),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNote: text('review_note'),
  ...timestamps,
});

export const examSettings = pgTable('exam_settings', {
  id: uuid('id').defaultRandom().primaryKey(),
  version: integer('version').notNull().unique(),
  passingScore: integer('passing_score').default(75).notNull(),
  durationMinutes: integer('duration_minutes').default(30).notNull(),
  maximumAttempts: integer('maximum_attempts').default(2).notNull(),
  retryDelayDays: integer('retry_delay_days').default(7).notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  ...timestamps,
}, (table) => [
  check('exam_settings_passing_score_range', sql`${table.passingScore} BETWEEN 0 AND 100`),
  check('exam_settings_duration_positive', sql`${table.durationMinutes} > 0`),
  check('exam_settings_maximum_attempts_positive', sql`${table.maximumAttempts} > 0`),
  check('exam_settings_retry_delay_nonnegative', sql`${table.retryDelayDays} >= 0`),
]);

export const examQuestions = pgTable('exam_questions', {
  id: uuid('id').defaultRandom().primaryKey(),
  settingsId: uuid('settings_id').notNull().references(() => examSettings.id, { onDelete: 'cascade' }),
  dimension: text('dimension').notNull(),
  prompt: text('prompt').notNull(),
  options: jsonb('options').$type<Array<{ id: string; label: string; score: number }>>().notNull(),
  displayOrder: integer('display_order').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  ...timestamps,
}, (table) => [
  index('exam_questions_settings_order_idx').on(table.settingsId, table.displayOrder),
  check('exam_questions_display_order_positive', sql`${table.displayOrder} > 0`),
]);

export type ExamQuestionSnapshot = {
  id: string;
  settingsId: string;
  dimension: string;
  prompt: string;
  options: Array<{ id: string; label: string; score: number }>;
  displayOrder: number;
};

export const examAttempts = pgTable('exam_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  settingsId: uuid('settings_id').notNull().references(() => examSettings.id, { onDelete: 'restrict' }),
  attemptNumber: integer('attempt_number').notNull(),
  status: examAttemptStatusEnum('status').default('in_progress').notNull(),
  automaticScore: integer('automatic_score'),
  manualScore: integer('manual_score'),
  finalScore: integer('final_score'),
  passed: boolean('passed'),
  startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }),
  gradedAt: timestamp('graded_at', { withTimezone: true }),
  gradedBy: uuid('graded_by').references(() => users.id, { onDelete: 'set null' }),
  questionSnapshot: jsonb('question_snapshot').$type<ExamQuestionSnapshot[] | null>(),
  ...timestamps,
}, (table) => [
  uniqueIndex('exam_attempts_user_number_idx').on(table.userId, table.attemptNumber),
  uniqueIndex('exam_attempts_one_active_user_idx').on(table.userId).where(sql`${table.status} = 'in_progress'`),
  index('exam_attempts_status_idx').on(table.status, table.submittedAt),
  check('exam_attempts_attempt_number_positive', sql`${table.attemptNumber} > 0`),
  check('exam_attempts_automatic_score_range', sql`${table.automaticScore} IS NULL OR (${table.automaticScore} BETWEEN 0 AND 100)`),
  check('exam_attempts_manual_score_range', sql`${table.manualScore} IS NULL OR (${table.manualScore} BETWEEN 0 AND 100)`),
  check('exam_attempts_final_score_range', sql`${table.finalScore} IS NULL OR (${table.finalScore} BETWEEN 0 AND 100)`),
]);

export const examAnswers = pgTable('exam_answers', {
  id: uuid('id').defaultRandom().primaryKey(),
  attemptId: uuid('attempt_id').notNull().references(() => examAttempts.id, { onDelete: 'cascade' }),
  questionId: uuid('question_id').notNull().references(() => examQuestions.id, { onDelete: 'restrict' }),
  selectedOptionId: text('selected_option_id').notNull(),
  awardedScore: integer('awarded_score').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('exam_answers_attempt_question_idx').on(table.attemptId, table.questionId)]);

export const memberCards = pgTable('member_cards', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'restrict' }).unique(),
  memberNumber: text('member_number').notNull().unique(),
  verificationTokenHash: text('verification_token_hash').notNull().unique(),
  joinedAt: date('joined_at').notNull(),
  expiresAt: date('expires_at'),
  status: cardStatusEnum('status').default('active').notNull(),
  issuedBy: uuid('issued_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  issuedAt: timestamp('issued_at', { withTimezone: true }).defaultNow().notNull(),
  revokedAt: timestamp('revoked_at', { withTimezone: true }),
  revokeReason: text('revoke_reason'),
  ...timestamps,
});

export const contentItems = pgTable('content_items', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: contentTypeEnum('type').notNull(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  excerpt: text('excerpt'),
  body: text('body').notNull(),
  category: text('category'),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  status: contentStatusEnum('status').default('draft').notNull(),
  currentRevision: integer('current_revision').default(1).notNull(),
  reviewRequestedAt: timestamp('review_requested_at', { withTimezone: true }),
  approvedAt: timestamp('approved_at', { withTimezone: true }),
  approvedBy: uuid('approved_by').references(() => users.id, { onDelete: 'set null' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  publishedBy: uuid('published_by').references(() => users.id, { onDelete: 'set null' }),
  archivedAt: timestamp('archived_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('content_items_status_published_idx').on(table.status, table.publishedAt),
  index('content_items_owner_status_idx').on(table.ownerId, table.status),
]);

export const contentRevisions = pgTable('content_revisions', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  revisionNumber: integer('revision_number').notNull(),
  snapshot: jsonb('snapshot').$type<Record<string, unknown>>().notNull(),
  editedBy: uuid('edited_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [uniqueIndex('content_revisions_content_number_idx').on(table.contentId, table.revisionNumber)]);

export const contentReviews = pgTable('content_reviews', {
  id: uuid('id').defaultRandom().primaryKey(),
  contentId: uuid('content_id').notNull().references(() => contentItems.id, { onDelete: 'cascade' }),
  reviewerId: uuid('reviewer_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  fromStatus: contentStatusEnum('from_status').notNull(),
  toStatus: contentStatusEnum('to_status').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [index('content_reviews_content_created_idx').on(table.contentId, table.createdAt)]);

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').defaultRandom().primaryKey(),
  ownerId: uuid('owner_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  contentId: uuid('content_id').references(() => contentItems.id, { onDelete: 'set null' }),
  objectKey: text('object_key').unique(),
  externalUrl: text('external_url'),
  type: mediaTypeEnum('type').notNull(),
  mimeType: text('mime_type'),
  byteSize: integer('byte_size'),
  width: integer('width'),
  height: integer('height'),
  altText: text('alt_text').notNull(),
  caption: text('caption'),
  consentStatus: consentStatusEnum('consent_status').default('unknown').notNull(),
  containsVulnerablePerson: boolean('contains_vulnerable_person').default(false).notNull(),
  visibility: mediaVisibilityEnum('visibility').default('private').notNull(),
  malwareScanStatus: text('malware_scan_status').default('pending').notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('media_assets_owner_idx').on(table.ownerId, table.createdAt),
  index('media_assets_content_idx').on(table.contentId),
]);

export const financialReports = pgTable('financial_reports', {
  id: uuid('id').defaultRandom().primaryKey(),
  period: text('period').notNull(),
  title: text('title').notNull(),
  totalIncome: numeric('total_income', { precision: 18, scale: 0 }).notNull(),
  totalDisbursement: numeric('total_disbursement', { precision: 18, scale: 0 }).notNull(),
  operationalCost: numeric('operational_cost', { precision: 18, scale: 0 }),
  status: contentStatusEnum('status').default('draft').notNull(),
  createdBy: uuid('created_by').notNull().references(() => users.id, { onDelete: 'restrict' }),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  publishedBy: uuid('published_by').references(() => users.id, { onDelete: 'set null' }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('financial_reports_period_status_idx').on(table.period, table.status),
  check('financial_reports_total_income_nonnegative', sql`${table.totalIncome} >= 0`),
  check('financial_reports_total_disbursement_nonnegative', sql`${table.totalDisbursement} >= 0`),
  check('financial_reports_operational_cost_nonnegative', sql`${table.operationalCost} IS NULL OR ${table.operationalCost} >= 0`),
]);

export const programApplications = pgTable('program_applications', {
  id: uuid('id').defaultRandom().primaryKey(),
  applicantUserId: uuid('applicant_user_id').notNull().references(() => users.id, { onDelete: 'restrict' }),
  programSlug: text('program_slug').notNull(),
  beneficiaryName: text('beneficiary_name').notNull(),
  beneficiaryIdentity: text('beneficiary_identity').notNull(),
  phone: text('phone').notNull(),
  address: jsonb('address').$type<Record<string, string>>().default({}).notNull(),
  details: jsonb('details').$type<Record<string, string>>().default({}).notNull(),
  existingPhotoUrl: text('existing_photo_url'),
  existingPhotoMediaId: uuid('existing_photo_media_id').references(() => mediaAssets.id, { onDelete: 'set null' }),
  existingPhotoAlt: text('existing_photo_alt'),
  status: programApplicationStatusEnum('status').default('submitted').notNull(),
  reviewedBy: uuid('reviewed_by').references(() => users.id, { onDelete: 'set null' }),
  reviewedAt: timestamp('reviewed_at', { withTimezone: true }),
  reviewNote: text('review_note'),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('program_applications_status_idx').on(table.status, table.createdAt),
  index('program_applications_program_idx').on(table.programSlug, table.createdAt),
  index('program_applications_applicant_idx').on(table.applicantUserId, table.createdAt),
  uniqueIndex('program_applications_active_applicant_program_idx')
    .on(table.applicantUserId, table.programSlug)
    .where(isNull(table.deletedAt)),
]);

export const adminLoginAttempts = pgTable('admin_login_attempts', {
  id: uuid('id').defaultRandom().primaryKey(),
  keyHash: text('key_hash').notNull().unique(),
  failures: integer('failures').default(0).notNull(),
  windowStartedAt: timestamp('window_started_at', { withTimezone: true }).defaultNow().notNull(),
  blockedUntil: timestamp('blocked_until', { withTimezone: true }),
  ...timestamps,
}, (table) => [
  index('admin_login_attempts_blocked_idx').on(table.blockedUntil),
]);

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').defaultRandom().primaryKey(),
  actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
  actorRole: userRoleEnum('actor_role').notNull(),
  action: text('action').notNull(),
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  requestId: text('request_id'),
  ipHash: text('ip_hash'),
  metadata: jsonb('metadata').$type<Record<string, unknown>>().default({}).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => [
  index('audit_logs_resource_idx').on(table.resourceType, table.resourceId, table.createdAt),
  index('audit_logs_actor_idx').on(table.actorUserId, table.createdAt),
]);

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
