import { can } from '@/lib/auth/permissions';
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

export function transitionLabel(from: PublicationStatus, to: PublicationStatus) {
  if (from === 'draft' && to === 'review') return 'Ajukan review';
  if (from === 'review' && to === 'draft') return 'Kembalikan ke draft';
  if (from === 'review' && to === 'published') return 'Publikasikan';
  if (from === 'published' && to === 'archived') return 'Arsipkan';
  if (from === 'archived' && to === 'draft') return 'Pulihkan sebagai draft';
  return `${from} → ${to}`;
}
