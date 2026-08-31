import type { Metadata } from 'next';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleTimeline } from '@/lib/content';
import { aboutNavItems } from '@/lib/navigation';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({ title: 'Sejarah', description: 'Sejarah Yayasan Ruang Sejahtera.', path: '/tentang-kami/sejarah' });

export default function HistoryPage() {
  return (
    <>
      <PageHero eyebrow="Tentang Kami" title="Perjalanan dari kepedulian menuju gerakan yang terstruktur." description="Timeline contoh tetap ditampilkan agar pengalaman membaca kronologi dapat ditinjau sebelum tahun dan peristiwa resmi menggantikannya." />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Tentang Kami', href: '/tentang-kami' }, { label: 'Sejarah' }]} />
      <SectionNavigation label="Jelajahi Tentang Kami" items={aboutNavItems} currentHref="/tentang-kami/sejarah" />
      <PreviewNotice label="Timeline contoh">Tahun dan peristiwa berikut belum merupakan kronologi resmi Yayasan Ruang Sejahtera.</PreviewNotice>
      <section className="trust-page-section trust-history-section"><div className="shell trust-history-layout"><div><span>Perjalanan</span><h2>Setiap tonggak perlu memiliki konteks.</h2><p>Sejarah final akan menghubungkan peristiwa penting dengan dokumen, foto, tokoh, dan sumber yang dapat diverifikasi.</p></div><div className="trust-history-timeline">{sampleTimeline.map((item) => <article key={item.year}><span>{item.year}</span><div><h2>{item.title}</h2><p>{item.description}</p><small>PERISTIWA CONTOH</small></div></article>)}</div></div></section>
    </>
  );
}
