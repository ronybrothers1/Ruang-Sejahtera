import type { ActivityRecord, DonationRecord, FinancialReportRecord, MediaRecord, ProgramRecord, PublicationStatus } from '@/lib/models';

export type ListOptions = { limit?: number; cursor?: string; status?: PublicationStatus };
export type ListResult<T> = { items: T[]; nextCursor?: string };

export interface ProgramRepository {
  list(options?: ListOptions): Promise<ListResult<ProgramRecord>>;
  findBySlug(slug: string): Promise<ProgramRecord | null>;
  save(record: ProgramRecord): Promise<void>;
}

export interface ActivityRepository {
  list(options?: ListOptions & { programId?: string; year?: number; location?: string }): Promise<ListResult<ActivityRecord>>;
  findBySlug(slug: string): Promise<ActivityRecord | null>;
  save(record: ActivityRecord): Promise<void>;
}

export interface MediaRepository {
  listForActivity(activityId: string): Promise<MediaRecord[]>;
  save(record: MediaRecord): Promise<void>;
}

export interface DonationRepository {
  findById(id: string): Promise<DonationRecord | null>;
  save(record: DonationRecord): Promise<void>;
}

export interface FinancialReportRepository {
  list(options?: ListOptions & { period?: string; programId?: string }): Promise<ListResult<FinancialReportRecord>>;
  save(record: FinancialReportRecord): Promise<void>;
}

export interface CMSRepositories {
  programs: ProgramRepository;
  activities: ActivityRepository;
  media: MediaRepository;
  donations: DonationRepository;
  financialReports: FinancialReportRepository;
}
