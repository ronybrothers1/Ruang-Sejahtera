import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ActivityJsonLd } from '@/components/ContentJsonLd';
import { ContentContinuation } from '@/components/ContentContinuation';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { activityNavItems } from '@/lib/navigation';
import { getPublishedActivityBySlug, publishedActivities } from '@/lib/published-content';
import { createPageMetadata } from '@/lib/seo';
import { RichTextContent } from '@/components/RichTextContent';
import { ExternalVideoEmbed } from '@/components/ExternalVideoEmbed';

export function generateStaticParams() {
  return publishedActivities.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const activity = await getPublishedActivityBySlug(slug) || publishedActivities.find((item) => item.slug === slug);
  return activity ? createPageMetadata({
    title: activity.title,
    description: activity.summary,
    path: `/kegiatan/${activity.slug}`,
    imagePath: activity.imageUrl,
    imageAlt: activity.imageAlt,
  }) : {};
}

export default async function ActivityDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const activity = await getPublishedActivityBySlug(slug) || publishedActivities.find((item) => item.slug === slug);
  if (!activity) notFound();

  return (
    <>
      <ActivityJsonLd path={`/kegiatan/${activity.slug}`} title={activity.title} description={activity.summary} activityDate={activity.activityDate} location={activity.locationLabel} imagePath={activity.imageUrl} />
      <PageHero eyebrow="Kegiatan" title={activity.title} description={activity.summary} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Kegiatan', href: '/kegiatan' }, { label: activity.title }]} />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/kegiatan" currentType="location" />
      <article className="pb-20 pt-8 md:pb-28">
        <div className="shell grid gap-10 lg:grid-cols-[.72fr_1.28fr]">
          <aside className="space-y-5 border-t-2 border-brand-red pt-5 text-sm leading-7 text-neutral-600">
            <p><strong className="text-brand-ink">Tanggal:</strong><br />{activity.activityDate}</p>
            <p><strong className="text-brand-ink">Lokasi:</strong><br />{activity.locationLabel}</p>
            <p><strong className="text-brand-ink">Program:</strong><br /><Link className="font-bold text-brand-red hover:underline" href={`/program/${activity.programSlug}`}>Lihat program terkait</Link></p>
          </aside>
          <div>
            {activity.imageUrl ? <figure className="mb-8 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100"><Image src={activity.imageUrl} alt={activity.imageAlt || activity.title} width={1200} height={675} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full object-cover" />{activity.imageCaption ? <figcaption className="px-4 py-3 text-sm text-neutral-600">{activity.imageCaption}</figcaption> : null}</figure> : null}
            {activity.video ? <ExternalVideoEmbed {...activity.video} title={activity.title} /> : null}
            <RichTextContent value={activity.body} className="prose prose-neutral max-w-none leading-8" />
          </div>
        </div>
      </article>
      <ContentContinuation links={[
        { href: '/kegiatan', label: 'Arsip', title: 'Kegiatan lainnya' },
        { href: `/program/${activity.programSlug}`, label: 'Program terkait', title: 'Pelajari konteks program' },
        { href: '/galeri', label: 'Dokumentasi', title: 'Jelajahi galeri' },
      ]} />
    </>
  );
}
