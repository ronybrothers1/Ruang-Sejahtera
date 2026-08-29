# Security Architecture V2

## Prinsip
- **Fail closed**: payment, contact, CMS mutation, atau autentikasi yang belum dikonfigurasi tidak boleh berpura-pura aktif.
- **Server-side authorization**: kontrol UI tidak pernah menjadi satu-satunya pembatas akses.
- **Least privilege**: finance, editorial, publication, settings, dan user management dipisahkan.
- **No secret in repository**: secret hanya berasal dari environment/secret manager.
- **No fabricated assurance**: website tidak menampilkan klaim aman, terverifikasi, diaudit, atau terenkripsi tanpa kontrol nyata yang mendukung klaim tersebut.

## Session dan authentication
Bootstrap admin authentication V2 hanya diperbolehkan pada local/preview dan diblokir ketika `VERCEL_ENV=production`.

Kontrol bootstrap:
- access key disimpan sebagai SHA-256 hash pada environment;
- session token ditandatangani HMAC SHA-256;
- payload hanya berisi pseudonymous subject id, role, issue time, expiry;
- cookie HttpOnly + SameSite=Strict dan Secure pada production build;
- TTL 4 jam;
- session tidak diterima ketika bootstrap configuration dimatikan.

Production wajib menggunakan identity provider yang mendukung MFA, account lifecycle, session revocation, dan audit login.

## RBAC dan publication authority
Role minimum: `super_admin`, `content_admin`, `finance`, `editor`.

Editor dapat membuat dan menyunting konten tetapi tidak memiliki `content.publish`. Content administrator memiliki publication authority. Finance tidak mendapat kewenangan editorial hanya karena dapat membaca konten.

Semua mutation endpoint harus mengulang permission check di server.

## Request security
State-changing admin route:
- memerlukan same-origin request;
- hanya menerima content type form yang diizinkan;
- menerapkan declared payload size limit;
- memvalidasi seluruh field di server;
- tidak menerima actor id, publication timestamp, atau permission dari input pengguna.

Rate limiting harus diterapkan pada edge/firewall/provider yang konsisten pada lingkungan serverless. In-memory limiter per instance bukan kontrol production yang memadai.

## CMS workflow integrity
Status: `draft`, `review`, `published`, `archived`.

Workflow provenance dicatat dengan actor pseudonymous dan timestamp. CI menolak registry dengan provenance yang hilang pada status review/published/archived.

Backend tulis CMS masih disabled. Tidak ada localStorage atau filesystem ephemeral sebagai fallback. Persistence production harus mendukung concurrency control dan immutable audit trail.

## Media
Sebelum upload produksi diaktifkan:
- allowlist extension dan MIME;
- verifikasi magic bytes;
- batas ukuran dan dimensi;
- random object key, bukan filename pengguna;
- malware scanning readiness;
- metadata alt text/caption;
- consent status dan vulnerable-person flag;
- private/restricted/public visibility.

## Payment
Aplikasi tidak menyimpan data kartu. Payment adapter wajib memverifikasi signature webhook dari raw body, memproses event secara idempotent, memvalidasi nominal dan currency server-side, serta menyediakan reconciliation terhadap settlement provider.

## HTTP headers
Baseline mencakup HSTS, CSP, X-Content-Type-Options, X-Frame-Options DENY, Referrer-Policy, COOP, CORP, Permissions-Policy, X-Permitted-Cross-Domain-Policies, dan Origin-Agent-Cluster.

`/admin/*` dan `/api/admin/*` mendapat `Cache-Control: private, no-store` serta `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet`.

CSP saat ini masih mengizinkan inline style/script yang diperlukan framework. Sebelum go-live, evaluasi nonce/hash architecture agar `unsafe-inline` dapat dipersempit tanpa merusak runtime.

## Audit dan recovery
Production membutuhkan:
- append-oriented application audit log;
- actor, action, resource, timestamp, dan safe metadata;
- log yang tidak dapat diedit oleh editor biasa;
- monitoring/alerting untuk auth/payment error;
- backup + retention policy;
- restore drill dan disaster-recovery procedure.
