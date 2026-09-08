# Authentication, Registration, and RBAC Foundation

## Scope

Phase 1 establishes the production identity boundary, user roles, database contracts, and server-side authorization. It does not pretend that later financial, CMS, media, or donation workflows are already production-complete.

The operational principle is simple: security must remain strong in the backend without forcing users through unnecessary login steps.

## Login experience

All users use one sign-in entry point:

`/masuk`

The expected flow is:

`email or username + password → sign in → destination by role`

There is no separate Super Admin access key, no application-level MFA blocker, and no temporary approval-key page. Password recovery, session handling, identity verification, and credential security remain the responsibility of Clerk.

MFA may still be offered as an optional identity-provider feature in the future, but the application does not require it before routine access.

## Provider architecture

- Clerk provides registration, sign-in, password recovery, sessions, and identity lifecycle.
- Neon PostgreSQL is the application source of truth for role, membership status, content ownership, review state, finance authority, and audit logs.
- Clerk identity IDs are foreign identity references only. Application role is never accepted from client-editable metadata.
- Clerk webhooks are signature-verified before synchronizing a profile or writing session lifecycle events.
- A signed-in identity missing from PostgreSQL is synchronized server-side from the verified Clerk backend user record.
- Login, logout, and administrative session revocation are written to the application audit trail from Clerk session events. Duplicate webhook deliveries are ignored, and a session event received before its user record exists returns a retryable server error rather than losing the audit entry.

## Role invariants

Exactly three application roles exist:

| Role | Account creation | Internal area | Content | Finance authority |
| --- | --- | --- | --- | --- |
| `super_admin` | Controlled initial seed | Full control plane | Full management/publish | Allowed |
| `core_manager` | Assigned by Super Admin | Operational control plane | Create/edit/submit | Not granted in Phase 1 |
| `member` | Public registration | Own account only | Own draft/submission | Denied |

Public registration never accepts a role field. Every public registration starts as `member`.

## Authorization rules

Authorization is enforced server-side. Hiding a menu is not treated as a security control.

- `/akun` requires an authenticated account.
- `/admin` and `/api/admin/*` require an authenticated identity at the routing boundary when Clerk is configured.
- `requireAdminSession()` verifies the application role again on the server.
- `requireSuperAdminSession()` protects Super Admin-only operations.
- Members attempting to open the control plane are redirected to their account area.
- Suspended, revoked, deleted, or inactive profiles cannot obtain an application session.

## Membership states

`registered → email_verified → data_review → exam_eligible → exam_completed → passed/failed → admin_approved → active`

`suspended` and `revoked` remain access-blocking states.

## Content workflow

`draft → pending_review → revision_required/approved/rejected → published`

- Members and Core Managers may submit their own records.
- Only Super Admin has `content.review` and `content.publish` in the current Phase 1 permission matrix.
- Public pages read only published records.

## Finance boundary

Only Super Admin currently receives internal `finance.read`, `finance.manage`, and `reports.publish` permissions. The final Phase 2 financial UX will remain simple for operators: normal add/edit/delete interactions, with validation, balance recalculation, and audit responsibilities handled by the system rather than by a complicated manual workflow.

## Initial Super Admin

The initial privileged identity is never hardcoded in Git.

After database migration, prepare it with server-only environment variables:

```bash
INITIAL_SUPER_ADMIN_NAME="..." \
INITIAL_SUPER_ADMIN_EMAIL="..." \
npm run db:seed-super-admin
```

The seed creates the PostgreSQL profile without storing a password. The owner then signs up or signs in through `/masuk` using the same verified identity. Passwords remain entirely in the identity provider.

## Required production configuration

1. Configure Clerk credentials in the Vercel project.
2. Configure Neon `DATABASE_URL`.
3. Configure Clerk paths `/masuk`, `/daftar`, and `/akun`.
4. Enable the desired sign-in identifiers in Clerk. Email/password is required; username may also be enabled for convenience.
5. Add the Clerk webhook `/api/webhooks/clerk` and subscribe to `user.created`, `user.updated`, `user.deleted`, `session.created`, `session.ended`, and `session.revoked`.
6. Store the endpoint signing secret as `CLERK_WEBHOOK_SIGNING_SECRET` in the matching Vercel environment.
7. Apply `npm run db:migrate` explicitly to the intended database. Migration is deliberately not part of the generic Vercel build command so preview deployments cannot silently mutate a production database.
8. Run the controlled Super Admin seed once.
9. Verify sign-in, password recovery, logout, role redirect, member rejection from `/admin`, Super Admin/Core Manager access, and session audit entries on a preview deployment.

## Environment policy

The following legacy mechanisms are intentionally removed from Phase 1:

- `ADMIN_BOOTSTRAP_KEY_SHA256`
- `ADMIN_SESSION_SECRET`
- `ADMIN_CONTROL_PLANE_APPROVAL_KEY_SHA256`
- `ADMIN_CONTROL_PLANE_APPROVAL_SECRET`
- application-level MFA gating

This reduces both operational friction and unnecessary authentication code while preserving role checks in the server and database application layer.

## Verification gates

- `npm run typecheck`
- `npm run lint`
- `npm run integrity`
- `npm run auth:audit`
- `npm run build`

Production activation is not complete until provider credentials, migration, webhook delivery, session audit delivery, and browser login flow have been verified on a Vercel preview deployment.
