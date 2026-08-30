# Authentication, Registration, and RBAC Foundation

## Scope

This phase establishes the production identity boundary without pretending that
membership examination, card generation, CMS persistence, media upload, or
financial mutation are already live. Those workflows have database contracts,
but their write services remain fail-closed until the corresponding phase is
implemented and audited.

## Provider architecture

- Clerk provides account registration, sign-in, verified email, password
  recovery, session revocation, and MFA.
- Neon PostgreSQL is the application source of truth for role, membership
  status, content ownership, review state, finance authority, and audit logs.
- Clerk identity IDs are foreign identity references only. Application role is
  never accepted from client-editable metadata.
- Clerk webhooks are signature-verified before they can synchronize a profile.
- A signed-in user missing from PostgreSQL is synchronized server-side from the
  verified Clerk backend user record, preventing webhook delay from stranding a
  valid account.

## Role invariants

Exactly three roles exist:

| Role | Account creation | Content | Publication | Finance mutation |
| --- | --- | --- | --- | --- |
| `super_admin` | Controlled seed only | Any record | Allowed | Allowed |
| `core_manager` | Assigned by Super Admin | Own draft and submission | Denied | Denied |
| `member` | Public registration | Own draft and submission | Denied | Denied |

Public registration never accepts a role field. Every new identity is inserted
as `member`. Candidate state is represented by `membership_status`, not by a
fourth role.

## Membership states

`registered → email_verified → data_review → exam_eligible → exam_completed →
passed/failed → admin_approved → active`

`suspended` and `revoked` are access-blocking states. Identity synchronization
cannot silently reactivate them. Reattaching a deleted privileged identity also
requires an explicit administrator recovery action.

## Content workflow

`draft → pending_review → revision_required/approved/rejected → published`

- Members and core managers may submit their own records.
- Only Super Admin has `content.review` and `content.publish`.
- There is no publish permission, button contract, or server transition for
  members/core managers.
- Public pages continue to read only `published` records.

## Finance boundary

Only Super Admin receives `finance.read`, `finance.manage`, and
`reports.publish`. Core managers and members view published reports through the
public transparency page, not through internal finance permissions.

## Initial Super Admin

The initial identity is never hardcoded in Git. Prepare it after the database
migration by setting server-only environment variables and running:

```bash
INITIAL_SUPER_ADMIN_NAME="..." \
INITIAL_SUPER_ADMIN_EMAIL="..." \
npm run db:seed-super-admin
```

The seed creates a privileged PostgreSQL profile without a password or session.
The named owner must then register with the same email and complete Clerk email
verification. The application attaches the verified identity to the prepared
profile. MFA must be enabled before `/admin` is accessible.

## Required production configuration

1. Add Clerk and Neon through the Vercel Marketplace for the target project.
2. Configure Clerk paths `/masuk`, `/daftar`, and `/akun`.
3. Require email verification and enable MFA methods in Clerk.
4. Add a Clerk webhook for `/api/webhooks/clerk` with `user.created`,
   `user.updated`, and `user.deleted`.
5. Apply `npm run db:migrate` to the production database.
6. Run the controlled Super Admin seed once.
7. Verify sign-up, verification, MFA, logout, member rejection from `/admin`,
   and Super Admin access before enabling registration publicly.

## Verification gates

- `npm run typecheck`
- `npm run lint`
- `npm run integrity`
- `npm run auth:audit`
- `npm run build`

Production activation is not complete until provider credentials, migration,
webhook delivery, and an authenticated browser flow have all been verified on a
Vercel preview deployment.
