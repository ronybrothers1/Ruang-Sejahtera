import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, MapPin } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedActivities } from '@/lib/published-content';

export const metadata: Metadata = {
  title: 'Kegiatan',
  description: 'Arsip kegiatan sosial terpublikasi Yayasan Ruang Sejahtera.',
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}

export default function ActivitiesPage() {
  return (
    <>
      <PageHero
        eyebrow="Kegiatan"
        title="Jejak aksi harus dapat ditelusuri."
        description="Arsip ini hanya memuat kegiatan yang telah melewati pemeriksaan editorial dan memiliki konteks publikasi yang memadai."
      />
      <section className="trust-page-section">
        <div className="shell">
          {publishedActivities.length ? (
            <div className="trust-content-grid">
              {publishedActivities.map((activity) => (
                <article key={activity.slug}>
                  <div><span>Kegiatan</span><time dateTime={activity.activityDate}>{formatDate(activity.activityDate)}</time></div>
                  <h2><Link href={`/kegiatan/${activity.slug}`}>{activity.title}</Link></h2>
                  <p>{activity.summary}</p>
                  <small><MapPin size={14} aria-hidden="true" /> {activity.locationLabel}</small>
                  <Link href={`/kegiatan/${activity.slug}`}>Baca detail <ArrowRight size={15} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              eyebrow="Arsip kegiatan"
              title="Belum ada kegiatan yang dipublikasikan."
              description="Entri akan muncul setelah tanggal, lokasi, program terkait, narasi, dan status publikasinya terverifikasi. Halaman ini sengaja tidak diisi kegiatan contoh."
              action={<Link href="/program" className="trust-button trust-button-ink">Lihat program utama <ArrowRight size={17} aria-hidden="true" /></Link>}
            />
          )}
        </div>
      </section>
    </>
  );
}
