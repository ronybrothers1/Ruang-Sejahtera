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

Production menggunakan Clerk untuk identity lifecycle dan Neon PostgreSQL sebagai source of truth role/status. Webhook Clerk wajib diverifikasi dengan signing secret. Super Admin wajib mengaktifkan MFA sebelum control plane dapat dibuka.

Jika paket Clerk aktif belum menyediakan MFA, mode `approval` dapat diaktifkan
secara eksplisit sebagai mitigasi sementara. Mode ini mensyaratkan sesi Clerk
Super Admin yang aktif dan kunci approval terpisah. Kunci hanya disimpan
sebagai SHA-256 hash; server menerbitkan cookie HttpOnly yang ditandatangani
HMAC, terikat pada `userId` dan `sessionId`, dengan masa berlaku 30 menit.
Konfigurasi tidak lengkap atau mode tidak dikenal selalu kembali ke gate MFA.
Approval ini bukan pengganti MFA dan tidak boleh dianggap setara.

## RBAC dan publication authority
Role aplikasi tepat tiga: `super_admin`, `core_manager`, dan `member`. Pendaftar publik selalu dibuat sebagai `member`; status calon anggota disimpan terpisah sebagai membership status.

Hanya `super_admin` yang memiliki `content.review`, `content.publish`, `finance.manage`, dan `reports.publish`. Pengurus inti serta anggota hanya dapat mengedit konten miliknya sendiri dan mengirimkannya untuk kurasi.

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
Status: `draft`, `pending_review`, `revision_required`, `approved`, `rejected`, `published`, `archived`.

Workflow provenance dicatat dengan actor pseudonymous dan timestamp. CI menolak registry dengan provenance pengajuan, keputusan kurasi, publikasi, atau arsip yang hilang.

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
