import type { ReactNode } from 'react';

export function PageState({ eyebrow, title, description, icon, actions }: { eyebrow: string; title: string; description: string; icon: ReactNode; actions: ReactNode }) {
  return (
    <section className="trust-page-state">
      <div className="shell trust-page-state-inner">
        <div className="trust-page-state-icon" aria-hidden="true">{icon}</div>
        <p className="trust-page-state-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="trust-page-state-description">{description}</p>
        <div className="trust-page-state-actions">{actions}</div>
      </div>
    </section>
  );
}
