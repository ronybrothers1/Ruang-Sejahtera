import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { PageHero } from '@/components/PageHero';
import { publishedArticles } from '@/lib/published-content';

export function generateStaticParams() {
  return publishedArticles.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = publishedArticles.find((item) => item.slug === slug);
  return article ? { title: article.title, description: article.excerpt } : {};
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = publishedArticles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <>
      <PageHero eyebrow={article.category} title={article.title} description={article.excerpt} />
      <Breadcrumbs items={[{ label: 'Beranda', href: '/' }, { label: 'Berita', href: '/berita' }, { label: article.title }]} />
      <article className="pb-20 pt-8 md:pb-28">
        <div className="shell max-w-3xl">
          <p className="mb-8 text-sm font-semibold text-neutral-500">Dipublikasikan {article.publishedAt}</p>
          <div className="prose prose-neutral max-w-none leading-8"><p>{article.body}</p></div>
        </div>
      </article>
    </>
  );
}
