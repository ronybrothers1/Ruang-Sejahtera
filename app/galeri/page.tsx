import type { Metadata } from 'next';
import Image from 'next/image';
import { Music2 } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { PublishedContentIndex } from '@/components/PublishedContentIndex';
import { SectionNavigation } from '@/components/SectionNavigation';
import { TikTokEmbed } from '@/components/TikTokEmbed';
import { programs, sampleActivities } from '@/lib/content';
import { tiktokProfileUrl, tiktokVideos } from '@/lib/media';
import { activityNavItems } from '@/lib/navigation';
import { publishedGalleries } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Galeri', description: 'Dokumentasi foto dan video kegiatan Yayasan Ruang Sejahtera.' };

export default function GalleryPage() {
  const images = [
    programs[0],
    programs[3],
    programs[1],
    programs[2],
    sampleActivities[3],
    programs[4],
    sampleActivities[0],
    sampleActivities[1],
  ];
  return (
    <>
      <PageHero eyebrow="Galeri" title="Satu dokumentasi yang tepat membawa publik lebih dekat pada kerja sosial." description="Foto kegiatan dan video lapangan disusun agar publik dapat melihat konteks kerja Yayasan Ruang Sejahtera secara lebih utuh." />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/galeri" />
      <PreviewNotice label="Transparansi media">Foto asli diberi label “Dokumentasi”. Visual pendukung yang belum memakai dokumentasi kegiatan diberi label “Visual contoh” dan tetap akan diganti ketika materi resmi tersedia.</PreviewNotice>
      <PublishedContentIndex
        id="galeri-terbit"
        eyebrow="Galeri resmi"
        title="Koleksi yang telah diterbitkan"
        items={publishedGalleries.map((gallery) => ({
          href: `/galeri/${gallery.slug}`,
          title: gallery.title,
          description: gallery.summary,
          meta: gallery.publishedAt,
        }))}
      />
      <section className="trust-page-section trust-gallery-section">
        <div className="shell trust-gallery-mosaic">
          {images.map((media, index) => (
            <figure className={`trust-gallery-tile trust-gallery-tile-${(index % 4) + 1}`} key={`${media.image}-${index}`}>
              <Image src={media.image} alt={media.imageAlt} fill sizes="(max-width: 680px) 100vw, 40vw" />
              <figcaption><span>Galeri {String(index + 1).padStart(2, '0')}</span><small>{media.imageLabel}</small></figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="trust-page-section trust-tiktok-section" aria-labelledby="video-documentation-heading">
        <div className="shell">
          <div className="trust-tiktok-heading">
            <div>
              <span>Dokumentasi bergerak</span>
              <h2 id="video-documentation-heading">Kegiatan nyata, ditampilkan langsung dari TikTok.</h2>
              <p>Setiap video menggunakan player resmi TikTok, dimuat saat dibutuhkan, dan tetap dapat diputar tanpa meninggalkan halaman galeri.</p>
            </div>
            <a href={tiktokProfileUrl} target="_blank" rel="noreferrer" className="trust-tiktok-profile" aria-label="Buka profil TikTok resmi @ruangsejahtera.idn, dibuka di tab baru">
              <Music2 size={20} aria-hidden="true" />
              <span><small>Profil resmi</small><strong>@ruangsejahtera.idn</strong></span>
            </a>
          </div>
          <div className="trust-tiktok-grid">
            {tiktokVideos.map((video) => <TikTokEmbed video={video} key={video.id} />)}
          </div>
        </div>
      </section>
    </>
  );
}
