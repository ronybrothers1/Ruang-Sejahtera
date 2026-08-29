import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan Yayasan Ruang Sejahtera.' };

export default function GalleryPage() {
  return (
    <>
      <PageHero eyebrow="Galeri" title="Dokumentasi adalah bukti, bukan dekorasi." description="Galeri diprioritaskan untuk foto dan video asli kegiatan, lengkap dengan alt text, caption, lokasi, tanggal, program terkait, dan status persetujuan publikasi jika diperlukan." />
      <section className="py-18 md:py-24">
        <div className="shell">
          {publishedGalleries.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedGalleries.map((gallery) => (
                <article key={gallery.slug} className="border border-neutral-200 bg-white p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">Dokumentasi</p>
                  <h2 className="mt-4 font-heading text-xl font-extrabold text-brand-ink">{gallery.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{gallery.summary}</p>
                  <p className="mt-4 text-xs font-semibold text-neutral-500">{gallery.publishedAt}</p>
                  <Link href={`/galeri/${gallery.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-brand-red">Buka koleksi <ArrowRight size={16} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada media yang dipublikasikan" description="Foto stok dan gambar acak telah dihapus. Dokumentasi asli akan tampil setelah diunggah melalui CMS dengan metadata dan pengaturan privasi yang sesuai." />
          )}
        </div>
      </section>
    </>
  );
}
