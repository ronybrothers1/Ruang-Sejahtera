import type { Metadata } from 'next';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { publicSearchIndex, type PublicSearchItem } from '@/lib/content';
import { publishedActivities, publishedArticles, publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Pencarian', description: 'Cari program dan informasi Yayasan Ruang Sejahtera.' };

function normalize(value: string) {
  return value.toLocaleLowerCase('id-ID').normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = '' } = await searchParams;
  const query = normalize(q.trim());
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
              {results.length ? <div className="grid gap-3">{results.map((item) => <Link key={`${item.href}-${item.title}`} href={item.href} className="border border-neutral-200 p-5 hover:border-red-200"><small className="text-[.65rem] font-extrabold uppercase tracking-[.08em] text-brand-red">{item.category}</small><h2 className="mt-1 font-bold text-brand-ink">{item.title}</h2><p className="mt-2 text-sm leading-6 text-neutral-600">{item.description}</p></Link>)}</div> : <div className="text-sm text-neutral-600"><p>Tidak ada informasi publik yang cocok dengan kata kunci tersebut.</p><p className="mt-4">Coba istilah yang lebih umum, atau jelajahi <Link className="font-bold text-brand-red hover:underline" href="/program">program</Link>, <Link className="font-bold text-brand-red hover:underline" href="/kegiatan">kegiatan</Link>, <Link className="font-bold text-brand-red hover:underline" href="/transparansi">transparansi</Link>, dan <Link className="font-bold text-brand-red hover:underline" href="/kontak">kontak</Link>.</p></div>}
            </div>
          ) : <p className="mt-8 text-sm text-neutral-500">Masukkan kata kunci untuk memulai pencarian.</p>}
        </div>
      </section>
    </>
  );
}
