import type { PublicationStatus } from '@/lib/models';

const statusLabel: Record<PublicationStatus, string> = {
  draft: 'Draft',
  pending_review: 'Menunggu Kurasi',
  revision_required: 'Perlu Perbaikan',
  approved: 'Disetujui',
  rejected: 'Ditolak',
  published: 'Terbit',
  archived: 'Diarsipkan',
};

export function StatusBadge({ status }: { status: PublicationStatus }) {
  return <span className={`status-badge status-badge-${status}`}>{statusLabel[status]}</span>;
}
