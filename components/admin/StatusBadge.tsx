import type { PublicationStatus } from '@/lib/models';

const statusLabel: Record<PublicationStatus, string> = {
  draft: 'Draft',
  review: 'Review',
  published: 'Published',
  archived: 'Archived',
};

export function StatusBadge({ status }: { status: PublicationStatus }) {
  return <span className={`status-badge status-badge-${status}`}>{statusLabel[status]}</span>;
}
