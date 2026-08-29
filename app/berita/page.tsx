import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedArticles } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Berita', description: 'Berita, cerita dampak, dan pengumuman Yayasan Ruang Sejahtera.' };

export default function NewsPage() {
  return (
    <>
      <PageHero eyebrow="Berita & Cerita" title="Publikasi editorial yang ditulis dan disunting manusia." description="CMS V2 disiapkan agar administrator dapat menulis, menyunting, mengategorikan, dan mempublikasikan berita secara manual dengan metadata SEO dan dokumentasi terkait." />
      <section className="py-18 md:py-24">
        <div className="shell">
          {publishedArticles.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedArticles.map((article) => (
                <article key={article.slug} className="border border-neutral-200 bg-white p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{article.category}</p>
                  <h2 className="mt-4 font-heading text-xl font-extrabold text-brand-ink">{article.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{article.excerpt}</p>
                  <p className="mt-4 text-xs font-semibold text-neutral-500">{article.publishedAt}</p>
                  <Link href={`/berita/${article.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-brand-red">Baca berita <ArrowRight size={16} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada berita" description="Berita yang telah melewati proses editorial akan tampil di sini. Sistem tidak menghasilkan berita otomatis untuk sekadar mengisi halaman." />
          )}
        </div>
      </section>
    </>
  );
}
