import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { activityNavItems } from '@/lib/navigation';
import { publishedActivities } from '@/lib/published-content';

export function generateStaticParams() {
  return publishedActivities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = publishedActivities.find((item) => item.slug === slug);
  return activity ? { title: activity.title, description: activity.summary } : {};
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = publishedActivities.find((item) => item.slug === slug);
  if (!activity) notFound();

  return (
    <>
      <PageHero eyebrow="Kegiatan" title={activity.title} description={activity.summary} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Kegiatan', href: '/kegiatan' }, { label: activity.title }]} />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/kegiatan" />
      <article className="pb-20 pt-8 md:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <aside className="space-y-5 border-t-2 border-brand-red pt-5 text-sm leading-7 text-neutral-600">
            <p><strong className="text-brand-ink">Tanggal:</strong><br />{activity.activityDate}</p>
            <p><strong className="text-brand-ink">Lokasi:</strong><br />{activity.locationLabel}</p>
            <p><strong className="text-brand-ink">Program:</strong><br /><Link className="font-bold text-brand-red hover:underline" href={`/program/${activity.programSlug}`}>Lihat program terkait</Link></p>
          </aside>
          <div className="prose prose-neutral max-w-none leading-8"><p>{activity.body}</p></div>
        </div>
      </article>
    </>
  );
}
