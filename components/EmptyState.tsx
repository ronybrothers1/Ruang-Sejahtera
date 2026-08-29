import { FileSearch } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state" role="status">
      <div className="empty-state-icon" aria-hidden="true"><FileSearch size={22} /></div>
      <h3 className="text-lg font-bold text-brand-ink">{title}</h3>
      <p className="mt-2 max-w-2xl text-sm leading-7 text-neutral-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
