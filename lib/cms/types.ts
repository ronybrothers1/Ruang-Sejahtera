import type { PublicationStatus } from '@/lib/models';

export type CmsCollection = 'articles' | 'activities' | 'galleries';

export type CmsBaseRecord = {
  id: string;
  slug: string;
  status: PublicationStatus;
  createdAt: string;
  updatedAt: string;
  lastEditedBy: string;
  reviewRequestedAt?: string;
  reviewRequestedBy?: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reviewNote?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectedAt?: string;
  rejectedBy?: string;
  publishedAt?: string;
  publishedBy?: string;
  archivedAt?: string;
  archivedBy?: string;
};

export type CmsArticle = CmsBaseRecord & {
  title: string;
  excerpt: string;
  category: string;
  body: string;
  imageUrl?: string;
  imageAlt?: string;
  imageCaption?: string;
};

export type CmsActivity = CmsBaseRecord & {
  title: string;
  summary: string;
  activityDate: string;
  locationLabel: string;
  programSlug: string;
  body: string;
};

export type CmsGallery = CmsBaseRecord & {
  title: string;
  summary: string;
};

export type CmsRecord = CmsArticle | CmsActivity | CmsGallery;

export type CmsMediaInput = {
  objectKey: string;
  externalUrl: string | null;
  mimeType: string;
  byteSize: number;
  width: number | null;
  height: number | null;
  altText: string;
  caption?: string;
  visibility: 'private' | 'public';
  consentStatus: 'confirmed' | 'restricted' | 'not_required';
  malwareScanStatus: 'signature_validated';
};

export const cmsCollectionPaths: Record<CmsCollection, string> = {
  articles: 'content/cms/articles.json',
  activities: 'content/cms/activities.json',
  galleries: 'content/cms/galleries.json',
};

export const publicationStatuses: PublicationStatus[] = [
  'draft',
  'pending_review',
  'revision_required',
  'approved',
  'rejected',
  'published',
  'archived',
];
