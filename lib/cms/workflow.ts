import { can } from '@/lib/auth/permissions';
import type { CmsRecord } from '@/lib/cms/types';
import type { AdminRole, PublicationStatus } from '@/lib/models';

export const allowedPublicationTransitions: Record<PublicationStatus, readonly PublicationStatus[]> = {
  draft: ['pending_review'],
  pending_review: ['revision_required', 'approved', 'rejected'],
  revision_required: ['pending_review'],
  approved: ['revision_required', 'published'],
  rejected: [],
  published: ['archived'],
  archived: ['draft'],
};

export function canTransitionPublication(role: AdminRole, from: PublicationStatus, to: PublicationStatus) {
  if (!allowedPublicationTransitions[from].includes(to)) return false;
  if (to === 'pending_review') return can(role, 'content.submit');
  if (to === 'revision_required' || to === 'approved' || to === 'rejected') return can(role, 'content.review');
  if (to === 'published' || to === 'archived' || from === 'published') return can(role, 'content.publish');
  return can(role, 'content.edit_any');
}

export function applyPublicationTransition(record: CmsRecord, to: PublicationStatus, actor: { id: string; role: AdminRole }) {
  if (!canTransitionPublication(actor.role, record.status, to)) throw new Error('PUBLICATION_TRANSITION_NOT_ALLOWED');
  const now = new Date().toISOString();
  const next: CmsRecord = { ...record, status: to, updatedAt: now };

  if ((record.status === 'draft' || record.status === 'revision_required') && to === 'pending_review') {
    next.reviewRequestedAt = now;
    next.reviewRequestedBy = actor.id;
  }
  if (record.status === 'pending_review' && (to === 'revision_required' || to === 'approved' || to === 'rejected')) {
    next.reviewedAt = now;
    next.reviewedBy = actor.id;
  }
  if (record.status === 'pending_review' && to === 'approved') {
    next.approvedAt = now;
    next.approvedBy = actor.id;
  }
  if (record.status === 'pending_review' && to === 'rejected') {
    next.rejectedAt = now;
    next.rejectedBy = actor.id;
  }
  if (record.status === 'approved' && to === 'published') {
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
  if ((from === 'draft' || from === 'revision_required') && to === 'pending_review') return 'Kirim untuk kurasi';
  if (from === 'pending_review' && to === 'revision_required') return 'Kembalikan untuk diperbaiki';
  if (from === 'pending_review' && to === 'approved') return 'Setujui';
  if (from === 'pending_review' && to === 'rejected') return 'Tolak';
  if (from === 'approved' && to === 'published') return 'Terbitkan';
  if (from === 'approved' && to === 'revision_required') return 'Kembalikan untuk diperbaiki';
  if (from === 'published' && to === 'archived') return 'Arsipkan';
  if (from === 'archived' && to === 'draft') return 'Pulihkan sebagai draft';
  return `${from} → ${to}`;
}
