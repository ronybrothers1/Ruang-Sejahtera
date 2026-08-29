import type { AdminRole } from '@/lib/models';

export type Permission =
  | 'settings.manage'
  | 'users.manage'
  | 'content.read'
  | 'content.create'
  | 'content.edit'
  | 'content.publish'
  | 'content.delete'
  | 'media.manage'
  | 'finance.read'
  | 'finance.manage'
  | 'reports.publish'
  | 'audit.read';

export const rolePermissions: Record<AdminRole, readonly Permission[]> = {
  super_admin: ['settings.manage', 'users.manage', 'content.read', 'content.create', 'content.edit', 'content.publish', 'content.delete', 'media.manage', 'finance.read', 'finance.manage', 'reports.publish', 'audit.read'],
  content_admin: ['content.read', 'content.create', 'content.edit', 'content.publish', 'content.delete', 'media.manage'],
  finance: ['content.read', 'finance.read', 'finance.manage', 'reports.publish', 'audit.read'],
  editor: ['content.read', 'content.create', 'content.edit', 'content.publish', 'media.manage'],
};

export function can(role: AdminRole, permission: Permission) {
  return rolePermissions[role].includes(permission);
}
