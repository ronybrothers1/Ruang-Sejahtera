import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { EmptyState } from '@/components/EmptyState';
import { PageHero } from '@/components/PageHero';
import { publishedActivities } from '@/lib/published-content';

export const metadata: Metadata = { title: 'Kegiatan', description: 'Arsip kegiatan sosial Yayasan Ruang Sejahtera.' };

export default function ActivitiesPage() {
  return (
    <>
      <PageHero eyebrow="Kegiatan" title="Arsip kegiatan yang dapat ditelusuri." description="Setiap kegiatan akan memiliki tanggal, lokasi, program, latar belakang, bentuk bantuan, dokumentasi, dampak, dan informasi pendanaan jika relevan." />
      <section className="py-18 md:py-24">
        <div className="shell">
          {publishedActivities.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {publishedActivities.map((activity) => (
                <article key={activity.slug} className="border border-neutral-200 bg-white p-6">
                  <p className="text-xs font-extrabold uppercase tracking-[.14em] text-brand-red">{activity.activityDate}</p>
                  <h2 className="mt-4 font-heading text-xl font-extrabold text-brand-ink">{activity.title}</h2>
                  <p className="mt-3 text-sm leading-7 text-neutral-600">{activity.summary}</p>
                  <p className="mt-4 text-xs font-semibold text-neutral-500">{activity.locationLabel}</p>
                  <Link href={`/kegiatan/${activity.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:text-brand-red">Baca detail <ArrowRight size={16} aria-hidden="true" /></Link>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState title="Belum ada kegiatan yang dipublikasikan" description="CMS V2 akan memungkinkan penyaringan berdasarkan program, lokasi, dan tahun. Sampai data resmi dimigrasikan, sistem sengaja tidak membuat kartu kegiatan contoh." />
          )}
        </div>
      </section>
    </>
  );
}
