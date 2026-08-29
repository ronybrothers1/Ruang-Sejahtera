import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ContentContinuation } from '@/components/ContentContinuation';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { activityNavItems } from '@/lib/navigation';
import { publishedGalleries } from '@/lib/published-content';

export function generateStaticParams() {
  return publishedGalleries.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const gallery = publishedGalleries.find((item) => item.slug === slug);
  return gallery ? { title: gallery.title, description: gallery.summary } : {};
}

export default async function GalleryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const gallery = publishedGalleries.find((item) => item.slug === slug);
  if (!gallery) notFound();

  return (
    <>
      <PageHero eyebrow="Galeri" title={gallery.title} description={gallery.summary} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Kegiatan', href: '/kegiatan' }, { label: 'Galeri', href: '/galeri' }, { label: gallery.title }]} />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/galeri" currentType="location" />
      <section className="pb-20 pt-8 md:pb-28">
        <div className="shell">
          <p className="mb-8 text-sm font-semibold text-neutral-500">Dipublikasikan {gallery.publishedAt}</p>
          <EmptyState title="Belum ada media publik pada koleksi ini" description="Media hanya ditampilkan setelah file, konteks, alt text, caption, dan status consent atau restriction memenuhi aturan publikasi." />
        </div>
      </section>
      <ContentContinuation links={[
        { href: '/galeri', label: 'Arsip', title: 'Koleksi galeri lainnya' },
        { href: '/kegiatan', label: 'Jejak aksi', title: 'Lihat kegiatan terbaru' },
        { href: '/program', label: 'Ruang kerja', title: 'Kenali seluruh program' },
      ]} />
    </>
  );
}
