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

export const cmsCollectionPaths: Record<CmsCollection, string> = {
  articles: 'content/cms/articles.json',
  activities: 'content/cms/activities.json',
  galleries: 'content/cms/galleries.json',
};

export const publicationStatuses: PublicationStatus[] = ['draft', 'review', 'published', 'archived'];
