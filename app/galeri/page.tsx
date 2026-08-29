import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = {
  title: 'Galeri',
  description: 'Koleksi dokumentasi terpublikasi Yayasan Ruang Sejahtera.',
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function GalleryPage() {
  return (
    <>
      <PageHero
        eyebrow="Galeri"
        title="Dokumentasi harus menjaga konteks dan martabat."
        description="Koleksi hanya dipublikasikan setelah file, keterangan, teks alternatif, serta status persetujuan atau pembatasannya diperiksa."
      />
      <section className="trust-page-section trust-page-section-dark">
        <div className="shell">
          {publishedGalleries.length ? (
            <div className="trust-gallery-grid">
              {publishedGalleries.map((gallery, index) => (
                <Link href={`/galeri/${gallery.slug}`} key={gallery.slug}>
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <div><small>{formatDate(gallery.publishedAt)}</small><h2>{gallery.title}</h2><p>{gallery.summary}</p></div>
                  <strong>Buka koleksi <ArrowRight size={15} aria-hidden="true" /></strong>
                </Link>
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="Dokumentasi terverifikasi"
              title="Belum ada koleksi media yang dipublikasikan."
              description="Kami tidak menggunakan foto stok untuk merepresentasikan kegiatan yayasan. Dokumentasi asli akan tampil setelah konteks, hak penggunaan, alt text, caption, dan persetujuan publikasinya lengkap."
              action={<Link href="/kegiatan" className="trust-button trust-button-light">Lihat arsip kegiatan <ArrowRight size={17} aria-hidden="true" /></Link>}
            />
          )}
        </div>
      </section>
    </>
  );
}
