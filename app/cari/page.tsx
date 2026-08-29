import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { publicSearchIndex } from '@/lib/content';
import { publishedActivities, publishedArticles, publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Pencarian', description: 'Cari program dan informasi Yayasan Ruang Sejahtera.' };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = q.trim().toLowerCase();
  const dynamicIndex = [
    ...publishedActivities.map((item) => ({ title: item.title, description: item.summary, href: `/kegiatan/${item.slug}` })),
    ...publishedArticles.map((item) => ({ title: item.title, description: item.excerpt, href: `/berita/${item.slug}` })),
    ...publishedGalleries.map((item) => ({ title: item.title, description: item.summary, href: `/galeri/${item.slug}` })),
  ];
  const searchIndex = [...publicSearchIndex, ...dynamicIndex];
  const results = query ? searchIndex.filter((item) => `${item.title} ${item.description}`.toLowerCase().includes(query)) : [];

  return (
    <>
      <PageHero eyebrow="Pencarian" title="Temukan informasi dengan cepat." description="Pencarian V2 hanya mengindeks halaman publik dan record yang telah masuk registry publikasi. Draft, data privat, dan record yang belum disetujui tidak dimasukkan." />
      <section className="py-18 md:py-24">
        <div className="shell">
          <form action="/cari" method="get" className="flex max-w-3xl gap-2" role="search">
            <label htmlFor="search" className="sr-only">Kata kunci</label>
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" size={19} aria-hidden="true" />
              <input id="search" name="q" defaultValue={q} autoComplete="off" placeholder="Cari program atau informasi..." className="min-h-12 w-full rounded-xl border border-neutral-300 bg-white pl-12 pr-4 text-sm" />
            </div>
            <button className="button-primary" type="submit">Cari</button>
          </form>
          {query ? (
            <div className="mt-10" aria-live="polite">
              <p className="mb-5 text-sm text-neutral-500">{results.length} hasil untuk “{q}”</p>
              {results.length ? <div className="grid gap-3">{results.map((item) => <Link key={item.href} href={item.href} className="border border-neutral-200 p-5 hover:border-red-200"><h2 className="font-bold text-brand-ink">{item.title}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p></Link>)}</div> : <p className="text-sm text-neutral-600">Tidak ada informasi publik yang cocok dengan kata kunci tersebut.</p>}
            </div>
          ) : <p className="mt-8 text-sm text-neutral-500">Masukkan kata kunci untuk memulai pencarian.</p>}
        </div>
      </section>
    </>
  );
}
