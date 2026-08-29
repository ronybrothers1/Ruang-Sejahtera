import Link from 'next/link';
import type { NavLink } from '@/lib/navigation';

type SectionNavigationProps = {
  label: string;
  items: NavLink[];
  currentHref: string;
  currentType?: 'page' | 'location';
};

export function SectionNavigation({ label, items, currentHref, currentType = 'page' }: SectionNavigationProps) {
  return (
    <nav className="section-directory shell" aria-label={label}>
      <span>{label}</span>
      <div className="section-directory-links">
        {items.map((item) => {
          const isCurrent = item.href === currentHref;
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isCurrent ? currentType : undefined}
              className={isCurrent ? 'is-active' : undefined}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
