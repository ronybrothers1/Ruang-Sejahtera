import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { PreviewNotice } from '@/components/PreviewNotice';
import { PublishedContentIndex } from '@/components/PublishedContentIndex';
import { SectionNavigation } from '@/components/SectionNavigation';
import { sampleActivities } from '@/lib/content';
import { activityNavItems } from '@/lib/navigation';
import { getPublishedActivities } from '@/lib/published-content';
import { createPageMetadata } from '@/lib/seo';

export const metadata: Metadata = createPageMetadata({ title: 'Kegiatan', description: 'Arsip kegiatan sosial Yayasan Ruang Sejahtera.', path: '/kegiatan' });

export default async function ActivitiesPage() {
  const items = [...sampleActivities, ...sampleActivities.slice(0, 2)];
  const publishedActivities = await getPublishedActivities();
  return (
    <>
      <PageHero eyebrow="Kegiatan" title="Jejak aksi yang dekat dengan masyarakat." description="Arsip preview ini mempertahankan foto, tanggal, lokasi, dan narasi contoh agar pengalaman membaca dapat dievaluasi secara utuh." />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/kegiatan" />
      <PreviewNotice label="Kegiatan contoh">Tanggal, lokasi, foto, dan uraian di bawah akan diganti dengan arsip resmi tanpa mengubah struktur desain.</PreviewNotice>
      <PublishedContentIndex
        id="kegiatan-terbit"
        eyebrow="Kegiatan resmi"
        title="Kegiatan yang telah diterbitkan"
        items={publishedActivities.map((activity) => ({
          href: `/kegiatan/${activity.slug}`,
          title: activity.title,
          description: activity.summary,
          meta: `${activity.activityDate} · ${activity.locationLabel}`,
        }))}
      />
      <section className="trust-page-section trust-archive-section">
        <div className="shell trust-archive-grid trust-activity-archive">
          {items.map((activity, index) => (
            <article id={index < sampleActivities.length ? activity.slug : undefined} className={index === 0 ? 'trust-archive-card trust-archive-card-wide' : 'trust-archive-card'} key={`${activity.slug}-${index}`}>
              <div className="trust-archive-image"><Image src={activity.image} alt={activity.imageAlt} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 900px) 100vw, 33vw'} /><span className="preview-chip">{activity.imageLabel}</span></div>
              <div className="trust-archive-copy"><div><time>{activity.date}</time><span><MapPin size={13} aria-hidden="true" /> {activity.location}</span></div><h2>{activity.title}</h2><p>{activity.summary} Dokumentasi, indikator hasil, dan kaitan program akan ditambahkan saat data final tersedia.</p></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
