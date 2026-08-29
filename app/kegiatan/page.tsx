import type { Metadata } from 'next';
import Image from 'next/image';
import { MapPin } from 'lucide-react';
import { PageHero } from '@/components/PageHero';
import { sampleActivities } from '@/lib/content';

export const metadata: Metadata = { title: 'Kegiatan', description: 'Arsip kegiatan sosial Yayasan Ruang Sejahtera.' };

export default function ActivitiesPage() {
  return (
    <>
      <PageHero eyebrow="Kegiatan" title="Jejak aksi yang dekat dengan masyarakat." description="Halaman draft ini diisi contoh kegiatan agar kualitas desain, hierarki informasi, fotografi, dan pengalaman membaca dapat dievaluasi sebelum data resmi dimigrasikan." />
      <div className="sample-note"><strong>CONTOH SEMENTARA</strong><span>Tanggal, lokasi, foto, dan uraian kegiatan belum merupakan arsip resmi yayasan.</span></div>
      <section className="section-pad bg-[#f4f4f2]">
        <div className="shell activity-archive-grid">
          {sampleActivities.concat(sampleActivities.slice(0,2)).map((activity, index) => (
            <article className={`activity-feature ${index === 0 ? 'activity-feature-wide' : ''}`} key={`${activity.slug}-${index}`}>
              <div className="activity-feature-photo"><Image src={activity.image} alt={`Foto contoh ${activity.title}`} fill sizes={index === 0 ? '(max-width: 900px) 100vw, 66vw' : '(max-width: 900px) 100vw, 33vw'} /><div className="program-story-overlay"/><span className="draft-chip">CONTOH</span></div>
              <div className="activity-feature-copy"><div><span>{activity.date}</span><span><MapPin size={13}/>{activity.location}</span></div><h2>{activity.title}</h2><p>{activity.summary} Dokumentasi, indikator hasil, dan hubungan ke program akan ditampilkan pada halaman detail setelah data final tersedia.</p></div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
