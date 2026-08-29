import type { MetadataRoute } from 'next';
import { programs } from '@/lib/content';
import { siteConfig } from '@/lib/site';
const staticPaths = ['/', '/tentang-kami', '/program', '/kegiatan', '/berita', '/galeri', '/dampak', '/transparansi', '/organisasi', '/donasi', '/kontak', '/cari', '/privasi', '/ketentuan', '/kebijakan-donasi'];
export default function sitemap(): MetadataRoute.Sitemap { if (!siteConfig.url) return []; const base = siteConfig.url.replace(/\/$/, ''); return [...staticPaths, ...programs.map((program) => `/program/${program.slug}`)].map((path) => ({ url: `${base}${path}`, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : .7 })); }
