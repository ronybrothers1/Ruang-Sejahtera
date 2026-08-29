import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

type ContinuationLink = {
  href: string;
  label: string;
  title: string;
};

type ContentContinuationProps = {
  title?: string;
  links: ContinuationLink[];
};

export function ContentContinuation({ title = 'Lanjutkan menjelajah', links }: ContentContinuationProps) {
  return (
    <section className="content-continuation" aria-labelledby="content-continuation-title">
      <div className="shell">
        <h2 id="content-continuation-title">{title}</h2>
        <nav aria-label={title} className="content-continuation-grid">
          {links.map((item) => (
            <Link href={item.href} key={`${item.href}-${item.title}`}>
              <span>{item.label}</span>
              <strong>{item.title}</strong>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          ))}
        </nav>
      </div>
    </section>
  );
}
