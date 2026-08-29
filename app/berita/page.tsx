import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedArticles } from '@/lib/published-content';

export const metadata: Metadata = {
  title: 'Berita',
  description: 'Berita, cerita dampak, dan pengumuman terpublikasi Yayasan Ruang Sejahtera.',
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Berita & Cerita"
        title="Kabar lapangan memerlukan konteks, bukan sekadar judul."
        description="Setiap artikel yang tampil di sini telah diterbitkan melalui registri konten publik dan memiliki status editorial yang jelas."
      />
      <section className="trust-page-section">
        <div className="shell">
          {publishedArticles.length ? (
            <div className="trust-content-grid">
              {publishedArticles.map((article) => (
                <article key={article.slug}>
                  <div><span>{article.category}</span><time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time></div>
                  <h2><Link href={`/berita/${article.slug}`}>{article.title}</Link></h2>
                  <p>{article.excerpt}</p>
                  <Link href={`/berita/${article.slug}`}>Baca selengkapnya <ArrowRight size={15} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="Ruang editorial"
              title="Belum ada berita atau cerita yang dipublikasikan."
              description="Artikel akan ditampilkan setelah judul, kutipan, fakta, tanggal, kategori, dan otoritas penerbitannya telah diperiksa. Tidak ada artikel contoh yang disamarkan sebagai berita nyata."
              action={<Link href="/kegiatan" className="trust-button trust-button-ink">Periksa arsip kegiatan <ArrowRight size={17} aria-hidden="true" /></Link>}
            />
          )}
        </div>
      </section>
    </>
  );
}
