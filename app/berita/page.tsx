import type { Metadata } from 'next';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { sampleNews } from '@/lib/content';

export const metadata: Metadata = { title: 'Berita', description: 'Berita, cerita dampak, dan pengumuman Yayasan Ruang Sejahtera.' };

export default function NewsPage() {
  const items = sampleNews.concat(sampleNews.slice(0,2));
  return (
    <>
      <PageHero eyebrow="Berita & Cerita" title="Cerita lapangan yang memberi konteks pada setiap aksi." description="Draft editorial ini menggunakan artikel dan foto contoh agar sistem visual berita dapat ditinjau secara utuh sebelum konten resmi dipublikasikan." />
      <div className="sample-note"><strong>EDITORIAL DRAFT</strong><span>Judul, tanggal, kategori, dan foto di bawah merupakan contoh desain.</span></div>
      <section className="section-pad section-white">
        <div className="shell">
          <div className="news-editorial-grid">
            {items.map((item, index) => (
              <article className={index === 0 ? 'news-lead' : 'news-editorial-card'} key={`${item.slug}-${index}`}>
                <div className="news-editorial-image"><Image src={item.image} alt={`Foto contoh ${item.title}`} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 58vw' : '(max-width: 900px) 100vw, 30vw'} /><span>{item.category}</span></div>
                <div className="news-editorial-copy"><small>{item.date} · CONTOH SEMENTARA</small><h2>{item.title}</h2><p>Artikel contoh ini menunjukkan ritme judul, ringkasan, metadata, dan hubungan visual dengan dokumentasi program di lapangan.</p><strong>Baca selengkapnya <ArrowRight size={15}/></strong></div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
