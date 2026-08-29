import { FileSearch } from 'lucide-react';
import type { ReactNode } from 'react';

export function EmptyState({
  title,
  description,
  action,
  eyebrow = 'Informasi publik',
}: {
  title: string;
  description: string;
  action?: ReactNode;
  eyebrow?: string;
}) {
  return (
    <div className="empty-state empty-state-trust" role="status">
      <div className="empty-state-icon" aria-hidden="true"><FileSearch size={22} /></div>
      <p className="empty-state-eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
