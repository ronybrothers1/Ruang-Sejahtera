import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { sampleNews } from '@/lib/content';

export const metadata: Metadata = { title: 'Berita', description: 'Berita, cerita dampak, dan pengumuman Yayasan Ruang Sejahtera.' };

export default function NewsPage() {
  const items = [...sampleNews, ...sampleNews.slice(0, 2)];
  return (
    <>
      <PageHero eyebrow="Berita & Cerita" title="Cerita lapangan memberi konteks pada setiap aksi." description="Draft editorial ini memakai judul dan foto contoh agar ritme berita, hierarki informasi, dan tampilan arsip dapat dinilai secara lengkap." />
      <PreviewNotice label="Editorial preview">Judul, tanggal, kategori, ringkasan, dan foto berikut adalah materi contoh yang akan diganti ketika artikel resmi siap.</PreviewNotice>
      <section className="trust-page-section trust-archive-section trust-archive-white">
        <div className="shell trust-news-archive">
          {items.map((item, index) => (
            <article className={index === 0 ? 'trust-news-archive-card trust-news-lead' : 'trust-news-archive-card'} key={`${item.slug}-${index}`}>
              <div className="trust-archive-image"><Image src={item.image} alt={`Foto contoh ${item.title}`} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 30vw'} /><span>{item.category}</span></div>
              <div className="trust-news-archive-copy"><small>{item.date} · CONTOH</small><h2>{item.title}</h2><p>Artikel contoh ini menunjukkan ritme judul, ringkasan, metadata, dan hubungan visual dengan dokumentasi program.</p><strong>Preview artikel <ArrowRight size={15} aria-hidden="true" /></strong></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
