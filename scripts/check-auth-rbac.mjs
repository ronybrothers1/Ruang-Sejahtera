import { readFileSync } from 'node:fs';

const permissions = readFileSync('lib/auth/permissions.ts', 'utf8');
const models = readFileSync('lib/models.ts', 'utf8');
const workflow = readFileSync('lib/cms/workflow.ts', 'utf8');
const schema = readFileSync('lib/db/schema.ts', 'utf8');
const proxy = readFileSync('proxy.ts', 'utf8');
const session = readFileSync('lib/auth/admin-session.ts', 'utf8');
const gate = readFileSync('lib/auth/control-plane-gate.ts', 'utf8');
const contentRoute = readFileSync('app/api/admin/content/route.ts', 'utf8');
const config = readFileSync('lib/auth/config.ts', 'utf8');
const coreManagersRoute = readFileSync('app/api/admin/core-managers/route.ts', 'utf8');

const failures = [];
const requireSource = (condition, message) => { if (!condition) failures.push(message); };

requireSource(models.includes("'super_admin' | 'core_manager' | 'member'"), 'Exactly three application roles must be declared.');
requireSource(!/content_admin|role text NOT NULL CHECK/.test(models + permissions + schema), 'Legacy role model must not remain in active authorization code.');
requireSource(/core_manager:\s*\[[\s\S]*?'content\.submit'/.test(permissions), 'Core managers must be able to submit content.');
requireSource(/member:\s*\[[\s\S]*?'content\.submit'/.test(permissions), 'Members must be able to submit content.');
requireSource(!/core_manager:\s*\[[\s\S]*?'content\.publish'/.test(permissions), 'Core managers must never receive publish permission.');
requireSource(!/member:\s*\[[\s\S]*?'content\.publish'/.test(permissions), 'Members must never receive publish permission.');
requireSource(!/core_manager:\s*\[[\s\S]*?'finance\.manage'/.test(permissions), 'Core managers must never receive finance mutation permission.');
requireSource(!/member:\s*\[[\s\S]*?'finance\.manage'/.test(permissions), 'Members must never receive finance mutation permission.');
requireSource(!/core_manager:\s*\[[\s\S]*?'finance\.read'/.test(permissions), 'Core managers must not receive internal finance access; public reports use the public route.');
requireSource(!/member:\s*\[[\s\S]*?'finance\.read'/.test(permissions), 'Members must not receive internal finance access; public reports use the public route.');
requireSource(workflow.includes("to === 'published'") && workflow.includes("can(role, 'content.publish')"), 'Publishing must be permission-gated server-side.');
requireSource(schema.includes("verificationTokenHash") && !schema.includes('verificationToken:'), 'Member QR verification must store only a token hash.');
requireSource(proxy.includes("'/akun(.*)'") && proxy.includes("'/admin(.*)'") && proxy.includes('isPublicAdminAuthRoute'), 'Account and control-plane routes must be protected at the routing boundary.');
requireSource(session.includes('hasControlPlaneAccess') && session.includes('mfaRequired'), 'Control-plane access must be checked server-side with the MFA/compensating gate.');
requireSource(config.includes('isBootstrapEnabledForEnvironment') && config.includes('ADMIN_BOOTSTRAP_ALLOW_PRODUCTION'), 'Simple admin login must be explicitly environment-gated.');
requireSource(gate.includes('timingSafeEqual') && gate.includes('sessionId') && gate.includes('CONTROL_PLANE_APPROVAL_TTL_SECONDS'), 'Temporary approval must be HMAC-verified, session-bound, and short-lived.');
requireSource(contentRoute.includes('hasControlPlaneAccess'), 'Admin content mutations must enforce the control-plane gate, not only role permissions.');
requireSource(coreManagersRoute.includes('requireSuperAdminSession') && coreManagersRoute.includes('createCoreManager'), 'Core Manager provisioning must be Super Admin-only and use the server-side user service.');

if (failures.length) {
  console.error(`Auth/RBAC audit failed (${failures.length}):\n${failures.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log('Auth/RBAC audit passed: three roles, Super Admin-only publishing/finance, hashed card token, and protected routes verified.');
