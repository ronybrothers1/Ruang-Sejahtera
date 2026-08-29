import type { Metadata } from 'next';
import Image from 'next/image';
import { PageHero } from '@/components/PageHero';
import { programs, sampleActivities } from '@/lib/content';

export const metadata: Metadata = { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan Yayasan Ruang Sejahtera.' };

export default function GalleryPage() {
  const images = [
    sampleActivities[0].image,
    programs[1].image,
    programs[2].image,
    programs[3].image,
    sampleActivities[3].image,
    programs[0].image,
    programs[4].image,
    sampleActivities[1].image,
  ];

  return (
    <>
      <PageHero eyebrow="Galeri" title="Satu foto yang tepat dapat membawa publik lebih dekat ke kerja sosial." description="Galeri V3 memakai foto contoh untuk menilai komposisi visual. Seluruh media akan diganti dokumentasi asli lengkap dengan konteks, caption, alt text, serta persetujuan publikasi." />
      <div className="sample-note"><strong>FOTO DRAFT</strong><span>Seluruh foto dalam galeri ini adalah contoh sementara dan bukan dokumentasi resmi kegiatan.</span></div>
      <section className="section-pad bg-[#0a0a0a]">
        <div className="shell gallery-mosaic">
          {images.map((src, index) => <figure className={`gallery-tile gallery-tile-${(index % 4) + 1}`} key={`${src}-${index}`}><Image src={src} alt={`Foto dokumentasi contoh ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 40vw"/><figcaption><span>Dokumentasi {String(index + 1).padStart(2,'0')}</span><small>CONTOH SEMENTARA</small></figcaption></figure>)}
        </div>
      </section>
    </>
  );
}
