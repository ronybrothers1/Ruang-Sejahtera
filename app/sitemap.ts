import type { MetadataRoute } from 'next';
import { programs } from '@/lib/content';
import { siteConfig } from '@/lib/site';
const staticPaths = ['/', '/tentang-kami', '/tentang-kami/visi-misi', '/tentang-kami/nilai', '/tentang-kami/sejarah', '/tentang-kami/legalitas', '/program', '/kegiatan', '/berita', '/galeri', '/dampak', '/transparansi', '/organisasi', '/donasi', '/kontak', '/cari', '/privasi', '/ketentuan', '/kebijakan-donasi', '/aksesibilitas', '/disclaimer'];
export default function sitemap(): MetadataRoute.Sitemap { if (!siteConfig.url) return []; const base = siteConfig.url.replace(/\/$/, ''); return [...staticPaths, ...programs.map((program) => `/program/${program.slug}`)].map((path) => ({ url: `${base}${path}`, changeFrequency: path === '/' ? 'weekly' : 'monthly', priority: path === '/' ? 1 : .7 })); }
