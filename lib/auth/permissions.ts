import type { AdminRole } from '@/lib/models';

export type Permission =
  | 'settings.manage'
  | 'users.manage'
  | 'membership.review'
  | 'exams.manage'
  | 'exams.take'
  | 'member_cards.issue'
  | 'member_cards.read_own'
  | 'content.read'
  | 'content.create'
  | 'content.edit_own'
  | 'content.edit_any'
  | 'content.submit'
  | 'content.review'
  | 'content.publish'
  | 'content.delete_any'
  | 'media.upload'
  | 'media.manage_any'
  | 'finance.read'
  | 'finance.manage'
  | 'reports.publish'
  | 'audit.read';

export const rolePermissions: Record<AdminRole, readonly Permission[]> = {
  super_admin: [
    'settings.manage',
    'users.manage',
    'membership.review',
    'exams.manage',
    'member_cards.issue',
    'content.read',
    'content.create',
    'content.edit_own',
    'content.edit_any',
    'content.submit',
    'content.review',
    'content.publish',
    'content.delete_any',
    'media.upload',
    'media.manage_any',
    'finance.read',
    'finance.manage',
    'reports.publish',
    'audit.read',
  ],
  core_manager: [
    'membership.review',
    'member_cards.read_own',
    'content.read',
    'content.create',
    'content.edit_own',
    'content.submit',
    'media.upload',
  ],
  member: [
    'exams.take',
    'member_cards.read_own',
    'content.read',
    'content.create',
    'content.edit_own',
    'content.submit',
    'media.upload',
  ],
};

export function can(role: AdminRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}

export function canAccessControlPlane(role: AdminRole) {
  return role === 'super_admin' || role === 'core_manager';
}

export function canEditContent(role: AdminRole, ownerId: string, actorId: string) {
  return can(role, 'content.edit_any') || (ownerId === actorId && can(role, 'content.edit_own'));
}
