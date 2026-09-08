import { readFileSync } from 'node:fs';

const permissions = readFileSync('lib/auth/permissions.ts', 'utf8');
const models = readFileSync('lib/models.ts', 'utf8');
const workflow = readFileSync('lib/cms/workflow.ts', 'utf8');
const schema = readFileSync('lib/db/schema.ts', 'utf8');
const proxy = readFileSync('proxy.ts', 'utf8');
const session = readFileSync('lib/auth/admin-session.ts', 'utf8');
const sessionAudit = readFileSync('lib/auth/session-audit.ts', 'utf8');
const clerkWebhook = readFileSync('app/api/webhooks/clerk/route.ts', 'utf8');
const adminLogin = readFileSync('app/admin/login/page.tsx', 'utf8');
const envExample = readFileSync('.env.example', 'utf8');
const contentRoute = readFileSync('app/api/admin/content/route.ts', 'utf8');
const coreManagersRoute = readFileSync('app/api/admin/core-managers/route.ts', 'utf8');

const failures = [];
const requireSource = (condition, message) => { if (!condition) failures.push(message); };

requireSource(models.includes("'super_admin' | 'core_manager' | 'member'"), 'Exactly three application roles must be declared.');
requireSource(!/content_admin|role text NOT NULL CHECK/.test(models + permissions + schema), 'Legacy role model must not remain in active authorization code.');
requireSource(/core_manager:\s*\[[\s\S]*?'content\.submit'/.test(permissions), 'Core managers must be able to submit content.');
requireSource(/member:\s*\[[\s\S]*?'content\.submit'/.test(permissions), 'Members must be able to submit content.');
requireSource(!/core_manager:\s*\[[\s\S]*?'content\.publish'/.test(permissions), 'Core managers must never receive publish permission.');
requireSource(!/member:\s*\[[\s\S]*?'content\.publish'/.test(permissions), 'Members must never receive publish permission.');
requireSource(!/core_manager:\s*\[[\s\S]*?'finance\.manage'/.test(permissions), 'Core managers must not receive finance mutation permission in Phase 1.');
requireSource(!/member:\s*\[[\s\S]*?'finance\.manage'/.test(permissions), 'Members must never receive finance mutation permission.');
requireSource(workflow.includes("to === 'published'") && workflow.includes("can(role, 'content.publish')"), 'Publishing must be permission-gated server-side.');
requireSource(schema.includes('verificationTokenHash') && !schema.includes('verificationToken:'), 'Member QR verification must store only a token hash.');
requireSource(proxy.includes("'/akun(.*)'") && proxy.includes("'/admin(.*)'") && proxy.includes('auth.protect()'), 'Account and admin routes must be protected at the routing boundary.');
requireSource(session.includes('canAccessControlPlane(session.role)') && session.includes("redirect('/masuk?redirect_url=%2Fadmin')"), 'Admin access must use the shared sign-in route and server-side role authorization.');
requireSource(adminLogin.includes("redirect('/masuk?redirect_url=%2Fadmin')"), 'Legacy /admin/login must forward to the shared sign-in page.');
requireSource(session.includes("authMethod: 'clerk'") && !session.includes('verifyBootstrapAccessKey'), 'Application sessions must use the configured identity provider, not a separate admin key.');
requireSource(!/ADMIN_BOOTSTRAP_|ADMIN_CONTROL_PLANE_|ADMIN_SESSION_SECRET/.test(envExample), 'Legacy bootstrap/approval secrets must not remain in the environment contract.');
requireSource(contentRoute.includes('hasControlPlaneAccess'), 'Admin content mutations must enforce control-plane authorization server-side.');
requireSource(coreManagersRoute.includes('requireSuperAdminSession') && coreManagersRoute.includes('createCoreManager'), 'Core Manager provisioning must be Super Admin-only and use the server-side user service.');
requireSource(
  ['session.created', 'session.ended', 'session.revoked'].every((eventType) => clerkWebhook.includes(eventType))
    && clerkWebhook.includes('auditIdentitySession'),
  'Clerk session lifecycle events must be written to the application audit trail.',
);
requireSource(
  sessionAudit.includes("'identity.login'")
    && sessionAudit.includes("'identity.logout'")
    && sessionAudit.includes("'identity.session_revoked'")
    && sessionAudit.includes('SESSION_AUDIT_USER_NOT_SYNCED')
    && sessionAudit.includes('auditLogs.resourceId'),
  'Session audit must cover login/logout/revocation, retry when identity sync lags, and suppress duplicate deliveries.',
);

if (failures.length) {
  console.error(`Auth/RBAC audit failed (${failures.length}):\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log('Auth/RBAC audit passed: shared Clerk login, three roles, server-side admin authorization, session lifecycle auditing, Super Admin-only publishing/finance, and protected routes verified.');
