# Production Readiness — Ruang Sejahtera V2

Dokumen ini adalah gerbang rilis, bukan daftar fitur dekoratif. Status `siap produksi` hanya boleh diberikan setelah seluruh kontrol kritis yang relevan dibuktikan pada deployment nyata.

## 1. Data dan publikasi

- Tidak ada statistik, kegiatan, penerima manfaat, alamat, legalitas, pengurus, kontak, mitra, rekening, QRIS, laporan, atau status audit yang direkayasa.
- Data publik berasal dari sumber resmi yang mempunyai pemilik data dan jejak perubahan.
- Aktivitas, artikel, galeri, laporan, dan impact metrics mempunyai status publikasi eksplisit.
- Record editorial `pending_review`, keputusan kurasi, `published`, dan `archived` memiliki metadata provenance aktor/waktu yang diwajibkan CI.
- Foto/video pihak rentan mempunyai metadata consent/restriction sebelum dapat menjadi `public`.
- Empty state digunakan ketika data belum tersedia.

## 2. Identitas dan domain

- Logo resmi dan asset brand disetujui.
- `NEXT_PUBLIC_SITE_URL` diisi dengan domain resmi HTTPS.
- Canonical URL, sitemap, robots, Organization JSON-LD, OG/Twitter metadata diverifikasi pada domain tersebut.
- Alamat, email, WhatsApp, peta dan akun sosial hanya diisi dari data resmi.

## 3. CMS, database dan storage

- Backend tulis CMS production telah dipilih dan diuji; fail-closed V2 tidak boleh diubah menjadi penyimpanan sementara yang tidak durable.
- Read/write adapter memakai optimistic concurrency atau transaction untuk mencegah silent overwrite.
- Database produksi menggunakan akun least-privilege terpisah untuk aplikasi dan operasi.
- Backup otomatis, retention dan restore drill diuji.
- PII donor dienkripsi sesuai threat model dan kebijakan retensi.
- Object storage memvalidasi MIME type dan magic bytes, membatasi ukuran file dan menyiapkan malware scanning.
- Audit log bersifat append-oriented dan tidak dapat diubah oleh editor konten biasa.

## 4. Authentication dan RBAC

- Bootstrap authentication preview tidak digunakan pada production.
- Production memakai identity provider dengan MFA, account lifecycle, revocation, dan audit login.
- Session menggunakan cookie Secure, HttpOnly dan SameSite yang tepat.
- MFA diwajibkan minimal untuk `super_admin` dan `finance`.
- Permission matrix diuji server-side, bukan hanya menyembunyikan menu di UI.
- Role `editor` tidak memiliki authority `content.publish`; publication authority dipisahkan ke role yang sesuai.
- Akun nonaktif kehilangan akses segera dan session aktif dapat dicabut.
- Aktivitas sensitif dicatat ke audit log.

## 5. Donasi

- Endpoint donasi tetap fail-closed sampai payment gateway resmi tersedia.
- Nominal diverifikasi di server.
- Signature webhook diverifikasi terhadap raw body.
- Event webhook diproses idempotent dan dapat direkonsiliasi dengan settlement provider.
- Sistem tidak menyimpan data kartu.
- Refund, expired, failed dan duplicate event diuji.
- Bukti donasi hanya diterbitkan setelah status pembayaran dapat dipercaya.

## 6. Security

- HTTPS dan HSTS aktif.
- Seluruh `/admin/*` dan `/api/admin/*` menggunakan no-store dan noindex response policy.
- CSP diuji pada deployment produksi; penggunaan `unsafe-inline` dievaluasi kembali dan dipersempit bila nonce/hash architecture telah tersedia.
- CSRF/same-origin protection diterapkan pada mutation berbasis cookie/session.
- Request content type dan payload limits divalidasi pada endpoint sensitif.
- Rate limiting tersedia untuk login, kontak, donasi dan endpoint sensitif pada layer yang efektif untuk serverless/edge.
- Secret hanya berada di secret manager/environment platform.
- Dependency vulnerability scan dan patch policy dijalankan berkala.
- Security headers diuji dari jaringan publik.

## 7. Accessibility dan UX

- Keyboard-only test pada seluruh jalur utama, termasuk control plane admin.
- Screen reader smoke test pada navigasi, pencarian, donasi, formulir, error, modal, dan admin workflow.
- Zoom 200–400%, mobile viewport dan orientation diuji.
- Kontras, focus order, target size dan reduced-motion diperiksa.
- WCAG 2.2 AA menjadi target baseline, dengan temuan manual dicatat sebelum rilis.

## 8. Performance dan reliability

- Core Web Vitals diukur pada deployment nyata, bukan hanya build lokal.
- Gambar dokumentasi mempunyai ukuran responsif, dimensi dan compression yang tepat.
- Tidak ada JavaScript client yang tidak diperlukan pada halaman statis.
- Public chrome tidak dirender sebagai UI admin.
- Health endpoint tidak membocorkan secret atau detail infrastruktur.
- Error monitoring dan alerting dikonfigurasi sebelum sistem menerima transaksi.

## 9. Quality gates

Setiap perubahan utama harus melewati:

1. reproducible dependency install;
2. public-content + CMS provenance integrity guard;
3. lint tanpa warning;
4. TypeScript typecheck;
5. production build;
6. preview deployment smoke test;
7. review manusia untuk konten, aksesibilitas dan keamanan sesuai risiko perubahan.

## Definisi selesai

V2 dapat disebut `production ready` hanya setelah data resmi, domain, CMS/database/storage, production identity/MFA, RBAC, audit trail, payment gateway, observability, privacy controls, accessibility test, backup/restore drill dan security verification selesai. Prototype atau preview yang berhasil build tidak cukup untuk menggantikan bukti-bukti tersebut.
