import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export type PublishedIndexItem = {
  href: string;
  title: string;
  description: string;
  meta?: string;
};

type PublishedContentIndexProps = {
  id: string;
  eyebrow: string;
  title: string;
  items: PublishedIndexItem[];
};

export function PublishedContentIndex({ id, eyebrow, title, items }: PublishedContentIndexProps) {
  if (!items.length) return null;

  const headingId = `${id}-title`;
  return (
    <section id={id} className="published-content-index" aria-labelledby={headingId}>
      <div className="shell">
        <header className="published-content-heading">
          <span>{eyebrow}</span>
          <h2 id={headingId}>{title}</h2>
        </header>
        <div className="published-content-grid">
          {items.map((item) => (
            <Link href={item.href} key={item.href} className="published-content-card">
              {item.meta ? <small>{item.meta}</small> : null}
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <strong>Baca selengkapnya <ArrowRight size={16} aria-hidden="true" /></strong>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
