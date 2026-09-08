import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { ArticleJsonLd } from '@/components/ContentJsonLd';
import { ContentContinuation } from '@/components/ContentContinuation';
import { PageHero } from '@/components/PageHero';
import { SectionNavigation } from '@/components/SectionNavigation';
import { RichTextContent } from '@/components/RichTextContent';
import { activityNavItems } from '@/lib/navigation';
import { getPublishedArticleBySlug, publishedArticles } from '@/lib/published-content';
import { createPageMetadata } from '@/lib/seo';

export function generateStaticParams() {
  return publishedArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug) || publishedArticles.find((item) => item.slug === slug);
  return article ? createPageMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/berita/${article.slug}`,
    imagePath: article.imageUrl,
    imageAlt: article.imageAlt,
    openGraphType: 'article',
  }) : {};
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(slug) || publishedArticles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <ArticleJsonLd path={`/berita/${article.slug}`} title={article.title} description={article.excerpt} publishedAt={article.publishedAt} imagePath={article.imageUrl} />
      <PageHero eyebrow={article.category} title={article.title} description={article.excerpt} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Berita & Cerita', href: '/berita' }, { label: article.title }]} />
      <SectionNavigation label="Jelajahi Kegiatan" items={activityNavItems} currentHref="/berita" currentType="location" />
      <article className="pb-20 pt-8 md:pb-28">
        <div className="shell max-w-3xl">
          <p className="mb-8 text-sm font-semibold text-neutral-500">Dipublikasikan {article.publishedAt}</p>
          {article.imageUrl ? <figure className="mb-10 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100">
            <Image src={article.imageUrl} alt={article.imageAlt || article.title} width={1200} height={675} sizes="(max-width: 768px) 100vw, 768px" className="h-auto w-full object-cover" />
            {article.imageCaption ? <figcaption className="px-4 py-3 text-sm text-neutral-600">{article.imageCaption}</figcaption> : null}
          </figure> : null}
          <RichTextContent value={article.body} className="prose prose-neutral max-w-none leading-8" />
        </div>
      </article>
      <ContentContinuation links={[
        { href: '/berita', label: 'Arsip', title: 'Berita & Cerita lainnya' },
        { href: '/kegiatan', label: 'Jejak aksi', title: 'Lihat seluruh kegiatan' },
        { href: '/cari', label: 'Pencarian', title: 'Cari informasi lain' },
      ]} />
    </>
  );
}
