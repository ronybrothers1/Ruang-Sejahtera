# Admin & CMS Control Plane V2

## Tujuan
Panel `/admin` dibangun sebagai control plane terpisah dari website publik. Prinsip utamanya adalah **fail-closed**: fitur yang belum memiliki backend, kredensial, atau sumber data resmi tidak berpura-pura aktif.

## Autentikasi
V2 menyediakan bootstrap authentication untuk local/preview saja. Mode ini:
- menyimpan hanya SHA-256 hash dari access key di environment, bukan plaintext key;
- membuat session cookie HttpOnly, Secure pada production build, dan SameSite=Strict;
- memakai HMAC SHA-256 untuk integritas token;
- hanya memasukkan pseudonymous subject id, role, issue time, dan expiry ke payload session, tanpa email PII;
- memiliki TTL 4 jam;
- menolak session ketika bootstrap auth dimatikan;
- diblokir otomatis ketika `VERCEL_ENV=production`.

Bootstrap **bukan** pengganti identity provider production. Go-live tetap membutuhkan provider yang mendukung MFA, user lifecycle, disable/revoke account, session revocation, dan audit login.

## Environment preview
- `ADMIN_BOOTSTRAP_ENABLED=true`
- `ADMIN_BOOTSTRAP_EMAIL=<email admin>`
- `ADMIN_BOOTSTRAP_ROLE=super_admin|content_admin|finance|editor`
- `ADMIN_BOOTSTRAP_KEY_SHA256=<64-char hex sha256>`
- `ADMIN_SESSION_SECRET=<random secret minimal 32 karakter>`

Jangan commit nilai aktual. Access key preview harus memiliki entropy tinggi dan tidak dipakai ulang pada sistem lain.

## Request boundary
State-changing admin endpoint memerlukan same-origin request. Login dan mutation endpoint hanya menerima form content type yang diizinkan serta membatasi declared request size. Seluruh `/admin/*` dan `/api/admin/*` diberi `Cache-Control: private, no-store` serta `X-Robots-Tag` yang melarang indexing/archiving.

Rate limiting tetap harus diterapkan pada layer deployment/firewall production karena limiter in-memory pada serverless tidak cukup kuat sebagai kontrol keamanan.

## RBAC dan separation of duties
Permission tetap bersumber dari `lib/auth/permissions.ts`. Server route memeriksa permission kembali meskipun navigasi UI sudah menyembunyikan menu.

Role minimum:
- `super_admin`: seluruh control plane;
- `content_admin`: editorial + publication authority;
- `editor`: membuat dan menyunting, tetapi **tidak memiliki `content.publish`**;
- `finance`: modul keuangan/report sesuai permission.

Pemisahan editor dari publisher mengurangi risiko satu akun membuat sekaligus mempublikasikan konten tanpa review.

## Registry konten
Konten editorial disimpan sebagai JSON versioned:
- `content/cms/articles.json`
- `content/cms/activities.json`
- `content/cms/galleries.json`

Status yang didukung: `draft`, `review`, `published`, `archived`. Website publik hanya menurunkan registry dari record `published`.

Record menyimpan metadata provenance workflow: `lastEditedBy`, `reviewRequestedAt/By`, `publishedAt/By`, dan `archivedAt/By` sesuai statusnya. CI menolak record yang kehilangan provenance wajib.

## Workflow
Transisi yang diizinkan:
- `draft → review`
- `review → draft`
- `review → published`
- `published → archived`
- `archived → draft`

Publish/archive memerlukan `content.publish`; transisi editorial lain memerlukan `content.edit`. Timestamps dan pseudonymous actor id distempel oleh fungsi workflow server-side, bukan dipercaya dari form pengguna.

## Backend tulis
Pada tahap ini backend tulis CMS sengaja berada pada mode `disabled`. `POST /api/admin/content` sudah memiliki autentikasi, same-origin guard, RBAC, transport validation, payload limit, dan server-side content validation, tetapi mengembalikan `503` sampai persistence adapter resmi tersedia.

Ini mencegah data disimpan ke localStorage, filesystem sementara serverless, atau mekanisme lain yang tidak dapat dipertanggungjawabkan.

## Tahap production berikutnya
1. Pilih persistence production untuk editorial data dan audit trail.
2. Implementasi read/write repository adapter dengan optimistic concurrency atau transaction.
3. Tambahkan immutable application audit log.
4. Hubungkan workflow transition ke persistence adapter dan audit log.
5. Integrasikan storage media dengan MIME + magic-byte validation, size limit, metadata consent, dan malware scanning.
6. Ganti bootstrap auth dengan identity provider + MFA.
7. Terapkan rate limit di edge/firewall untuk login dan mutation endpoints.
8. Lakukan security review, accessibility review, backup/restore drill, dan disaster-recovery test sebelum mengaktifkan production.
