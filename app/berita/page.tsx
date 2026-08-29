import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { PublishedContentIndex } from '@/components/PublishedContentIndex';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleNews } from '@/lib/content';
import { activityNavItems } from '@/lib/navigation';
import { publishedArticles } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Berita & Cerita', description: 'Berita, cerita dampak, dan pengumuman Yayasan Ruang Sejahtera.' };

type NewsPageProps = {
  searchParams: Promise<{ category?: string | string[] }>;
};

export default async function NewsPage({ searchParams }: NewsPageProps) {
  const { category: categoryParam } = await searchParams;
  const items = [...sampleNews, ...sampleNews.slice(0, 2)];
  const categories = Array.from(new Set([
    ...sampleNews.map((item) => item.category),
    ...publishedArticles.map((item) => item.category),
  ]));
  const requestedCategory = Array.isArray(categoryParam) ? categoryParam[0] : categoryParam;
  const activeCategory = categories.find((category) => category.toLocaleLowerCase('id-ID') === requestedCategory?.toLocaleLowerCase('id-ID'));
  const visibleSamples = activeCategory ? items.filter((item) => item.category === activeCategory) : items;
  const visibleArticles = activeCategory ? publishedArticles.filter((item) => item.category === activeCategory) : publishedArticles;

  return (
    <>
      <PageHero eyebrow="Berita & Cerita" title="Cerita lapangan memberi konteks pada setiap aksi." description="Draft editorial ini memakai judul dan foto contoh agar ritme berita, hierarki informasi, dan tampilan arsip dapat dinilai secara lengkap." />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/berita" />
      <PreviewNotice label="Editorial preview">Judul, tanggal, kategori, ringkasan, dan foto berikut adalah materi contoh yang akan diganti ketika artikel resmi siap.</PreviewNotice>
      <nav className="category-navigation shell" aria-label="Filter kategori berita">
        <span>Kategori</span>
        <div>
          <Link href="/berita#arsip-berita" aria-current={!activeCategory ? 'page' : undefined} className={!activeCategory ? 'is-active' : undefined}>Semua</Link>
          {categories.map((category) => (
            <Link
              key={category}
              href={`/berita?category=${encodeURIComponent(category)}#arsip-berita`}
              aria-current={activeCategory === category ? 'page' : undefined}
              className={activeCategory === category ? 'is-active' : undefined}
            >
              {category}
            </Link>
          ))}
        </div>
      </nav>
      <PublishedContentIndex
        id="artikel-terbit"
        eyebrow="Artikel resmi"
        title={activeCategory ? `Artikel kategori ${activeCategory}` : 'Artikel yang telah diterbitkan'}
        items={visibleArticles.map((article) => ({
          href: `/berita/${article.slug}`,
          title: article.title,
          description: article.excerpt,
          meta: `${article.category} · ${article.publishedAt}`,
        }))}
      />
      <section id="arsip-berita" className="trust-page-section trust-archive-section trust-archive-white">
        <div className="shell trust-news-archive">
          {visibleSamples.map((item, index) => (
            <article id={visibleSamples.findIndex((candidate) => candidate.slug === item.slug) === index ? item.slug : undefined} className={index === 0 ? 'trust-news-archive-card trust-news-lead' : 'trust-news-archive-card'} key={`${item.slug}-${index}`}>
              <div className="trust-archive-image"><Image src={item.image} alt={`Foto contoh ${item.title}`} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 30vw'} /><span>{item.category}</span></div>
              <div className="trust-news-archive-copy"><small>{item.date} · CONTOH</small><h2>{item.title}</h2><p>Artikel contoh ini menunjukkan ritme judul, ringkasan, metadata, dan hubungan visual dengan dokumentasi program.</p><span className="preview-article-label">Preview artikel · belum diterbitkan</span></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
