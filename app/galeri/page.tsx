import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { SectionNavigation } from '@/components/SectionNavigation';
import { programs, sampleActivities } from '@/lib/content';
import { activityNavItems } from '@/lib/navigation';

export const metadata: Metadata = { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan Yayasan Ruang Sejahtera.' };

export default function GalleryPage() {
  const images = [sampleActivities[0].image, programs[1].image, programs[2].image, programs[3].image, sampleActivities[3].image, programs[0].image, programs[4].image, sampleActivities[1].image];
  return (
    <>
      <PageHero eyebrow="Galeri" title="Satu foto yang tepat membawa publik lebih dekat pada kerja sosial." description="Komposisi galeri tetap diisi foto contoh agar proporsi, ritme visual, caption, dan perilaku responsif dapat ditinjau sebelum dokumentasi asli tersedia." />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/galeri" />
      <PreviewNotice label="Galeri preview">Seluruh media di bawah adalah foto contoh dan akan diganti dokumentasi asli lengkap dengan konteks, caption, alt text, serta persetujuan publikasi.</PreviewNotice>
      <section className="trust-page-section trust-gallery-section">
        <div className="shell trust-gallery-mosaic">
          {images.map((src, index) => (
            <figure className={`trust-gallery-tile trust-gallery-tile-${(index % 4) + 1}`} key={`${src}-${index}`}><Image src={src} alt={`Foto dokumentasi contoh ${index + 1}`} fill sizes="(max-width: 680px) 100vw, 40vw" /><figcaption><span>Dokumentasi {String(index + 1).padStart(2, '0')}</span><small>CONTOH</small></figcaption></figure>
          ))}
        </div>
      </section>
    </>
  );
}
