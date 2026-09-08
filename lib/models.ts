export type PublicationStatus =
  | 'draft'
  | 'pending_review'
  | 'revision_required'
  | 'approved'
  | 'rejected'
  | 'published'
  | 'archived';

export type UserRole = 'super_admin' | 'core_manager' | 'member';

// Compatibility alias for the existing control-plane components.
export type AdminRole = UserRole;

export type MembershipStatus =
  | 'registered'
  | 'email_verified'
  | 'data_review'
  | 'exam_eligible'
  | 'exam_completed'
  | 'passed'
  | 'failed'
  | 'admin_approved'
  | 'active'
  | 'suspended'
  | 'revoked';

export interface BaseRecord {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProgramRecord extends BaseRecord {
  slug: string;
  name: string;
  summary: string;
  status: PublicationStatus;
}

export interface ActivityRecord extends BaseRecord {
  slug: string;
  title: string;
  programId: string;
  activityDate: string;
  locationLabel: string;
  beneficiaryCount?: number;
  fundingSource?: string;
  status: PublicationStatus;
}

export interface MediaRecord extends BaseRecord {
  activityId?: string;
  url: string;
  alt: string;
  caption?: string;
  consentStatus: 'confirmed' | 'restricted' | 'not_required' | 'unknown';
  containsVulnerablePerson: boolean;
}

export interface DonationRecord extends BaseRecord {
  programId?: string;
  amount: number;
  currency: 'IDR';
  donorDisplay: 'named' | 'anonymous';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'expired' | 'refunded';
  gatewayReference?: string;
}

export interface FinancialReportRecord extends BaseRecord {
  period: string;
  programId?: string;
  totalIncome: number;
  totalDisbursement: number;
  operationalCost?: number;
  documentUrl?: string;
  publicationStatus: PublicationStatus;
}

export interface AuditLogRecord extends BaseRecord {
  actorId: string;
  actorRole: AdminRole;
  action: string;
  resourceType: string;
  resourceId: string;
  metadata?: Record<string, string | number | boolean | null>;
}
