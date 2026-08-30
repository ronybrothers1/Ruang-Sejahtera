import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publicSearchIndex, type PublicSearchItem } from '@/lib/content';
import { publishedActivities, publishedArticles, publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Pencarian', description: 'Cari program dan informasi Yayasan Ruang Sejahtera.' };

function normalize(value: string) {
  return value.toLocaleLowerCase('id-ID').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const { q = '' } = await searchParams;
  const rawQuery = Array.isArray(q) ? (q[0] ?? '') : q;
  const safeQuery = rawQuery.slice(0, 120);
  const query = normalize(safeQuery.trim());
  const dynamicIndex: PublicSearchItem[] = [
    ...publishedActivities.map((item) => ({ title: item.title, description: item.summary, href: `/kegiatan/${item.slug}`, category: 'Kegiatan' })),
    ...publishedArticles.map((item) => ({ title: item.title, description: item.excerpt, href: `/berita/${item.slug}`, category: 'Berita & Cerita' })),
    ...publishedGalleries.map((item) => ({ title: item.title, description: item.summary, href: `/galeri/${item.slug}`, category: 'Galeri' })),
  ];
  const searchIndex = [...publicSearchIndex, ...dynamicIndex].filter((item, index, entries) => entries.findIndex((entry) => entry.href === item.href && entry.title === item.title) === index);
  const results = query ? searchIndex
    .filter((item) => normalize(`${item.title} ${item.description} ${item.category}`).includes(query))
    .sort((a, b) => Number(normalize(b.title).startsWith(query)) - Number(normalize(a.title).startsWith(query)) || a.title.localeCompare(b.title, 'id-ID')) : [];

  return (
    <>
      <PageHero eyebrow="Pencarian" title="Temukan informasi dengan cepat." description="Cari program, kegiatan, berita, kebijakan, laporan, dan cara terlibat dari seluruh informasi yang tersedia untuk publik." />
      <section className="trust-search-section">
        <div className="shell trust-search-layout">
          <div className="trust-search-panel">
            <span>Jelajahi informasi publik</span>
            <form action="/cari" method="get" role="search">
              <label htmlFor="search">Kata kunci</label>
              <div>
                <Search size={20} aria-hidden="true" />
                <input id="search" name="q" type="search" defaultValue={safeQuery} autoComplete="off" enterKeyHint="search" maxLength={120} placeholder="Cari program atau informasi..." />
                <button className="trust-button trust-button-primary" type="submit">Cari <ArrowRight size={17} aria-hidden="true" /></button>
              </div>
            </form>
            <p>Coba kata kunci seperti “air bersih”, “kegiatan”, “laporan”, atau “kontak”.</p>
          </div>

          {query ? (
            <div className="trust-search-results" aria-live="polite">
              <div className="trust-search-results-heading">
                <p>Hasil pencarian</p>
                <strong>{results.length} hasil untuk “{safeQuery}”</strong>
              </div>
              {results.length ? (
                <div className="trust-search-results-grid">
                  {results.map((item) => (
                    <Link key={`${item.href}-${item.title}`} href={item.href}>
                      <small>{item.category}</small>
                      <h2>{item.title}</h2>
                      <p>{item.description}</p>
                      <strong>Buka informasi <ArrowRight size={15} aria-hidden="true" /></strong>
                    </Link>
                  ))}
                </div>
              ) : (
                <EmptyState
                  eyebrow="Pencarian"
                  title="Belum ada hasil yang cocok."
                  description="Coba istilah yang lebih umum, atau gunakan jalur informasi utama di bawah ini."
                  action={<div className="trust-search-suggestions"><Link href="/program">Program</Link><Link href="/kegiatan">Kegiatan</Link><Link href="/transparansi">Transparansi</Link><Link href="/kontak">Kontak</Link></div>}
                />
              )}
            </div>
          ) : <p className="trust-search-prompt">Masukkan kata kunci untuk memulai pencarian. Hasil akan dikelompokkan dalam kartu yang mudah dipindai.</p>}
        </div>
      </section>
    </>
  );
}
