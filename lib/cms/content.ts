import rawActivities from '@/content/cms/activities.json';
import rawArticles from '@/content/cms/articles.json';
import rawGalleries from '@/content/cms/galleries.json';
import type { CmsActivity, CmsArticle, CmsGallery } from '@/lib/cms/types';

export const cmsActivities = rawActivities as CmsActivity[];
export const cmsArticles = rawArticles as CmsArticle[];
export const cmsGalleries = rawGalleries as CmsGallery[];

export const cmsContentCounts = {
  activities: cmsActivities.length,
  articles: cmsArticles.length,
  galleries: cmsGalleries.length,
};
