import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { siteConfig } from '@/lib/site';

type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  const schema = siteConfig.url ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? new URL(item.href, siteConfig.url).toString() : undefined,
    })),
  } : null;

  return (
    <>
      <nav aria-label="Breadcrumb" className="shell py-5">
        <ol className="flex flex-wrap items-center gap-1 text-xs font-semibold text-neutral-500">
          {items.map((item, index) => {
            const current = index === items.length - 1;
            return (
              <li key={`${item.label}-${index}`} className="flex items-center gap-1">
                {index > 0 ? <ChevronRight size={14} aria-hidden="true" /> : null}
                {item.href && !current ? <Link href={item.href} className="hover:text-brand-red">{item.label}</Link> : <span aria-current={current ? 'page' : undefined}>{item.label}</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      {schema ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} /> : null}
    </>
  );
}
