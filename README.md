# Yayasan Ruang Sejahtera — Trust-First Public Platform

Rekonstruksi terbaru memindahkan proyek dari prototipe visual menjadi fondasi platform nonprofit yang mengutamakan **trust, transparency, humanity, impact, accountability, accessibility**, keamanan, dan integritas data.

## Perubahan utama

- Seluruh angka dampak dan laporan keuangan simulasi dihapus.
- Foto acak/stock placeholder dihapus dari halaman publik dan diganti sistem visual program berbasis identitas brand.
- Logo resmi digunakan sebagai identitas utama tanpa menggambar ulang.
- Homepage direkonstruksi sebagai humanitarian trust-first platform.
- Route publik mencakup Tentang, Program + detail, Kegiatan + detail, Berita + detail, Galeri + detail, Dampak, Transparansi, Organisasi, Donasi, Kontak, Pencarian, Privasi, Ketentuan, Kebijakan Donasi, Aksesibilitas, dan Disclaimer.
- Dynamic content registry berasal dari `content/cms/*.json` dan hanya record berstatus `published` yang masuk ke website publik.
- Control plane `/admin` dibangun terpisah dari chrome website publik dengan dashboard, CMS editorial, modul transparansi, dan observabilitas permission.
- Autentikasi production memakai Clerk, role/status aplikasi tersimpan di Neon PostgreSQL, dan login bootstrap sederhana dapat diaktifkan sementara pada environment deployment mana pun melalui flag eksplisit.
- RBAC server-side tepat tiga role: `super_admin`, `core_manager`, dan `member`. Hanya Super Admin memiliki authority kurasi akhir, publikasi, dan mutasi keuangan.
- Workflow editorial memakai `draft → pending_review → revision_required/approved/rejected → published` dengan metadata provenance aktor/waktu.
- Form Berita, Kegiatan, dan Galeri mempunyai server-side validation; backend tulis tetap **fail-closed** sampai persistence produksi tersedia.
- Design system, skip link, focus state, reduced motion, semantic landmark, error/loading/empty states.
- `robots`/`sitemap` bersifat aman: website tidak diindeks sampai `NEXT_PUBLIC_SITE_URL` resmi dikonfigurasi; control plane admin selalu noindex/no-store.
- Security headers baseline, fail-closed API untuk donasi/kontak/CMS mutation, serta health endpoint non-sensitif.
- Data model Drizzle, migrasi PostgreSQL, CMS architecture, RBAC, payment contract, data governance, SEO, security, dan production-readiness terdokumentasi.

## Integritas data

Jangan memasukkan data contoh ke halaman publik untuk:

- penerima manfaat;
- jumlah kegiatan/donatur;
- nilai donasi/keuangan;
- rekening/QRIS;
- alamat/kontak;
- legalitas;
- pengurus;
- mitra;
- status verifikasi/audit.

Gunakan CMS dan sumber resmi. Jika data belum ada, tampilkan empty state yang jujur.

## Admin & CMS

Registry editorial versioned:

- `content/cms/articles.json`
- `content/cms/activities.json`
- `content/cms/galleries.json`

Status workflow: `draft → pending_review → revision_required/approved/rejected → published → archived`. Public registry hanya membaca `published`. Record kurasi/published/archived wajib membawa provenance yang sesuai dan CI akan menolak metadata workflow yang tidak lengkap.

Form dan mutation endpoint sudah disiapkan, tetapi persistence write adapter sengaja dinonaktifkan sampai backend produksi dipilih dan diaudit. Tidak ada fallback ke localStorage atau filesystem serverless sementara.

Login/register pengguna berada di `/masuk` dan `/daftar`; portal pengguna di `/akun`. Selama tahap pembangunan, Super Admin dapat memakai login bootstrap sederhana dan menambahkan Core Manager dari menu Sistem. Matikan mode bootstrap sebelum go-live. Lihat `docs/AUTH-RBAC-PHASE-1.md` dan `docs/ADMIN-CMS.md`.

## Quality gates

CI menjalankan dependency install yang reproducible, integrity guard, audit RBAC, lint, TypeScript typecheck, dan production build. Preview deployment tetap diuji karena keberhasilan CI tidak menggantikan verifikasi runtime/platform.

## Environment

Salin `.env.example` ke environment deployment. Jangan commit secret.

## Dokumen arsitektur

- `docs/ADMIN-CMS.md`
- `docs/AUTH-RBAC-PHASE-1.md`
- `docs/CMS-ARCHITECTURE.md`
- `docs/DATA-GOVERNANCE.md`
- `docs/SECURITY-ARCHITECTURE.md`
- `docs/SEO-ARCHITECTURE.md`
- `docs/QUALITY-GATES.md`
- `docs/PRODUCTION-READINESS.md`
- `lib/db/schema.ts`
- `db/migrations/`

## Tahap produksi berikutnya

1. Hubungkan Clerk dan Neon ke project Vercel, jalankan migrasi, seed Super Admin, konfigurasi webhook, lalu verifikasi lifecycle session. Selama pembangunan, login bootstrap sederhana dan penambahan Core Manager dapat digunakan; sebelum go-live, matikan bootstrap dan aktifkan pengamanan final.
2. Implementasikan formulir data anggota, ujian, penilaian manusia, approval, dan kartu anggota dari schema yang tersedia.
3. Hubungkan workflow kurasi ke persistence adapter PostgreSQL dan audit log immutable.
4. Migrasi data kegiatan, berita, galeri dan dokumentasi asli melalui workflow publikasi.
5. Konfigurasi domain resmi, kontak, legalitas, organisasi, dan akun sosial.
6. Implementasi payment gateway resmi, signature webhook, idempotency, reconciliation, dan finance approval flow.
7. Implementasi laporan keuangan dan impact metrics dari sumber data resmi.
8. Uji WCAG 2.2 AA, Core Web Vitals, security, privacy, SEO, restore drill, dan payment E2E sebelum go-live.
