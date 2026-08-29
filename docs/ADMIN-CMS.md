# Admin & CMS Control Plane V2

## Tujuan
Panel `/admin` dibangun sebagai control plane terpisah dari website publik. Prinsip utamanya adalah **fail-closed**: fitur yang belum memiliki backend, kredensial, atau sumber data resmi tidak berpura-pura aktif.

## Autentikasi
V2 menyediakan bootstrap authentication untuk local/preview saja. Mode ini:
- memakai hash SHA-256 dari access key, bukan plaintext key di environment;
- membuat session cookie HttpOnly, Secure pada production build, SameSite=Strict;
- memakai HMAC SHA-256 untuk integritas token;
- memiliki TTL 4 jam;
- diblokir otomatis ketika `VERCEL_ENV=production`.

Bootstrap **bukan** pengganti identity provider production. Go-live tetap membutuhkan provider yang mendukung MFA, user lifecycle, disable/revoke account, dan audit login.

## Environment preview
- `ADMIN_BOOTSTRAP_ENABLED=true`
- `ADMIN_BOOTSTRAP_EMAIL=<email admin>`
- `ADMIN_BOOTSTRAP_ROLE=super_admin|content_admin|finance|editor`
- `ADMIN_BOOTSTRAP_KEY_SHA256=<64-char hex sha256>`
- `ADMIN_SESSION_SECRET=<random secret minimal 32 karakter>`

Jangan commit nilai aktual.

## RBAC
Permission tetap bersumber dari `lib/auth/permissions.ts`. Server route harus memeriksa permission lagi meskipun navigasi UI sudah menyembunyikan menu.

## Registry konten
Konten editorial disimpan sebagai JSON versioned:
- `content/cms/articles.json`
- `content/cms/activities.json`
- `content/cms/galleries.json`

Status yang didukung: `draft`, `review`, `published`, `archived`. Website publik hanya menurunkan registry dari record `published`; artikel/galeri published juga wajib memiliki `publishedAt`.

## Backend tulis
Pada tahap ini backend tulis CMS sengaja berada pada mode `disabled`. `POST /api/admin/content` sudah memiliki autentikasi, same-origin guard, RBAC, payload limit, dan server-side validation, tetapi mengembalikan `503` sampai persistence adapter resmi tersedia.

Ini mencegah data disimpan ke localStorage, filesystem sementara serverless, atau mekanisme lain yang tidak dapat dipertanggungjawabkan.

## Tahap production berikutnya
1. Pilih persistence production untuk editorial data dan audit trail.
2. Implementasi adapter `CmsWriteAdapter` dengan optimistic concurrency/transaction.
3. Tambahkan immutable application audit log.
4. Tambahkan workflow transition endpoint untuk review/publish/archive.
5. Integrasikan storage media dengan MIME + magic-byte validation, size limit, metadata consent, dan malware scanning.
6. Ganti bootstrap auth dengan identity provider + MFA.
7. Terapkan rate limit di edge/firewall untuk login dan mutation endpoints.
8. Lakukan security review dan restore drill sebelum mengaktifkan production.
