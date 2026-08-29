import { can } from '@/lib/auth/permissions';
import type { CmsRecord } from '@/lib/cms/types';
import type { AdminRole, PublicationStatus } from '@/lib/models';

export const allowedPublicationTransitions: Record<PublicationStatus, readonly PublicationStatus[]> = {
  draft: ['review'],
  review: ['draft', 'published'],
  published: ['archived'],
  archived: ['draft'],
};

export function canTransitionPublication(role: AdminRole, from: PublicationStatus, to: PublicationStatus) {
  if (!allowedPublicationTransitions[from].includes(to)) return false;
  if (to === 'published' || from === 'published') return can(role, 'content.publish');
  return can(role, 'content.edit');
}

export function applyPublicationTransition(record: CmsRecord, to: PublicationStatus, actor: { id: string; role: AdminRole }) {
  if (!canTransitionPublication(actor.role, record.status, to)) throw new Error('PUBLICATION_TRANSITION_NOT_ALLOWED');
  const now = new Date().toISOString();
  const next: CmsRecord = { ...record, status: to, updatedAt: now };

  if (record.status === 'draft' && to === 'review') {
    next.reviewRequestedAt = now;
    next.reviewRequestedBy = actor.id;
  }
  if (record.status === 'review' && to === 'published') {
    next.publishedAt = now;
    next.publishedBy = actor.id;
  }
  if (record.status === 'published' && to === 'archived') {
    next.archivedAt = now;
    next.archivedBy = actor.id;
  }

  return next;
}

export function transitionLabel(from: PublicationStatus, to: PublicationStatus) {
  if (from === 'draft' && to === 'review') return 'Ajukan review';
  if (from === 'review' && to === 'draft') return 'Kembalikan ke draft';
  if (from === 'review' && to === 'published') return 'Publikasikan';
  if (from === 'published' && to === 'archived') return 'Arsipkan';
  if (from === 'archived' && to === 'draft') return 'Pulihkan sebagai draft';
  return `${from} → ${to}`;
}
