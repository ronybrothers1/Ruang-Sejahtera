# Production Readiness — Ruang Sejahtera V2

Dokumen ini adalah gerbang rilis, bukan daftar fitur dekoratif. Status `siap produksi` hanya boleh diberikan setelah seluruh kontrol kritis yang relevan dibuktikan pada deployment nyata.

## 1. Data dan publikasi

- Tidak ada statistik, kegiatan, penerima manfaat, alamat, legalitas, pengurus, kontak, mitra, rekening, QRIS, laporan, atau status audit yang direkayasa.
- Data publik berasal dari sumber resmi yang mempunyai pemilik data dan jejak perubahan.
- Aktivitas, artikel, galeri, laporan, dan impact metrics mempunyai status publikasi eksplisit.
- Foto/video pihak rentan mempunyai metadata consent/restriction sebelum dapat menjadi `public`.
- Empty state digunakan ketika data belum tersedia.

## 2. Identitas dan domain

- Logo resmi dan asset brand disetujui.
- `NEXT_PUBLIC_SITE_URL` diisi dengan domain resmi HTTPS.
- Canonical URL, sitemap, robots, Organization JSON-LD, OG/Twitter metadata diverifikasi pada domain tersebut.
- Alamat, email, WhatsApp, peta dan akun sosial hanya diisi dari data resmi.

## 3. CMS, database dan storage

- Database produksi menggunakan akun least-privilege terpisah untuk aplikasi dan operasi.
- Backup otomatis, retention dan restore drill diuji.
- PII donor dienkripsi sesuai threat model dan kebijakan retensi.
- Object storage memvalidasi MIME type dan magic bytes, membatasi ukuran file dan menyiapkan malware scanning.
- Audit log bersifat append-oriented dan tidak dapat diubah oleh editor konten biasa.

## 4. Authentication dan RBAC

- Session menggunakan cookie Secure, HttpOnly dan SameSite yang tepat.
- MFA diwajibkan minimal untuk `super_admin` dan `finance`.
- Permission matrix diuji server-side, bukan hanya menyembunyikan menu di UI.
- Akun nonaktif kehilangan akses segera.
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
- CSP diuji pada deployment produksi; penggunaan `unsafe-inline` dievaluasi kembali dan dipersempit bila nonce/hash architecture telah tersedia.
- CSRF protection diterapkan pada mutation berbasis cookie/session.
- Rate limiting tersedia untuk login, kontak, donasi dan endpoint sensitif.
- Secret hanya berada di secret manager/environment platform.
- Dependency vulnerability scan dan patch policy dijalankan berkala.
- Security headers diuji dari jaringan publik.

## 7. Accessibility dan UX

- Keyboard-only test pada seluruh jalur utama.
- Screen reader smoke test pada navigasi, pencarian, donasi, formulir, error dan modal.
- Zoom 200–400%, mobile viewport dan orientation diuji.
- Kontras, focus order, target size dan reduced-motion diperiksa.
- WCAG 2.2 AA menjadi target baseline, dengan temuan manual dicatat sebelum rilis.

## 8. Performance dan reliability

- Core Web Vitals diukur pada deployment nyata, bukan hanya build lokal.
- Gambar dokumentasi mempunyai ukuran responsif, dimensi dan compression yang tepat.
- Tidak ada JavaScript client yang tidak diperlukan pada halaman statis.
- Health endpoint tidak membocorkan secret atau detail infrastruktur.
- Error monitoring dan alerting dikonfigurasi sebelum sistem menerima transaksi.

## 9. Quality gates

Setiap perubahan utama harus melewati:

1. reproducible dependency install;
2. public-content integrity guard;
3. lint tanpa warning;
4. TypeScript typecheck;
5. production build;
6. preview deployment smoke test;
7. review manusia untuk konten, aksesibilitas dan keamanan sesuai risiko perubahan.

## Definisi selesai

V2 dapat disebut `production ready` hanya setelah data resmi, domain, CMS/database/storage, auth/RBAC, payment gateway, observability, privacy controls, accessibility test dan security verification selesai. Prototype atau preview yang berhasil build tidak cukup untuk menggantikan bukti-bukti tersebut.
