import type { MetadataRoute } from 'next';
import { programs } from '@/lib/content';
import { getPublishedActivities, getPublishedArticles, getPublishedGalleries } from '@/lib/published-content';
import { siteConfig } from '@/lib/site';

const staticPaths = [
  '/',
  '/tentang-kami',
  '/tentang-kami/visi-misi',
  '/tentang-kami/nilai',
  '/tentang-kami/sejarah',
  '/tentang-kami/legalitas',
  '/program',
  '/kegiatan',
  '/berita',
  '/galeri',
  '/dampak',
  '/transparansi',
  '/organisasi',
  '/donasi',
  '/kontak',
  '/peta-situs',
  '/cari',
  '/privasi',
  '/ketentuan',
  '/kebijakan-donasi',
  '/aksesibilitas',
  '/disclaimer',
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  if (!siteConfig.url) return [];
  const base = siteConfig.url.replace(/\/$/, '');
  const [publishedActivities, publishedArticles, publishedGalleries] = await Promise.all([
    getPublishedActivities(),
    getPublishedArticles(),
    getPublishedGalleries(),
  ]);
  const dynamicPaths = [
    ...programs.map((program) => `/program/${program.slug}`),
    ...publishedActivities.map((activity) => `/kegiatan/${activity.slug}`),
    ...publishedArticles.map((article) => `/berita/${article.slug}`),
    ...publishedGalleries.map((gallery) => `/galeri/${gallery.slug}`),
  ];

  return [...staticPaths, ...dynamicPaths].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: path === '/' ? 'weekly' : 'monthly',
    priority: path === '/' ? 1 : .7,
  }));
}
